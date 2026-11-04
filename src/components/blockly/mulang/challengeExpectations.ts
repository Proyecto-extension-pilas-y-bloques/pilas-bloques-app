import * as Blockly from 'blockly/core'
import { getPathToChallenge } from '../../../staticData/challenges'
import {
  allProceduresShould,
  doesNotUseRecursion,
  doSomething,
  isUsed,
  isUsedFromMain,
  multiExpect,
  notTooLong,
  mainNotTooLong,
  noExpectation,
  nameWasChanged,
  doesNotNestControlStructures,
  usesSimpleRepetition,
  usesConditionalAlternative,
  usesConditionalRepetition,
} from './expectations'

export const DEFAULT_MAX_PROGRAM_LENGTH = 7

type ExpectationsConfigValues = Record<string, boolean | number>

const idsToExpectations = (defaultProcedureName: string, limit = DEFAULT_MAX_PROGRAM_LENGTH) => ({
  decomposition: multiExpect(
    () => mainNotTooLong(limit),
    doesNotNestControlStructures,
    allProceduresShould(
      notTooLong(limit),
      doSomething,
      isUsed,
      isUsedFromMain,
      doesNotUseRecursion,
      nameWasChanged(defaultProcedureName)
    )
  ),

  mainNotTooLong: () => mainNotTooLong(limit),

  proceduresNotTooLong: allProceduresShould(notTooLong(limit)),

  noEmptyProcedures: allProceduresShould(doSomething),

  proceduresNamed: allProceduresShould(nameWasChanged(defaultProcedureName)),

  doesNotNestControlStructures,

  conditionalAlternative: () => usesConditionalAlternative(),

  conditionalRepetition: () => usesConditionalRepetition(),

  simpleRepetition: () => usesSimpleRepetition(),

  decomposition9: multiExpect(
    () => mainNotTooLong(9),
    doesNotNestControlStructures,
    allProceduresShould(
      notTooLong(9),
      doSomething,
      isUsed,
      isUsedFromMain,
      doesNotUseRecursion,
      nameWasChanged(defaultProcedureName)
    )
  ),
})

export const mergeConfigurations = (expectationsConfigs: Array<ExpectationsConfigValues | undefined>) =>
  expectationsConfigs
    .filter(Boolean)
    .reduce((baseExpect, expectWithPriority) => ({
      ...baseExpect,
      ...expectWithPriority,
    }), {} as ExpectationsConfigValues)

    const uniqueExpectationLines = (expectations: string) =>
      Array.from(new Set(expectations.split('\n').filter(line => line.trim()))).join('\n')

export const configToExpectation = (
  expectationsConfig: ExpectationsConfigValues | undefined,
  workspace: Blockly.WorkspaceSvg,
  defaultProcedureName: string
) => {
  if (!expectationsConfig || !Object.keys(expectationsConfig).length) return noExpectation()

  const maxProgramLength = expectationsConfig.maxProgramLength
  const limit = typeof maxProgramLength === 'number' ? maxProgramLength : DEFAULT_MAX_PROGRAM_LENGTH
  const expectationsById = idsToExpectations(defaultProcedureName, limit)

  const expectationFns = Object.entries(expectationsConfig)
    .filter(([, shouldApply]) => shouldApply === true)
    .map(([id]) => expectationsById[id as keyof typeof expectationsById])
    .filter((expectation): expectation is (element: any) => string => Boolean(expectation))

  if (!expectationFns.length) return noExpectation()

  return uniqueExpectationLines(multiExpect(...expectationFns)(workspace))
}

const allExpectConfigurations = (challenge: any) => {
  if (!challenge?.id) return [challenge?.expectations]

  const { book, chapter, group, challenge: pathChallenge } = getPathToChallenge(challenge.id)
  return [book as any, chapter as any, group as any, pathChallenge].map(model => model?.expectations)
}

const allExpectConfigurationsMerged = (challenge: any) =>
  mergeConfigurations(allExpectConfigurations(challenge))

export const expectationFor = (
  challenge: any,
  workspace: Blockly.WorkspaceSvg,
  defaultProcedureName = 'Hacer algo'
) => {
  const expectationsConfig = allExpectConfigurationsMerged(challenge)
  return configToExpectation(expectationsConfig, workspace, defaultProcedureName)
}
