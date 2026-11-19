import { Scene, SerializedChallenge, assesmentsToExpectations, isValidChallenge, sceneIsValid } from '../../components/serializedChallenge';
import { Ember } from '../../emberCommunication';

const validScene: Scene = {
    type: "Lita",
    maps: [[
        ['L', '-'],
        ['A&T', '-'],
        ['L', 'O'],
        ['T', '-']
     ],
     [
        ['T', '-'],
        ['A', '-'],
        ['T', '-'],
        ['L', '-']
     ]

    ]
}


describe('Scene validity', () => {

    test('Valid scene', () => {
        expect(sceneIsValid(validScene)).toBeTruthy()
    })

    test('Incomplete scene is invalid', () => {
        const incompleteScene = {
            type: "Lita"
        }

        expect(sceneIsValid(incompleteScene)).toBeFalsy()
    })

    test('Complete scene with invalid scene type is invalid', () => {
        const invalidScene = {
            type: "Pepita",
            maps: [['P', '-'], ['A','-']]
        }

        expect(sceneIsValid(invalidScene)).toBeFalsy()
    })

    test('Complete scene with an invalid cell is invalid', () => {
        const invalidScene = {
            type: "Lita",
            maps: [['P', '-'], ['A','ZZZ']]
        }

        expect(sceneIsValid(invalidScene)).toBeFalsy()
    })

    test('Complete scene with invalid structure is invalid', () => {
        const invalidScene = {
            type: 1337,
            maps: [['P', '-'], ['A','-']]
        }

        expect(sceneIsValid(invalidScene)).toBeFalsy()
    })
})

export const validChallenge: SerializedChallenge = {
    fileVersion: 1,
    title: "El ultimo desafio de Lita",
    statement: {
        description: "Va a poder lograrlo una ultima vez?",
        clue: "Usa el poder secreto"
    },
    scene: validScene,
    toolbox: {
        blocks: ['Uno', 'Otro'],
    },
    stepByStep: true
}

describe('serialized challenge validity', () => {

    test('Valid challenge with valid scene is valid', () => {
        expect(isValidChallenge(validChallenge)).toBeTruthy()
    })

    test('Valid challenge with invalid scene is invalid', () => {
        const invalidChallenge = {...validChallenge, scene: {
            type: 1337,
            maps: [['P', '-'], ['A','-']]
        }}

        expect(isValidChallenge(invalidChallenge)).toBeFalsy()
    })

    test('Invalid challenge with valid scene is invalid', () => {
        const invalidChallenge = {...validChallenge, title: 1337}

        expect(isValidChallenge(invalidChallenge)).toBeFalsy()
    })

        test('Valid challenge with assesments is valid', () => {
        const challengeWithAssesments = {...validChallenge, assesments: {
            simpleRepetition: true,
            conditionalAlternative: false,
            mainNotTooLong: true,
            proceduresNotTooLong: true,
            noEmptyProcedures: true,
            proceduresNamed: false,
            doesNotNestControlStructures: true,
            maxProgramLength: 5
        }}

        expect(isValidChallenge(challengeWithAssesments)).toBeTruthy()
    })

    test('Valid challenge with legacy decomposition assesment is valid', () => {
        const challengeWithAssesments = {...validChallenge, assesments: { decomposition: { maxProgramLength: 9 } }}

        expect(isValidChallenge(challengeWithAssesments)).toBeTruthy()
    })

    test('Challenge with an assesment of the wrong type is invalid', () => {
        const invalidChallenge = {...validChallenge, assesments: { mainNotTooLong: 'yes' }}

        expect(isValidChallenge(invalidChallenge)).toBeFalsy()
    })

    test('Challenge with a maxProgramLength of the wrong type is invalid', () => {
        const invalidChallenge = {...validChallenge, assesments: { maxProgramLength: 'five' }}

        expect(isValidChallenge(invalidChallenge)).toBeFalsy()
    })

    test('Serialized scene to ember scene', () => {
        expect(Ember.serializedSceneToEmberScene(validScene)).toBe('new EscenaLita(["[[L,-],[A&T,-],[L,O],[T,-]]","[[T,-],[A,-],[T,-],[L,-]]"])')
    })

    describe('assesments to expectations', () => {

    test('a challenge without assesments has no expectations', () => {
        expect(assesmentsToExpectations(undefined)).toEqual({})
        expect(assesmentsToExpectations({})).toEqual({})
    })

    test('each assesment is translated to its expectation', () => {
        const assesments = {
            simpleRepetition: true,
            conditionalRepetition: true,
            conditionalAlternative: true,
            mainNotTooLong: true,
            proceduresNotTooLong: true,
            noEmptyProcedures: true,
            proceduresNamed: true,
            doesNotNestControlStructures: true
        }

        expect(assesmentsToExpectations(assesments)).toEqual(assesments)
    })

    test('only the defined assesments are translated, so the other ones do not override anything', () => {
        expect(assesmentsToExpectations({ simpleRepetition: true })).toEqual({ simpleRepetition: true })
    })

    test('assesments set in false are kept, so they can turn off an expectation', () => {
        expect(assesmentsToExpectations({ simpleRepetition: false })).toEqual({ simpleRepetition: false })
    })

    test('the legacy decomposition assesment is translated to decomposition with its limit', () => {
        expect(assesmentsToExpectations({ decomposition: { maxProgramLength: 9 } }))
            .toEqual({ decomposition: true, maxProgramLength: 9 })
    })

    test('maxProgramLength has priority over the decomposition one', () => {
        expect(assesmentsToExpectations({ maxProgramLength: 5, decomposition: { maxProgramLength: 9 } }))
            .toEqual({ decomposition: true, maxProgramLength: 5 })
    })

    test('itWorks is not an expectation', () => {
        expect(assesmentsToExpectations({ itWorks: true })).toEqual({})
    })
})
})
