import * as effects from './effects.js'
import { concat, curry, map, pathOr } from 'ramda'
import { videoMachine, audioMachine } from './machines.js'
import { interpret } from 'xstate'
// Don't curry actions passed to effects! It feels like you need to in order to grab `state` when passing an action, but this is what the `dispatch()` function will do

const HTTP_REQUESTS = effects.HTTP_REQUESTS
const AUDIO_STATE = effects.AUDIO_STATE
const STATE_MACHINES = {
    VIDEO_MACHINE: 'videoMachine',
    AUDIO_MACHINE: 'audioMachine'
}

const targetValue = event => event.target.value
const targetProp = prop => event => event.target[prop]
const targetId = targetProp('id')

const processNewState = (state, { machineState, machineName, machine, id }) => {
    const previousState = pathOr(machineState, [machineState, 'value'], state)
    const newMachineState = machine.transition(previousState, id)
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
const updateState = (state, id, type) => {
    switch(type) {
        case STATE_MACHINES.VIDEO_MACHINE: return processNewState(state, { machineState: 'videoState', machineName: type, machine: videoMachineX, id })
        case STATE_MACHINES.AUDIO_MACHINE: return processNewState(state, { machineState: 'audioState', machineName: type, machine: audioMachineX, id })
    }
    return state
}
const updateVideoState = (state, id) => updateState(state, id, STATE_MACHINES.VIDEO_MACHINE)
const updateAudioState = (state, id) => updateState(state, id, STATE_MACHINES.AUDIO_MACHINE)
const runActions = (state, calcState, evtObj) => { // make recursive or map
    let requests = []
    calcState.actions.forEach(action => {
        const stateChangeRequest = action.exec(state,evtObj)
        const isArray = Array.isArray(stateChangeRequest)
        requests = concat(requests, isArray ? stateChangeRequest : [stateChangeRequest])
    });
    return requests
}
const finaliseLocalSave = (state, { request, imageStored, recordingStored }) => {
    const machineToUpdate = request === HTTP_REQUESTS.UPLOAD_VIDEO ? STATE_MACHINES.VIDEO_MACHINE : STATE_MACHINES.AUDIO_MACHINE
    return { ...updateState(state, 'uploadSuccess', machineToUpdate) }
}
const manageUpload = (state, status, images, recordings, request) => {
    if (status === 'offline') { // save file to local storage
        const onlineStatusMsg = 'App is offline'
        const definedMachineState = request === HTTP_REQUESTS.UPLOAD_VIDEO ? STATE_MACHINES.VIDEO_MACHINE : request === HTTP_REQUESTS.UPLOAD_AUDIO ? STATE_MACHINES.AUDIO_MACHINE : ''
        return [
            state,
            effects.addToLocalStoreFx(finaliseLocalSave, request, images, recordings)
        ]
    } else {
        const onlineStatusMsg = 'App is online'
        const uploadingStatusMsg = 'Uploading files(s), please wait ...'
        return [
            { ...state, status, uploadingStatusMsg, onlineStatusMsg },
            effects.uploadFx(httpSuccessMsg, httpFailMsg, concat(images, recordings), request, '')
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
export const handleInstallState = (state, { deferredPrompt, installed }) => {
    return { ...state, deferredPrompt, installed }
}
const processImage = (state, { images }) => {
    const status = images.length < 1 ? 'fail' : 'success'
    return { ...updateState(state, status, STATE_MACHINES.VIDEO_MACHINE), images }
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
    const images = []
    const uploadingStatusMsg = 'Not uploading'
    return { ...state, images, uploadingStatusMsg }
}
const resetAfterSaveUploadMedia = (state, type) => {
    const recordingStatusMsg = 'Not Recording'
    const uploadingStatusMsg = 'Successfully saved'
    const recordings = []
    const audioUrl = []
    const images = []
    return { ...updateState(state, 'uploadSuccess', type), uploadingStatusMsg, recordings, images, audioUrl, recordingStatusMsg }
}
const httpSuccessMsg = (state, { request }) => {
    switch (request) {
    case HTTP_REQUESTS.UPLOAD_VIDEO: {
        return resetAfterSaveUploadMedia(state, STATE_MACHINES.VIDEO_MACHINE)
    }
    case HTTP_REQUESTS.UPLOAD_AUDIO: {
        return resetAfterSaveUploadMedia(state, STATE_MACHINES.AUDIO_MACHINE)
    }
    case HTTP_REQUESTS.UPLOAD_STORAGE: {
        const recordingStatusMsg = 'Not Recording'
        const uploadingStatusMsg = 'Successfully saved'
        return [
            { ...state, recordingStatusMsg, uploadingStatusMsg },
            effects.removeFromLocalStoreFx()
        ]
    }
    }
    return updateState(state, 'videoState', 'videoState')
}
const httpFailMsg = (state, { request, error }) => {
    const uploadingStatusMsg = 'Upload failed... ' + error.status + ': ' + error.msg
    switch (request) {
    case HTTP_REQUESTS.UPLOAD_VIDEO: {
        return { ...updateState(state, 'uploadFail', STATE_MACHINES.VIDEO_MACHINE), uploadingStatusMsg }
    }
    case HTTP_REQUESTS.UPLOAD_AUDIO: {
        return { ...updateState(state, 'uploadFail', STATE_MACHINES.AUDIO_MACHINE), uploadingStatusMsg }
    }
    case HTTP_REQUESTS.UPLOAD_STORAGE: {
        return state
    }
    }
    return updateState(state, 'videoState', 'videoState')
}
export const updateOnlineStatus = (state, data) => {
    const { status } = data
    if (status === 'offline' ) {
        const onlineStatusMsg = 'App is offline'
        return { ...state, status, onlineStatusMsg }
    }
    const images = pathOr(state.images, ['images'], data)
    const recordings = pathOr(state.images, ['recordings'], data)
    return manageUpload(state, status, images, recordings, HTTP_REQUESTS.UPLOAD_STORAGE)
    // only want to upload files from storage
}
const selectTab = (state, id) => {
    const updateTabStatus = curry((id, tab) => {
        const active = tab.id === id
        return { ...tab, active }
    })(id)
    const tabs = map(updateTabStatus, state.tabs)
    return { ...state, tabs }
}
const uploadImage = (state) => uploadFiles(state, HTTP_REQUESTS.UPLOAD_VIDEO)
const uploadAudio = (state) => uploadFiles(state, HTTP_REQUESTS.UPLOAD_AUDIO)
const uploadFiles = (state, request) => {
    const { status, images, recordings } = state
    return manageUpload(state, status, images, recordings, request)
}
const deleteAudio = (state, value) => {
    const recordings = []
    const audioUrl = []
    const uploadingStatusMsg = 'Not uploading'
    const recordingStatusMsg = 'Not recording'
    return { ...state, recordings, audioUrl, uploadingStatusMsg, recordingStatusMsg }
}
export const audioReady = (state, { url, recordings }) => {
    if (recordings.length > 0 && url.length > 0) {
        const recordingStatusMsg = 'Recording ready'
        const audioUrl = [url]
        return { ...updateState(state, 'success', STATE_MACHINES.AUDIO_MACHINE), recordings, audioUrl, recordingStatusMsg }
    } else {
        return updateState(state, 'fail', STATE_MACHINES.AUDIO_MACHINE)
    }
}
const stopAudio = (state, value) => {
    return [
        state,
        effects.stopRecordingFx(audioReady)
    ]
}
const recordingStarted = (state, response) => {
    if (response.status === AUDIO_STATE.RECORDING) {
        const recordingStatusMsg = 'Recording...'
        return { ...updateState(state, 'success', STATE_MACHINES.AUDIO_MACHINE), recordingStatusMsg }
    } else {
        const recordingStatusMsg = 'Recording failed'
        return { ...updateState(state, 'fail', STATE_MACHINES.AUDIO_MACHINE), recordingStatusMsg }
    }
}
const recordAudio = (state, value) => [
    state,
    effects.startRecordingFx(recordingStarted)
]

const videoMachineX = videoMachine.withConfig({
    actions: {
        captureImage,
        discardImage,
        uploadImage
    }
})

const audioMachineX = audioMachine.withConfig({
    actions: {
        recordAudio,
        stopAudio,
        deleteAudio,
        uploadAudio
    }
})

export const initialStateObj = {
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
    'videoButtons': [
        { 'id': 'uploadImage', 'active': 'captured', 'action': [updateVideoState, targetId], 'txt': 'Save Photo' },
        { 'id': 'discardImage', 'active': 'captured', 'action': [updateVideoState, targetId], 'txt': 'Delete Photo' },
        { 'id': 'captureImage', 'active': 'videoState', 'action': [updateVideoState, targetId], 'txt': 'Take Picture'  }
    ],
    'audioButtons': [
        { 'id': 'uploadAudio', 'active': 'recorded', 'action': [updateAudioState, targetId], 'txt': 'Save Recording' },
        { 'id': 'deleteAudio', 'active': 'recorded', 'action': [updateAudioState, targetId], 'txt': 'Delete Recording' },
        { 'id': 'stopAudio', 'active': 'recording', 'action': [updateAudioState, targetId], 'txt': 'Stop' },
        { 'id': 'recordAudio', 'active': 'audioState', 'action': [updateAudioState, targetId], 'txt': 'Start Recording' },
    ],
    'tabs': [
        { 'id': 'videoTab', 'active': true, 'action': [selectTab, targetId], 'tabName': 'videoSelection', 'txt': 'Take a Picture' },
        { 'id': 'audioTab', 'active': false, 'action': [selectTab, targetId], 'tabName': 'audioSelection', 'txt': 'Make a Recording' }
    ],
    'installAsPwa': installAsPwa,
    'installed': true,
    'videoState': { value: 'videoState' }, // need to init this properly within setup
    'audioState': { value: 'audioState' }
}
