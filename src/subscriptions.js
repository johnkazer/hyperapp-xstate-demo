import * as actions from './actions.js'
import * as requestHandler from './handleRequests.js'
import * as effects from './effects.js'

const initMedia = (dispatch, { action, status }) => {
    window.addEventListener('load', (event) => {
        setTimeout(() => { // ensure call setup after load has really finished
            try {
                requestHandler.setupVideo()
                requestHandler.setupAudio(action, dispatch, status)
            } catch(e) {
                return alert(e);
            }
        }, 100)
    })
}
const onlineStatus = (dispatch, { action }) => {
    window.addEventListener('online', async () => {
        const images = await requestHandler.findLocalItems('jpeg');
        const recordings = await requestHandler.findLocalItems('webm');
        return dispatch(action, { status: 'online', images, recordings })
    });

    window.addEventListener('offline', () => {
        return dispatch(action, { status: 'offline' })
    });
}
const handleInstallState = (dispatch, { action }) => {
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the app install prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        const deferredPrompt = e
        const installed = false
        return dispatch(action, { deferredPrompt, installed })
    });
}
const initMediaSub = ({ action, status }) => [
    initMedia,
    {
        action,
        status
    }
]
const onlineStatusSub = ({ action }) => [
    onlineStatus,
    {
        action
    }
]
const handleInstallStateSub = ({ action }) => [
    handleInstallState,
    {
        action
    }
]
export const subs = (state) => [
    initMediaSub({
        action: actions.audioReady,
        status: effects.AUDIO_STATE.READY
    }),
    onlineStatusSub({
        action: actions.updateStatus
    }),
    handleInstallStateSub({
        action: actions.handleInstallState
    })
]
