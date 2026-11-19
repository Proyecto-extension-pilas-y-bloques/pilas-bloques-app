import { mergeConfigurations, configToExpectation, expectationFor } from '../../../../../components/blockly/mulang/challengeExpectations'
import * as Blockly from 'blockly/core'
import { parseExpect } from '../../../../../components/blockly/mulang/expectations'
import { entryPointType } from '../../../../../components/blockly/mulang/blockUtils'

// Mock getPathToChallenge
jest.mock('../../../../../staticData/challenges', () => ({
  getPathToChallenge: (id: string) => {
    if (id === 'challenge_with_hierarchy') {
      return {
        book: { expectations: { decomposition: true } },
        chapter: { expectations: { simpleRepetition: true } },
        group: { expectations: {} },
        challenge: { expectations: { decomposition: false } }
      }
    }
    return { book: null, chapter: null, group: null, challenge: null }
  }
}))

describe('Challenge Expectations', () => {

  const expectationsConfigMock = {
    decomposition: true,
    simpleRepetition: true,
    conditionalAlternative: true
  }

  const workspaceMock = {} as Blockly.WorkspaceSvg
  const defaultProcedureName = 'Hacer algo'

  const expectationsIn = (expectation: string) =>
    Array.from(expectation.matchAll(/expectation "([^"]+)"/g)).map(([, encoded]) => parseExpect(atob(encoded)))

  const idsIn = (expectation: string) => expectationsIn(expectation).map(([id]) => id)

  const procedureBlock = (name: string) => ({
    type: 'procedures_defnoreturn',
    getFieldValue: () => name,
    getDescendants: () => []
  })

  const workspaceWith = (...blocks: any[]) => ({ getAllBlocks: () => blocks }) as unknown as Blockly.WorkspaceSvg

  const workspaceWithNestedControlStructures = () => {
    const outer: any = { type: 'Repetir', getSurroundParent: () => null }
    const inner: any = { type: 'Repetir', getSurroundParent: () => outer, getDescendants: () => [inner] }
    const main: any = { type: entryPointType, getFieldValue: () => undefined, getDescendants: () => [main, outer, inner] }
    outer.getDescendants = () => [outer, inner]
    return workspaceWith(main)
  }

  const workspaceWithProcedure = workspaceWith(procedureBlock('Hacer camino'))

  describe('mergeConfigurations', () => {
    it('merged expectations for a single expectation configuration', () => {
      expect(mergeConfigurations([expectationsConfigMock])).toEqual(expectationsConfigMock)
    })

    it('merged expectations for no expectations configuration should be an empty object', () => {
      expect(mergeConfigurations([])).toEqual({})
    })

    it('merged expectations for multiple configurations without keys in common', () => {
      const conditionalAlternativeConfig = {
        conditionalAlternative: true
      }
      const mergedConfig = {
        decomposition: true,
        simpleRepetition: true,
        conditionalAlternative: true
      }
      expect(mergeConfigurations([expectationsConfigMock, conditionalAlternativeConfig])).toEqual(mergedConfig)
    })

    it('merged expectations for multiple configurations with keys in common should prioritize values with higher priority', () => {
      const configWithHigherPriority = {
        decomposition: false
      }
      const mergedConfig = {
        decomposition: false,
        simpleRepetition: true,
        conditionalAlternative: true
      }
      expect(mergeConfigurations([expectationsConfigMock, configWithHigherPriority])).toEqual(mergedConfig)
    })
  })

  describe('configToExpectation', () => {
    it('multiple nonexistent expectations ids are transformed to a noExpectation (empty)', () => {
      const nonexistenteEpectations = {
        foo: true,
        bar: false,
        baz: true
      }
      const result = configToExpectation(nonexistenteEpectations, workspaceMock, defaultProcedureName)
      expect(result).toBe('')
    })

    it('if a challenge does not define expectations, noExpectation is applied', () => {
      const result = configToExpectation({}, workspaceMock, defaultProcedureName)
      expect(result).toBe('')
    })

    it('applies valid expectations successfully', () => {
      // Test that it returns a string when valid configs are passed
      const result = configToExpectation({ simpleRepetition: true }, workspaceMock, defaultProcedureName)
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
      expect(result).toContain('uses repeat')
    })
  })

  describe('individual rules', () => {
    it('mainNotTooLong only checks the main program, with the default limit', () => {
      const result = configToExpectation({ mainNotTooLong: true }, workspaceWithProcedure, defaultProcedureName)
      const [[id, params], ...others] = expectationsIn(result)

      expect(id).toBe('main_too_long')
      expect(params.declaration).toBe(entryPointType)
      expect(Number(params.limit)).toBe(7)
      expect(others).toEqual([])
    })

    it('maxProgramLength changes the limit of the length rules', () => {
      const config = { mainNotTooLong: true, proceduresNotTooLong: true, maxProgramLength: 5 }
      const result = configToExpectation(config, workspaceWithProcedure, defaultProcedureName)

      expect(idsIn(result)).toEqual(['main_too_long', 'too_long'])
      expectationsIn(result).forEach(([, params]) => expect(Number(params.limit)).toBe(5))
    })

    it('maxProgramLength is not a rule by itself', () => {
      const result = configToExpectation({ maxProgramLength: 5 }, workspaceWithProcedure, defaultProcedureName)
      expect(result).toBe('')
    })

    it('proceduresNotTooLong only checks procedures', () => {
      const result = configToExpectation({ proceduresNotTooLong: true }, workspaceWithProcedure, defaultProcedureName)
      const [[id, params], ...others] = expectationsIn(result)

      expect(id).toBe('too_long')
      expect(params.declaration).toBe('Hacer camino')
      expect(others).toEqual([])
    })

    it('noEmptyProcedures only checks that procedures do something', () => {
      const result = configToExpectation({ noEmptyProcedures: true }, workspaceWithProcedure, defaultProcedureName)
      expect(idsIn(result)).toEqual(['do_something'])
    })

    it('proceduresNamed only checks that procedures were renamed', () => {
      const result = configToExpectation({ proceduresNamed: true }, workspaceWithProcedure, defaultProcedureName)
      expect(idsIn(result)).toEqual(['name_was_changed'])
    })

    it('doesNotNestControlStructures detects nested control structures', () => {
      const result = configToExpectation({ doesNotNestControlStructures: true }, workspaceWithNestedControlStructures(), defaultProcedureName)
      const [[id, params]] = expectationsIn(result)

      expect(id).toBe('does_not_nest_control_structures')
      expect(params.declaration).toBe(entryPointType)
    })

    it('doesNotNestControlStructures generates nothing when there is nothing nested', () => {
      const result = configToExpectation({ doesNotNestControlStructures: true }, workspaceWithProcedure, defaultProcedureName)
      expect(result).toBe('')
    })

    it('rules set in false are not applied', () => {
      const config = { mainNotTooLong: false, proceduresNamed: true }
      const result = configToExpectation(config, workspaceWithProcedure, defaultProcedureName)
      expect(idsIn(result)).toEqual(['name_was_changed'])
    })

    it('decomposition still groups all the decomposition rules', () => {
      const result = configToExpectation({ decomposition: true }, workspaceWithProcedure, defaultProcedureName)

      expect(idsIn(result)).toEqual([
        'main_too_long',
        'too_long',
        'do_something',
        'is_used',
        'is_used_from_main',
        'does_not_use_recursion',
        'name_was_changed'
      ])
    })

    it('decomposition with maxProgramLength is the same as the decomposition with that limit', () => {
      const withLimit = configToExpectation({ decomposition: true, maxProgramLength: 9 }, workspaceWithProcedure, defaultProcedureName)
      const decomposition9 = configToExpectation({ decomposition9: true }, workspaceWithProcedure, defaultProcedureName)

      expect(withLimit).toBe(decomposition9)
    })

    it('an expectation asked by more than one rule is not repeated', () => {
      const config = { decomposition: true, mainNotTooLong: true, proceduresNotTooLong: true, proceduresNamed: true }
      const ids = idsIn(configToExpectation(config, workspaceWithProcedure, defaultProcedureName))

      expect(ids.filter(id => id === 'main_too_long')).toHaveLength(1)
      expect(ids.filter(id => id === 'too_long')).toHaveLength(1)
      expect(ids.filter(id => id === 'name_was_changed')).toHaveLength(1)
    })
  })

  describe('expectationFor', () => {
    it('expectations from book, chapter, group and challenge should be combined', () => {
      const challenge = { id: 'challenge_with_hierarchy' }
      const result = expectationFor(challenge, workspaceMock, defaultProcedureName)

      // simpleRepetition should be true (from chapter)
      // decomposition should be false (challenge overrides book)
      expect(result).toContain('uses repeat')
      expect(result).not.toContain('does not nest control structures') // part of decomposition
    })

    it('returns empty expectation for a challenge with no hierarchy or expectations', () => {
      const challenge = { id: 'some_other_challenge' }
      const result = expectationFor(challenge, workspaceMock, defaultProcedureName)
      expect(result).toBe('')
    })

    it('a challenge without id (e.g. made with the creator) uses its own expectations', () => {
      const challenge = { id: 0, expectations: { simpleRepetition: true } }
      const result = expectationFor(challenge, workspaceMock, defaultProcedureName)
      expect(idsIn(result)).toEqual(['uses_simple_repetition'])
    })

    it('a challenge without id and without expectations has no expectations', () => {
      const result = expectationFor({ id: 0 }, workspaceMock, defaultProcedureName)
      expect(result).toBe('')
    })
  })

})
