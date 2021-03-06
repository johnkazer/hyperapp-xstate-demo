import * as requestHandler from './handleRequests.js'
import { map } from 'ramda'

export const AUDIO_STATE = {
    RECORDING: 'AUDIO_RECORDING',
    INIT: 'AUDIO_INIT',
    STOPPED: 'AUDIO_STOPPED',
    READY: 'AUDIO_READY'
}
export const IMAGE_STATE = {
    INIT: 'IMAGE_INIT',
    TAKEN: 'IMAGE_TAKEN'
}
export const HTTP_REQUESTS = {
    UPLOAD_FILES: 'UPLOAD_FILES'
}
async function installAsPwa(dispatch, { deferredPrompt, pwaResponseHandler }) {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function(choiceResult){
            if (choiceResult.outcome === 'accepted') {
                console.log('Your PWA has been installed');
                dispatch(pwaResponseHandler, { outcome: 'accepted' })
            } else {
                    console.log('User chose to not install your PWA');
                    dispatch(pwaResponseHandler, { outcome: 'rejected' })
            }
            deferredPrompt = null;
        });
    }
}
export const installAsPwaFx = (deferredPrompt, pwaResponseHandler) => [
    installAsPwa,
    {
        deferredPrompt,
        pwaResponseHandler
    }
]
function processExternalRequest (dispatch,  command) {
    const { request, files, success, fail, ACCESS_TOKEN } = command
    const submitFile = (rawFile) => {
        // not yet impl
        // just move to next state or file
        // Impl upload authorisation, such as Dropbox
        // https://github.com/dropbox/dropbox-sdk-js/blob/master/examples/javascript/auth/index.html
        // and upload
        // https://github.com/dropbox/dropbox-sdk-js/blob/master/examples/javascript/upload/index.html
        return dispatch(success, { request })
    }

    switch (request) {
    case HTTP_REQUESTS.UPLOAD_FILES: {
        if (!Array.isArray(files)) return
        return map(submitFile, files)
    }
    }
}
const upload = (dispatch, { success, fail, files, ACCESS_TOKEN }) => {
    processExternalRequest(dispatch, { request: HTTP_REQUESTS.UPLOAD_FILES, success, fail, files, ACCESS_TOKEN })
}
export const uploadFx = (httpSuccess, httpFail, files, ACCESS_TOKEN) => [
    upload,
    {
        success: httpSuccess,
        fail: httpFail,
        files: files,
        ACCESS_TOKEN: ACCESS_TOKEN
    }
]
const takePicture = (dispatch, { action }) => {
    const image = requestHandler.takeBase64Photo({ type: 'jpeg', quality: 0.8 }).base64
    if (image) {
        dispatch(action, { tabStatus: IMAGE_STATE.TAKEN, images: [image] })
    } else {
        dispatch(action, { tabStatus: IMAGE_STATE.INIT, images: [] })
    }
}
export const takePictureFx = (action) => [
    takePicture,
    {
        action
    }
]
const startRecording = (dispatch, { action }) => {
    try {
        requestHandler.start()
        dispatch(action, { status: AUDIO_STATE.RECORDING })
    } catch (e) {
        dispatch(action, { status: AUDIO_STATE.INIT })
    }
}
export const startRecordingFx = (action) => [
    startRecording,
    {
        action
    }
]
const stopRecording = (dispatch, { action }) => {
    try {
        requestHandler.stop() // triggers event handler on the audio element
    } catch (e) {
        dispatch(action, { status: AUDIO_STATE.INIT })
    }
}
export const stopRecordingFx = (action) => [
    stopRecording,
    {
        action
    }
]
const addToLocalStore = (dispatch, { images, recordings }) => {
    requestHandler.storeLocalItems(images, 'jpeg')
    requestHandler.storeLocalItems(recordings, 'webm')
}
export const addToLocalStoreFx = (images, recordings) => [
    addToLocalStore,
    {
        images,
        recordings
    }
]
const removeFromLocalStore = (dispatch, config = {}) => {
    requestHandler.removeLocalItems()
}
export const removeFromLocalStoreFx = () => [
    removeFromLocalStore,
    {}
]
