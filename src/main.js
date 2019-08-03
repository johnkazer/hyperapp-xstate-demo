import { app, h } from 'hyperapp'
import { pugToView } from "./pug-to-view"
import { initialStateObj } from './actions.js'
import { subs } from './subscriptions.js'
import { registerServiceWorker } from './serviceWorkerHandler.js'

if ('serviceWorker' in navigator) {
    try {
        registerServiceWorker();
    } catch (e) {
        console.error(e);
    }
}

const view = pugToView(h)
const node = document.getElementById('app')
app({
    init: initialStateObj,
    view: view,
    node: node,
    subscriptions: subs
})
