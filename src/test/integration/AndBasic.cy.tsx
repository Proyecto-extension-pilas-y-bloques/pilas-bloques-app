import { ChallengeView } from '../../components/challengeView/ChallengeView'
import { mount } from 'cypress/react'
import { LocalStorage } from '../../localStorage'
import { SerializedChallenge } from '../../components/serializedChallenge'
import { EMBER_IMPORTED_CHALLENGE_PATH } from '../../components/ImportedChallengeView'
import { ThemeContextProvider } from '../../theme/ThemeContext'

describe('Challenge view with andBasic block', () => {
  
     // Esta linea evita las exception "uncaught"
  Cypress.on('uncaught:exception', () => {
    return false
  })
  // Acá empieza el código de los tests

  
  const challenge = (solution: string): SerializedChallenge => {

    return {
      fileVersion: 0,
      title: 'Test andBasic',
      statement: {
        description: '',
      },
      scene: {
        type: 'Lita',
        maps: [[["A", "L", "-"], ["-", "-", "-"], ["-", "-", "-"]]]
      },
      toolbox: {
        blocks: ["AgarrarLechuga", "MoverACasillaDerecha", "MoverA", "Repetir", "Hasta", "Si", "SiNo", "ParaLaDerecha", "ParaLaIzquierda", "ParaArriba", "ParaAbajo", "Numero", "HayLechuga", "OpAritmetica"],
        categorized: true
      },
      predefinedSolution: solution
    }
  }

  const executeChallengeWithEval = (expression: string, expected: any) => {
    cy.get('[data-testid="scene-iframe"]')
      .should('have.attr', 'data-loaded', 'true')
      .then($iframe => {
        const iframe = $iframe[0] as HTMLIFrameElement

        cy.get('[data-testid="execute-button"]').click()

        cy.wrap(null).should(() => {
          const value = (iframe.contentWindow as any).eval(`
          pilas.escena_actual().${expression}
        `)

          expect(value).to.equal(expected)
        })
      })
  }

  const testExecutionWithBlocks = (name: string, solution: string, expected: any, skip = false) => {
    (skip ? it.skip : it)(name, () => {
      LocalStorage.saveCreatorChallenge(challenge(solution))
      mount(
        <ThemeContextProvider>
          <ChallengeView
            path={EMBER_IMPORTED_CHALLENGE_PATH} />
        </ThemeContextProvider>
      )
      executeChallengeWithEval('automata.casillaActual().nroColumna', expected)
    })
  }

  const andVerdaderoFalso = `<xml xmlns="https://developers.google.com/blockly/xml"><block type="al_empezar_a_ejecutar" id="fXptZ3LkcFW1SY.IZPS(" deletable="false" movable="false" editable="false" x="15" y="15"><statement name="program"><block type="Si" id="2K9y.LhOwc40p,FosPv+"><value name="condition"><block type="andBasic" id="Q$Wg_DPC$j.(f7x=\`G~x"><value name="A"><block type="BordeArriba" id="Srvr6b-.4f*Zs-So@),Z"/></value><value name="B"><block type="BordeAbajo" id="vMJ!PfqJbcMZRfGeJH*{"/></value></block></value><statement name="block"><block type="MoverACasillaDerecha" id="*kXgP~EQdk2u[N_U%I[d"/></statement></block></statement></block></xml>`
  
  const andVerdaderoVerdadero = `<xml xmlns="https://developers.google.com/blockly/xml"><block type="al_empezar_a_ejecutar" id="fXptZ3LkcFW1SY.IZPS(" deletable="false" movable="false" editable="false" x="15" y="15"><statement name="program"><block type="Si" id="2K9y.LhOwc40p,FosPv+"><value name="condition"><block type="andBasic" id="Q$Wg_DPC$j.(f7x=\`G~x"><value name="A"><block type="BordeArriba" id="Srvr6b-.4f*Zs-So@),Z"/></value><value name="B"><block type="BordeArriba" id="vMJ!PfqJbcMZRfGeJH*{"/></value></block></value><statement name="block"><block type="MoverACasillaDerecha" id="*kXgP~EQdk2u[N_U%I[d"/></statement></block></statement></block></xml>`

  const andFalsoFalso = `<xml xmlns="https://developers.google.com/blockly/xml"><block type="al_empezar_a_ejecutar" id="fXptZ3LkcFW1SY.IZPS(" deletable="false" movable="false" editable="false" x="15" y="15"><statement name="program"><block type="Si" id="2K9y.LhOwc40p,FosPv+"><value name="condition"><block type="andBasic" id="Q$Wg_DPC$j.(f7x=\`G~x"><value name="A"><block type="BordeAbajo" id="Srvr6b-.4f*Zs-So@),Z"/></value><value name="B"><block type="BordeAbajo" id="vMJ!PfqJbcMZRfGeJH*{"/></value></block></value><statement name="block"><block type="MoverACasillaDerecha" id="*kXgP~EQdk2u[N_U%I[d"/></statement></block></statement></block></xml>`

  const andLechuga1 = `<xml xmlns="https://developers.google.com/blockly/xml"><block type="al_empezar_a_ejecutar" x="15" y="15"><statement name="program"><block type="Si"><value name="condition"><block type="andBasic"><value name="A"><block type="HayLechuga" /></value><value name="B"><block type="BordeArriba" /></value></block></value><statement name="block"><block type="MoverACasillaDerecha" /></statement></block></statement></block></xml>`

  const andLechuga2 = `<xml xmlns="https://developers.google.com/blockly/xml"><block type="al_empezar_a_ejecutar" x="15" y="15"><statement name="program"><block type="MoverACasillaDerecha"><next><block type="Si"><value name="condition"><block type="andBasic"><value name="A"><block type="HayLechuga" /></value><value name="B"><block type="BordeAbajo" /></value></block></value><statement name="block"><block type="MoverACasillaDerecha" /></statement></block></next></block></statement></block></xml>`

  const andLechuga3 = `<xml xmlns="https://developers.google.com/blockly/xml"><block type="al_empezar_a_ejecutar" x="15" y="15"><statement name="program"><block type="MoverACasillaDerecha"><next><block type="Si"><value name="condition"><block type="andBasic"><value name="A"><block type="HayLechuga" /></value><value name="B"><block type="BordeArriba" /></value></block></value><statement name="block"><block type="MoverACasillaDerecha" /></statement></block></next></block></statement></block></xml>`

  testExecutionWithBlocks('andBasic Verdadero + Falso: Lita no se mueve', andVerdaderoFalso, 0, false)
  testExecutionWithBlocks('andBasic Verdadero + Verdadero: Lita se mueve a la derecha', andVerdaderoVerdadero, 1, false)
  testExecutionWithBlocks('andBasic Falso + Falso: Lita no se mueve', andFalsoFalso, 0, false)
  testExecutionWithBlocks('andBasic con Lechuga (HayLechuga F + Borde V): Lita queda en 0', andLechuga1, 0, false)
  testExecutionWithBlocks('andBasic con Lechuga (HayLechuga V + Borde F): Lita queda en 1', andLechuga2, 1, false)
  testExecutionWithBlocks('andBasic con Lechuga (HayLechuga V + Borde V): Lita avanza a 2', andLechuga3, 2, false)

})