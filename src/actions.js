import effects from './effects.js'
import { concat } from 'ramda'
import U from './utils.js'
// Don't curry actions passed to effects! It feels like you need to in order to grab `state` when passing an action, but this is what the `dispatch()` function will do

const actions = ( () => {
    const HTTP_REQUESTS = effects.HTTP_REQUESTS
    const AUDIO_STATE = effects.AUDIO_STATE
    const IMAGE_STATE = effects.IMAGE_STATE

    const targetValue = event => event.target.value
    const targetProp = prop => event => event.target[prop]
    const targetId = targetProp('id')
    
    const manageUpload = (state, status, images, recordings) => {
        if (status === 'offline') { // save file to local storage
            const onlineStatusMsg = 'App is offline'
            return [
                { ...state, status, onlineStatusMsg },
                effects.addToLocalStoreFx(images, recordings)
            ]
        } else {
            const fileType = IMAGE_STATE.INIT
            const onlineStatusMsg = 'App is online'
            const uploadingStatusMsg = 'Uploading files(s), please wait ...'
            return [
                { ...state, status, uploadingStatusMsg, onlineStatusMsg },
                effects.uploadFx(httpSuccessMsg, httpFailMsg, fileType, concat(images, recordings), '')
            ]
        }
    }
    const installAsPwa = (state) => [
        state,
        effects.installAsPwaFx(state.deferredPrompt)
    ]
    const pwaResponseHandler = (state, { outcome }) => {
        const installed = outcome === 'accepted' ? true : false
        return { ...state, installed }
    }
    const handleInstallState = (state, { deferredPrompt, installed }) => {
        return { ...state, deferredPrompt, installed }
    }
    const processImage = (state, { tabStatus, images }) => {
        const buttons = U.resetButtonState(state.buttons, tabStatus)
        return { ...state, images, buttons }
    }
    const captureImage = (state, event) => {
        const uploadingStatusMsg = 'Not uploading'
        return [
            {
                ...state, uploadingStatusMsg
            },
            effects.takePictureFx(processImage)
        ]
    }
    const discardImage = (state, value) => {
        return U.resetImage(state, IMAGE_STATE.INIT)
    }
    const httpSuccessMsg = (state, { request, status }) => {
        switch (request) {
        case effects.HTTP_REQUESTS.UPLOAD_FILES: {
            const uploadingStatusMsg = 'Successfully uploaded'
            const recordingStatusMsg = 'Not Recording'
            const buttons = U.resetButtonState(state.buttons, status)
            const recordings = []
            const audioUrl = []
            const images = []
            return [
                { ...state, uploadingStatusMsg, buttons, recordings, images, audioUrl, recordingStatusMsg },
                effects.removeFromLocalStoreFx()
            ]
        }
        }
        return U.selectTab(state, 'videoTab')
    }
    const httpFailMsg = (state, { request, error }) => {
        switch (request) {
        case HTTP_REQUESTS.UPLOAD_FILES: {
            const uploadingStatusMsg = 'Upload failed... ' + error.status + ': ' + error.msg
            return { ...state, uploadingStatusMsg }
        }
        }
        return U.selectTab(state, 'videoTab')
    }
    const updateStatus = (state, data) => {
        const { status, images, recordings } = data
        return manageUpload(state, status, images, recordings)
    }
    const uploadFiles = (state) => {
        const { status, images, recordings } = state
        return manageUpload(state, status, images, recordings)
    }
    const deleteAudio = (state, value) => {
        return U.resetAudio(state, AUDIO_STATE.INIT)
    }
    const audioReady = (state, { status, url, recordings }) => {
        if (status === AUDIO_STATE.READY) {
            const recordingStatusMsg = 'Recording ready'
            const audioUrl = [url]
            const buttons = U.resetButtonState(state.buttons, status)
            return { ...state, recordings, buttons, audioUrl, recordingStatusMsg }
        } else {
            return U.resetAudio(state, AUDIO_STATE.INIT)
        }
    }
    const stopAudio = (state, value) => [
        state,
        effects.stopRecordingFx(audioReady)
    ]
    const recordingStarted = (state, response) => {
        if (response.status === AUDIO_STATE.RECORDING) {
            const recordingStatusMsg = 'Recording...'
            const buttons = U.resetButtonState(state.buttons, AUDIO_STATE.RECORDING)
            return { ...state, recordingStatusMsg, buttons }
        } else {
            return U.resetAudio(state, AUDIO_STATE.INIT)
        }
    }
    const recordAudio = (state, value) => [
        state,
        effects.startRecordingFx(recordingStarted)
    ]

    const initialStateObj = {
        'title': 'Hyperapp demo', // pug-vdom expects at least a 'title' by default
        'status': 'online',
        'deferredPrompt': null, // PWA status variable
        'onlineStatusMsg': 'App is online',
        'uploadingStatusMsg': 'Not uploading',
        'accountInfoStatusMsg': 'No requests submitted',
        'recordingStatusMsg': 'Not recording',
        'images': [],
        'recordings': [],
        'audioUrl': [],
        'buttons': [
            { 'id': 'uploadImage', 'active': false, 'action': uploadFiles, 'txt': 'Upload Photo', 'usedBy': IMAGE_STATE.TAKEN },
            { 'id': 'discardImage', 'active': false, 'action': discardImage, 'txt': 'Delete Photo', 'usedBy': IMAGE_STATE.TAKEN },
            { 'id': 'captureImage', 'active': true, 'action': captureImage, 'txt': 'Take Picture', 'usedBy': IMAGE_STATE.INIT  },
            { 'id': 'uploadAudio', 'active': false, 'action': uploadFiles, 'txt': 'Upload Recording', 'usedBy': AUDIO_STATE.READY },
            { 'id': 'deleteAudio', 'active': false, 'action': deleteAudio, 'txt': 'Delete Recording', 'usedBy': AUDIO_STATE.READY },
            { 'id': 'stopAudio', 'active': false, 'action': stopAudio, 'txt': 'Stop', 'usedBy': AUDIO_STATE.RECORDING },
            { 'id': 'recordAudio', 'active': false, 'action': recordAudio, 'txt': 'Start Recording', 'usedBy': AUDIO_STATE.INIT },
        ],
        'tabs': [
            { 'id': 'videoTab', 'active': true, 'action': [U.selectTab, targetId], 'tabName': 'videoSelection', 'txt': 'Take a Picture', 'usedBy': IMAGE_STATE.INIT },
            { 'id': 'audioTab', 'active': false, 'action': [U.selectTab, targetId], 'tabName': 'audioSelection', 'txt': 'Make a Recording', 'usedBy': AUDIO_STATE.INIT }
        ],
        'installAsPwa': installAsPwa,
        'installed': true
    }
        
    return Object.freeze({
        updateStatus,
        audioReady,
        handleInstallState,
        initialStateObj
    })
})()

export default actions
