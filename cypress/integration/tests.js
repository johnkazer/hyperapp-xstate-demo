/// <reference types="cypress" />
import { videoMachine, audioMachine } from '../../src/machines.js'
import { getSimplePaths, getShortestPaths } from '@xstate/graph'
import { map, compose, pipe } from 'ramda'

// tests generated from the state machine path traversal graph(s)
const videoSimplePaths = getSimplePaths(videoMachine)
const audioSimplePaths = getSimplePaths(audioMachine)
const videoShortestPaths = getShortestPaths(videoMachine)
const audioShortestPaths = getShortestPaths(audioMachine)

const stateList = Object.keys(videoSimplePaths)
const checkTransition = ({ state, event }) => {
    cy.log(`checking transition from ${state.value} due to ${event.type}`)
}
const listOfPaths = (currentState) => videoSimplePaths[currentState].paths[0]
const checkPaths = (paths) => map(checkTransition, paths)
it('tests each state path with forEach', () => {
    cy.visit('http://localhost:1234')
  
    stateList.forEach(currentState => {
		videoSimplePaths[currentState].paths.forEach(arr => arr.forEach(({ state, event }) => {
			cy.log(`checking transition from ${state.value} due to ${event.type}`)
		}))
	})
})
it('tests each state path with map', () => {
    cy.visit('http://localhost:1234')
  
    map(currentState => {
		map(arr => {
			map(checkTransition, arr)
		}, videoSimplePaths[currentState].paths)
		cy.reload()
    }, stateList)
})

it('tests each state path with compose', () => {
	cy.visit('http://localhost:1234')
	const test = map(compose(checkPaths, listOfPaths))
	test(stateList)
})
