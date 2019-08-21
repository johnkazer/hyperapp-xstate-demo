Read and comment on the README content [here](https://dev.to/johnkazer/use-maths-not-process-for-reliable-web-apps-1bmm) and for a stronger focus on app dev process implications, [go here](https://dev.to/johnkazer/revist-the-waterfall-process-but-this-time-with-maths-27cn).

A combination of functional front-end JavaScript and state machines leads to unit and business logic tests which can approach mathematical proof. [Watch](https://github.com/johnkazer/hyperapp-xstate-demo/blob/xstate/cypress/videos/tests.js.mp4) as Cypress steps through your app, using an auto-generated graph of the state machine that defines the app's possible UI actions and transitions.

Disclaimer - it might help to have some knowledge of [Hyperapp](https://github.com/jorgebucaran/hyperapp) actions and events plus [state machines](https://xstate.js.org/docs/), as these are big subjects mostly out of scope of this README.

## Why?

De-stress app development.

Not only will you know that your app's _pure functions_ work (existing unit testing) but you will also know that the _business logic_ which wires them together also works!

You can use easily accessible mathematical principles to build reliable apps rather than depending on software process. This demo focuses on business logic rather than unit testing.

Using an XState machine means that you can pre-define and test how sequences of user actions and events lead to state change and therefore app behaviour. The logic is clear and easy to reason about (rather than obscured in collections of functions or separate hard-to-maintain flow diagrams). You can [visualise](https://statecharts.github.io/xstate-viz/) the logic with interactive state machine charts and create [tests](https://glebbahmutov.com/blog/hyperapp-state-machine/#testing-from-state-machine) easily. The state machine drives UI tests which prove functionality matches the logic.

# How?

A Hyperapp demo

Here I introduce a [Hyperapp](https://hyperapp.dev/) demo, which implements a simple multi-media [PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps) (Progressive Web App) with [XState](https://xstate.js.org). You can take a photo, create a recording and simulate uploading them to the cloud. If offline, the PWA will save locally and automatically 'upload' when you're back online. Apologies for the requested browser permissions - video, audio and push notifications - they are necessary for the app's functionality. But nothing leaves your browser!

The master branch just uses Hyperapp, whilst the xstate branch modifies the app to use XState state machines as well. Use 'npm start' to build and run using Parcel.

Note that unlike most Hyperapp implementations, this app uses [Pug to render HTML](https://dev.to/johnkazer/hyperapp-with-pug-templates-517e). You may prefer to convert to the more usual JSX or hyperscript approach.

## How it works - Hyperapp

[Hyperapp](https://hyperapp.dev/) maintains a central state and message handler which listens for user actions and browser events. When an action or event changes the state, Hyperapp uses a virtual-DOM to update the app. A loop exists, half visible to the developer and half within the framework.

Action -> Event -> [ Listener -> State management -> Virtual-DOM ] -> DOM-change -> Action...

## How it works - XState

State machines are a long-standing mathematical tool. Their practical application to apps has some common practical and conceptual features with how Hyperapp defines app behaviour. The main difference is that [XState](https://xstate.js.org) enables the relationships between Actions, Events and State to be defined unambiguously in one place.

A state machine is created in JSON, whilst the XState system provides pure functions for interacting with it. Your app can respond to action and event-driven change or request state changes directly.

Action -> [ State change -> Possible Actions ] -> Action...

There are two state machines in the demo, one to manage taking photo's and the other for recordings.

You can visualize and interact with the machines defined in machines.js using the link above. I have found it useful to compare the experience of visual logic with that of using the actual app. You can focus on the function without being distracted by form.

## How it works - XState within Hyperapp

Two new functions that manage the link. One captures events (e.g. button clicks) and the other converts XState actions into Hyperapp actions. In effect, these functions act as a bridge between Hyperapp actions and state, and XState actions and transitions.

There are some important features of the app implementation which help this process. In particular, I get easy linking between UI and logic by using the same id names for UI elements as for their associated Hyperapp action function names and XState transitions. Conversely, it is a bit fiddly switching between different state machines - a balance between monolithic vs distributed.

Each button has this `onclick=[updateVideoState, targetId]` tuple as a click handler.

The click handler function `updateVideoState` receives `state` and the element's `id` from Hyperapp, which handles the DOM event. It passes these and state machine details to `processNewState` shown below. This function calls `runActions` to link state machine actions associated with the transition to the execution of Hyperapp actions. It must handle the results of Hyperapp actions (new state), events (which return `[state, event]` tuples) and one-shot effects (no returned object). Finally `processNewState` returns the updated state to Hyperapp, along with the latest state machines.

```javascript
const processNewState = (state, { machineState, machineName, machine, id }) => {
    const previousState = pathOr(machineState, [machineState, 'value'], state)
    const newMachineState = machine.transition(previousState, id) // 'id' is synonymous with 'newState'
    const requests = runActions(state, newMachineState, id)
    const videoState = machineName === STATE_MACHINES.VIDEO_MACHINE ? newMachineState : state.videoState
    const audioState = machineName === STATE_MACHINES.AUDIO_MACHINE ? newMachineState : state.audioState
    if (requests.length === 1) { // capture the result of an action
        return { ...requests[0], videoState, audioState }
    } else if (requests.length === 2) { // capture the result of an action-effect tuple
        return [
            { ...requests[0], videoState, audioState },
            requests[1]
        ]
    }
    return { ...state, videoState, audioState } // state machine was updated
}
```
The `runActions` function executes the action defined by the machine and allows Hyperapp to process the result. The actions are all regular Hyperapp action functions, the only difference is that the state machine determines what to execute when a valid transition occurs.
```javascript
const runActions = (state, calcState, evtObj) => { // make recursive or map
    let requests = []
    calcState.actions.forEach(action => {
        const stateChangeRequest = action.exec(state,evtObj)
        const isArray = Array.isArray(stateChangeRequest)
        requests = concat(requests, isArray ? stateChangeRequest : [stateChangeRequest])
    });
    return requests
}
```

# Testing!

There are two parts to the testing issue - unit testing of pure functions and testing the app logic generated by sets of functions.

## Unit testing Pure functions

Written about by many others...

## Testing app logic with state machines

Self-writing tests! What's not to love?

Well, not completely self-writing but not far off. XState provides a [graph feature](https://xstate.js.org/docs/packages/xstate-graph/) which generates a set of objects and arrays which describe the paths through your app's state machines. I've implemented an approach using [Cypress](https://www.cypress.io/) where control of the app tests is managed by these paths. See cypress/integration/tests/tests.js in the xstate branch of the repo.

Here's an example of the Cypress output, showing execution of a 3-stage path to reach 'upload'. Notice again the shared naming between DOM element id and transition. To see the whole test video go [here](https://github.com/johnkazer/hyperapp-xstate-demo/blob/xstate/cypress/videos/tests.js.mp4)

![Cypress test example following an XState path](https://thepracticaldev.s3.amazonaws.com/i/1otsi69ksgdv8y9l2vzi.png)

In the example, there are four states and actions defined in the machine:
```javascript
const videoMachine = Machine ({
    id: 'videoMachine',
    initial: 'videoState',
    states: {
        videoState: {
            on: {
                captureImage: {
                    target: 'capture',
                    actions: ['captureImage']
                }
            }
        },
        capture: {
            on: {
                success: 'captured',
                fail: 'videoState'
            }
        },
        captured: {
            on: {
                uploadImage: {
                    target: 'upload',
                    actions: ['uploadImage']
                },
                discardImage: {
                    target: 'videoState',
                    actions: ['discardImage']
                }
            }
        },
        upload: {
            on: {
                uploadSuccess: {
                    target: 'videoState',
                    actions: ['discardImage']
                },
                uploadFail: 'captured'
            }
        }
    }
})
```
Follow through the Cypress results alongside the state machine. Here's a summary, with the transition 'actions' in []

videoState -> [_captureImage_] -> capture -> [_success_] -> captured -> [_uploadImage_] -> upload -> [_uploadSuccess_] -> videoState

The first transition `captureImage` takes a picture and displays the result in a `div`. If this is successful, the second transition doesn't involve an action as Hyperapp resolves the result of an Effect in the background. `success` of the Effect allows the display of new buttons - to upload or discard. The path gives us an `uploadImage` action followed by the final step where Hyperapp manages the result of the 'uploadSuccess' effect in the background.

The outcome of the final 'uploadSuccess' step is not immediately obvious, but Cypress 'time-travel' (scrolling back through each test step) shows that we requested upload and received a success response afterwards.

Make the upload request (button click):
![Click the upload button](https://thepracticaldev.s3.amazonaws.com/i/15h33d6gl7n6ccv28owq.png)

Uploaded and ready to take the next picture:
![Successful upload](https://thepracticaldev.s3.amazonaws.com/i/k4hzr3lgzo68bllw67ac.png)

Here is the core of the test code for Cypress (I've not show the XState-graph objects as they're complex, but are essentially lists of transitions).

```javascript
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

// the test
it('tests each state path', () => {
	cy.visit('http://localhost:1234')
	const listOfVideoPaths = listOfPaths(selectSimpleVideoPaths)
	const testVideo = map(compose(appIsReady, reload, checkPath, listOfVideoPaths))
	cy.log('Test video paths')
	testVideo(videoStateList)
})
```
As such, the core code is pretty reusable for any XState-graph, the only custom tweaking needed is selection of the actual UI action, `.click()` in this case.
