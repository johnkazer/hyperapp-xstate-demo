/// <reference types="cypress" />
import { videoMachine, audioMachine } from '../../src/machines.js'
import { getSimplePaths, getShortestPaths } from '@xstate/graph';

const videoSimplePaths = getSimplePaths(videoMachine)
const audioSimplePaths = getSimplePaths(audioMachine)
const videoShortestPaths = getShortestPaths(videoMachine)
const audioShortestPaths = getShortestPaths(audioMachine)

const stateList = Object.keys(videoSimplePaths)

// test generated from the state machine path traversal
it('tests each state path', () => {
    cy.visit('http://localhost:1234')
  
    stateList.forEach(currentState => {
      videoSimplePaths[currentState].paths.forEach(arr => arr.forEach(({ state, event }) => {
        cy.log(`checking transition from ${state.value} due to ${event.type}`)
        //const selector = cy.get('button').contains('Take Picture').click()
        //cy.get('img').should('have.length.gt', 0)
      }))
      cy.reload()
    })
})
  