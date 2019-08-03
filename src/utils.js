import { map, curry } from 'ramda'

export function resetImage (state, newStatus) {
    const images = []
    const uploadingStatusMsg = 'Not uploading'
    const buttons = resetButtonState(state.buttons, newStatus)
    return { ...state, images, buttons }
}
export function resetAudio (state, newStatus) {
    const recordings = []
    const audioUrl = []
    const uploadingStatusMsg = 'Not uploading'
    const recordingStatusMsg = 'Not recording'
    const buttons = resetButtonState(state.buttons, newStatus)
    return { ...state, recordings, audioUrl, uploadingStatusMsg, recordingStatusMsg, buttons }
}
export const resetButtonState = (currentButtons, tabStatus) => {
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
