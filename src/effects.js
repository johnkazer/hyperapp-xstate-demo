import * as requestHandler from './handleRequests.js'
import { map } from 'ramda'

export const AUDIO_STATE = {
    RECORDING: 'AUDIO_RECORDING',
    INIT: 'AUDIO_INIT',
    STOPPED: 'AUDIO_STOPPED',
    READY: 'AUDIO_READY'
}
export const HTTP_REQUESTS = {
    UPLOAD_VIDEO: 'UPLOAD_VIDEO',
    UPLOAD_AUDIO: 'UPLOAD_AUDIO',
    UPLOAD_STORAGE: 'UPLOAD_STORAGE'
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
    case HTTP_REQUESTS.UPLOAD_AUDIO:
    case HTTP_REQUESTS.UPLOAD_VIDEO:
    case HTTP_REQUESTS.UPLOAD_STORAGE: {
        if (!Array.isArray(files)) return
        return map(submitFile, files)
    }
    }
}
const upload = (dispatch, { success, fail, files, request, ACCESS_TOKEN }) => {
    processExternalRequest(dispatch, { request, success, fail, files, ACCESS_TOKEN })
}
export const uploadFx = (httpSuccess, httpFail, files, request, ACCESS_TOKEN) => [
    upload,
    {
        success: httpSuccess,
        fail: httpFail,
        files: files,
        request: request,
        ACCESS_TOKEN: ACCESS_TOKEN
    }
]
const takePicture = (dispatch, { action }) => {
    const image = requestHandler.takeBase64Photo({ type: 'jpeg', quality: 0.8 }).base64
    if (image) {
        dispatch(action, { images: [image] })
    } else {
        dispatch(action, { images: [] })
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
        dispatch(action)
    }
}
export const stopRecordingFx = (action) => [
    stopRecording,
    {
        action
    }
]
const addToLocalStore = async (dispatch, { action, request, images, recordings }) => {
    const imageStored = await requestHandler.storeLocalItems(images, 'jpeg')
    const recordingStored = await requestHandler.storeLocalItems(recordings, 'webm')
    dispatch(action, { request, imageStored, recordingStored })
}
export const addToLocalStoreFx = (action, request, images, recordings) => [
    addToLocalStore,
    {
        action,
        request,
        images,
        recordings
    }
]
const removeFromLocalStore = (dispatch) => {
    requestHandler.removeLocalItems()
}
export const removeFromLocalStoreFx = () => [
    removeFromLocalStore,
    {}
]
