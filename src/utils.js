import { map, curry } from 'ramda'
const U = (function (){
    const selectTab = (state, id) => {
        const updateTabStatus = curry((id, tab) => {
            const active = tab.id === id
            return { ...tab, active }
        })(id)
        const tabs = map(updateTabStatus, state.tabs)
        const buttons = resetButtonState(state.buttons, tabs.find((element) => element.id === id).usedBy)
        return { ...state, tabs, buttons }
    }
    function resetImage (state, newStatus) {
        const images = []
        const uploadingStatusMsg = 'Not uploading'
        const buttons = resetButtonState(state.buttons, newStatus)
        return { ...state, images, buttons }
    }
    function resetAudio (state, newStatus) {
        const recordings = []
        const audioUrl = []
        const uploadingStatusMsg = 'Not uploading'
        const recordingStatusMsg = 'Not recording'
        const buttons = resetButtonState(state.buttons, newStatus)
        return { ...state, recordings, audioUrl, uploadingStatusMsg, recordingStatusMsg, buttons }
    }
    const resetButtonState = (currentButtons, tabStatus) => {
        function updateButtons (newStatus, button) {
            if (button.usedBy === newStatus) {
                const active = true
                return { ...button, active }
            } else {
                const active = false
                return { ...button, active }
            }
        }
        if (tabStatus === 'both') return currentButtons
        const flipState = curry(updateButtons)(tabStatus)
        const buttons = map(flipState, currentButtons)
        return buttons
    }
    return Object.freeze({
        selectTab,
        resetImage,
        resetAudio,
        resetButtonState
    })
})()
export default U
