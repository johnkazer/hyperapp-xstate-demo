/// <reference types="cypress" />
import { videoMachine, audioMachine } from '../../src/machines.js'
import { getSimplePaths, getShortestPaths } from '@xstate/graph'
import { map, compose, pipe, lensPath, view, curry } from 'ramda'

const videoSimplePaths = getSimplePaths(videoMachine)
const audioSimplePaths = getSimplePaths(audioMachine)
const videoShortestPaths = getShortestPaths(videoMachine)
const audioShortestPaths = getShortestPaths(audioMachine)

const videoStateList = Object.keys(videoSimplePaths)
const audioStateList = Object.keys(audioSimplePaths)
const machineName = lensPath(['tree', 'stateNode', 'config', 'id'])
const currentMachine = (state) => view(machineName, state) === 'videoMachine' ? videoMachine : audioMachine
const selectSimpleVideoPaths = (currentState) => videoSimplePaths[currentState].paths[0]
const selectSimpleAudioPaths = (currentState) => audioSimplePaths[currentState].paths[0]
const reload = () => cy.reload()
const appIsReady = () => cy.get('video').should('be.visible')
const changeTab = (newTab) => () => cy.get(`button[id="${newTab}"`).click()
const changeToAudioTab = changeTab('audioTab')
const checkTransition = ({ state, event }) => {
	cy.log(`checking transition from ${state.value} due to ${event.type}`)
	// if there are paths[x].state.actions[y] then have Hyperapp and XState run the action(s) for us
	// Optionally we could drive the machine from here too
	if (state.actions.length > 0) {
		cy.log(view(machineName, state))
		const machine = currentMachine(state)
		// machine.transition(...)
		return
	}
	// else run paths[x].event
	// add logic to check for DOM elements with id === paths[x].event
	return cy.get(`button[id="${event.type}"]`).click()
}
const listOfPaths = curry((selectPaths, currentState) => {
	cy.log(`List of paths state: ${currentState}`)
	return selectPaths(currentState)
})
const checkPath = (path) => map(checkTransition, path)

/*
it('tests each state path with forEach', () => {
    cy.visit('http://localhost:1234')
  
    videoStateList.forEach(currentState => {
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
    }, videoStateList)
})
*/
it('tests each state path with compose', () => {
	cy.visit('http://localhost:1234')
	const listOfVideoPaths = listOfPaths(selectSimpleVideoPaths)
	const listOfAudioPaths = listOfPaths(selectSimpleAudioPaths)
	const testVideo = map(compose(appIsReady, reload, checkPath, listOfVideoPaths))
	const testAudio = map(compose(changeToAudioTab, appIsReady, reload, checkPath, listOfAudioPaths))
	cy.log('Test video paths')
	testVideo(videoStateList)
	cy.log('Test audio paths')
	testAudio(audioStateList)
})
