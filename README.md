# Hyperapp-demo
A [Hyperapp](https://hyperapp.dev/) demo, which implements a simple multi-media [PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps) app with [XState](https://xstate.js.org). You can take a photo, create a recording and simulate uploading them to the cloud. If offline, the PWA will save locally and automatically 'upload' when you're back online.

The master branch just uses Hyperapp, whilst the xstate branch modifies the app to use XState state machines.

Note that unlike most Hyperapp implementations, this app uses Pug to render HTML.

## Why?

Use (simple) maths not dev process to create reliable web apps.

De-stress app development.

Not only will you _know_ that your app's pure functions work (existing testing) but you will also _know_ that the business logic which wires them together also works!

You can use easily accessible mathematical principles to build reliable apps rather than software process.

Using an XState machine means that you can pre-define how sequences of user actions and events lead to state transition and therefore app behaviour. The logic is clear and easy to reason about (rather than obscured in collections of functions or separate hard-to-maintain flow diagrams). You can even [visualise](https://statecharts.github.io/xstate-viz/) the logic with interactive state machine charts and create [tests](https://glebbahmutov.com/blog/hyperapp-state-machine/#testing-from-state-machine) easily.

## How it works - Hyperapp

[Hyperapp](https://hyperapp.dev/) maintains a central state and message handler which listens for user actions and browser events. When an action or event changes the state, Hyperapp uses a virtual-DOM to update the app. A loop exists, half visible to the developer and half within the framework.

Action -> Event -> [ Listener -> State management -> Virtual-DOM ] -> DOM-change -> Action...

## How it works - XState

State machines are a long-standing mathematical tool. Their practical application to apps has some common practical and conceptual features with how Hyperapp defines app behaviour. The main difference is that [XState](https://xstate.js.org) enables the relationships between Actions, Events and State to be defined unambiguously in one place.

A state machine is created in JSON, whilst the XState system provides pure functions for interacting with it. Your app can respond to action and event-driven change or request state transitions directly.

Action -> [ State Transition -> Possible Actions ] -> Action...

There are two state machines in the demo, one to manage taking photo's and the other for recordings.

I find the [visualiser](https://statecharts.github.io/xstate-viz/) useful, as it bridges the gap between code and seeing a working app. In the former you can't share with non-coders when discussing core business logic. In the latter you don't get a feel for what the previous or potential 'next steps' are for the app. Also you need to have created some UI that's in-sync with the code. I kinda wish you could actively edit the visualiser like you can with [Rosmaro](https://rosmaro.js.org/).

# Testing

The [test paradigm](https://glebbahmutov.com/blog/hyperapp-state-machine/#testing-from-state-machine) suggested by Gleb Bahmutov is based on creating a graph representation of the state machine. The test script can therefore traverse the graph and test each path through the machine's logic. It is guaranteed therefore to achieve 100% coverage of reachable app states (and code) described by the state machine. As it happens, XState already has a [graph package](https://xstate.js.org/docs/packages/xstate-graph/#quick-start)!

## What's next?

Other aspects of the app may be suitable for state machines, including upload, online/offline state and PWA installation. I'd also like to have a better system of defining when a Hyperapp Action is triggered directly by an XState transition compared to a Hyperapp Event or Subscription.

However, there is an interesting boundary of responsibility between Hyperapp and XState that this demo has only just started to explore.

### _Where and how should state be managed?_

There are three valid places, which might get confusing

* XState machine current value
* XState machine context
* Hyperapp state

In the current example, the online/offline status is maintained in Hyperapp's state and is managed by a subscription event handler. There is a 'hidden' decision point when the user clicks 'Save Photo'. The uploadImage XState transition is triggered. However, behaviour varies according to online/offline status - the file is either uploaded via (dummy) http or saved locally. In either case, Hyperapp triggers an XState transition with 'uploadSuccess'.

### _What role components?_

Hyperapp can be used as a [component pattern](https://github.com/zaceno/hyperapp-nestable), although it's not an approach I'm familiar with yet. In addition, I can see how a specific state machine could be associated with a component - possibly with internal state defined in the context object.

### _How many machines do you need?_

For an app I think it is most useful to maintain a set of state machines, which appear as pseudo components - logical components if you will. If a state machine is too complicated it suggests either that the UI is too complicated or that you will have problems maintaining the machine.
