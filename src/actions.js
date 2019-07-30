import effects from './effects.js'
import { concat, lensPath, set, pipe, pathEq, filter, curry, map, pathOr, view } from 'ramda'
import U from './utils.js'
import { videoMachine } from './machines.js'
import { interpret } from 'xstate'
// Don't curry actions passed to effects! It feels like you need to in order to grab `state` when passing an action, but this is what the `dispatch()` function will do

const actions = ( () => {
    const HTTP_REQUESTS = effects.HTTP_REQUESTS
    const AUDIO_STATE = effects.AUDIO_STATE
    const IMAGE_STATE = effects.IMAGE_STATE

    const targetValue = event => event.target.value
    const targetProp = prop => event => event.target[prop]
    const targetId = targetProp('id')

    const videoUseByLens = lensPath([0, 'usedBy'])
    const audioUseByLens = lensPath([1, 'usedBy'])
    const currentTabLens = lensPath(['active'])

    const updateVideoState = (state, id) => {
        const videoState = interpret(videoMachine, id)
        return { ...state, videoState }
    }
    
    const manageUpload = (state, status, images, recordings) => {
        if (status === 'offline') { // save file to local storage
            const onlineStatusMsg = 'App is offline'
            return [
                resetAfterSaveUploadMedia({ ...state, status, onlineStatusMsg }),
                effects.addToLocalStoreFx(images, recordings)
            ]
        } else {
            const onlineStatusMsg = 'App is online'
            const uploadingStatusMsg = 'Uploading files(s), please wait ...'
            return [
                { ...state, status, uploadingStatusMsg, onlineStatusMsg },
                effects.uploadFx(httpSuccessMsg, httpFailMsg, concat(images, recordings), '')
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
        const tabs = set(videoUseByLens, IMAGE_STATE.TAKEN, state.tabs)
        return [
            {
                ...state, uploadingStatusMsg, tabs
            },
            effects.takePictureFx(processImage)
        ]
    }
    const discardImage = (state, value) => {
        const tabs = set(videoUseByLens, IMAGE_STATE.INIT, state.tabs)
        return U.resetImage({ ...state, tabs }, IMAGE_STATE.INIT)
    }
    const resetAfterSaveUploadMedia = (state) => {
        const recordingStatusMsg = 'Not Recording'
        const uploadingStatusMsg = 'Successfully saved'
        const recordings = []
        const audioUrl = []
        const images = []
        const resetAudioTab = set(audioUseByLens, AUDIO_STATE.INIT)
        const resetVideoTab = set(videoUseByLens, IMAGE_STATE.INIT)
        const tabs = pipe(
            resetAudioTab,
            resetVideoTab
        )(state.tabs)
        const viewCurrentTab = (tab) => view(currentTabLens)(tab)
        const currentTab = filter(viewCurrentTab, tabs)[0]
        const buttons = U.resetButtonState(state.buttons, currentTab.usedBy)
        return { ...state, uploadingStatusMsg, buttons, recordings, images, audioUrl, recordingStatusMsg, tabs }
    }
    const httpSuccessMsg = (state, { request }) => {
        switch (request) {
        case effects.HTTP_REQUESTS.UPLOAD_FILES: {
            return [
                resetAfterSaveUploadMedia(state),
                effects.removeFromLocalStoreFx()
            ]
        }
        }
        const tabs = selectTab(state, 'videoTab')
        return { ...state, tabs }
    }
    const httpFailMsg = (state, { request, error }) => {
        switch (request) {
        case HTTP_REQUESTS.UPLOAD_FILES: {
            const uploadingStatusMsg = 'Upload failed... ' + error.status + ': ' + error.msg
            return { ...state, uploadingStatusMsg }
        }
        }
        const tabs = selectTab(state, 'videoTab')
        return { ...state, tabs }
    }
    const updateStatus = (state, data) => {
        const { status } = data
        const images = pathOr(state.images, ['images'], data)
        const recordings = pathOr(state.images, ['recordings'], data)
        return manageUpload(state, status, images, recordings)
    }
    const selectTab = (state, id) => {
        const updateTabStatus = curry((id, tab) => {
            const active = tab.id === id
            return { ...tab, active }
        })(id)
        const tabs = map(updateTabStatus, state.tabs)
        const buttons = U.resetButtonState(state.buttons, tabs.find((element) => element.id === id).usedBy)
        return { ...state, tabs, buttons }
    }
    const uploadFiles = (state) => {
        const { status, images, recordings } = state
        return manageUpload(state, status, images, recordings)
    }
    const deleteAudio = (state, value) => {
        const tabs = set(audioUseByLens, AUDIO_STATE.INIT, state.tabs)
        return U.resetAudio({ ...state, tabs }, AUDIO_STATE.INIT)
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
    const stopAudio = (state, value) => {
        const tabs = set(audioUseByLens, AUDIO_STATE.READY, state.tabs)
        return [
            {
                ...state, tabs
            },
            effects.stopRecordingFx(audioReady)
        ]
    }
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
            { 'id': 'uploadImage', 'active': false, 'action': [updateVideoState, targetId], 'txt': 'Save Photo' },
            { 'id': 'discardImage', 'active': false, 'action': [updateVideoState, targetId], 'txt': 'Delete Photo' },
            { 'id': 'captureImage', 'active': true, 'action': [updateVideoState, targetId], 'txt': 'Take Picture'  },
            { 'id': 'uploadAudio', 'active': false, 'action': uploadFiles, 'txt': 'Save Recording', 'usedBy': AUDIO_STATE.READY },
            { 'id': 'deleteAudio', 'active': false, 'action': deleteAudio, 'txt': 'Delete Recording', 'usedBy': AUDIO_STATE.READY },
            { 'id': 'stopAudio', 'active': false, 'action': stopAudio, 'txt': 'Stop', 'usedBy': AUDIO_STATE.RECORDING },
            { 'id': 'recordAudio', 'active': false, 'action': recordAudio, 'txt': 'Start Recording', 'usedBy': AUDIO_STATE.INIT },
        ],
        'tabs': [
            { 'id': 'videoTab', 'active': true, 'action': [selectTab, targetId], 'tabName': 'videoSelection', 'txt': 'Take a Picture', 'usedBy': IMAGE_STATE.INIT },
            { 'id': 'audioTab', 'active': false, 'action': [selectTab, targetId], 'tabName': 'audioSelection', 'txt': 'Make a Recording', 'usedBy': AUDIO_STATE.INIT }
        ],
        'installAsPwa': installAsPwa,
        'installed': true,
        'videoState': {},
        'audioState': {}
    }
        
    return Object.freeze({
        updateStatus,
        audioReady,
        handleInstallState,
        initialStateObj
    })
})()

export default actions
