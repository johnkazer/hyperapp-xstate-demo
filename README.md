# Hyperapp-demo
A [Hyperapp](https://hyperapp.dev/) demo, which implements a simple multi-media [PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps) app with [XState](https://xstate.js.org). You can take a photo, create a recording and simulate uploading them to the cloud. If offline, the PWA will save locally and automatically 'upload' when you're back online.

The master branch just uses Hyperapp, whilst the xstate branch modifies the app to use XState state machines.

Note that unlike most Hyperapp implementations, this app uses Pug to render HTML.

## Why?

Use (simple) maths not dev process to create reliable web apps.

De-stress app development.

Not only will you _know_ that your app's pure functions work (existing testing) but you will also _know_ that the business logic which wires them together also works!

You can use easily accessible mathematical principles to build reliable apps rather than software process.

Using an XState machine means that you can pre-define how sequences of user actions and events lead to state change and therefore app behaviour. The logic is clear and easy to reason about (rather than obscured in collections of functions or separate hard-to-maintain flow diagrams). You can even [visualise](https://statecharts.github.io/xstate-viz/) the logic with interactive state machine charts and create [tests](https://glebbahmutov.com/blog/hyperapp-state-machine/#testing-from-state-machine) easily.

## How it works - Hyperapp

[Hyperapp](https://hyperapp.dev/) maintains a central state and message handler which listens for user actions and browser events. When an action or event changes the state, Hyperapp uses a virtual-DOM to update the app. A loop exists, half visible to the developer and half within the framework.

Action -> Event -> [ Listener -> State management -> Virtual-DOM ] -> DOM-change -> Action...

## How it works - XState

State machines are a long-standing mathematical tool. Their practical application to apps has some common practical and conceptual features with how Hyperapp defines app behaviour. The main difference is that [XState](https://xstate.js.org) enables the relationships between Actions, Events and State to be defined unambiguously in one place.

A state machine is created in JSON, whilst the XState system provides pure functions for interacting with it. Your app can respond to action and event-driven change or request state changes directly.

Action -> [ State change -> Possible Actions ] -> Action...

There are two state machines in the demo, one to manage taking photo's and the other for recordings.

## What's next?

Other aspects of the app may be suitable for state machines, including upload, online/offline state and PWA installation. There is an interesting boundary of responsibility between Hyperapp and XState that this demo has only just started to explore.

Where and how should state be managed?

What role components?

How many machines do you need?
