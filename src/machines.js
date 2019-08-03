import { Machine } from 'xstate'

export const videoMachine = Machine ({
    id: 'videoMachine',
    initial: 'videoState',
    states: {
        videoState: {
            on: {
                captureImage: {
                    target: 'capture',
                    actions: ['captureImage']
                }
            }
        },
        capture: {
            on: {
                success: 'captured',
                fail: 'videoState'
            }
        },
        captured: {
            on: {
                uploadImage: {
                    target: 'upload',
                    actions: ['uploadImage']
                },
                discardImage: {
                    target: 'videoState',
                    actions: ['discardImage']
                }
            }
        },
        upload: {
            on: {
                uploadSuccess: {
                    target: 'videoState',
                    actions: ['discardImage']
                },
                uploadFail: 'captured'
            }
        }
    }
})
export const audioMachine = Machine({
    id: 'audioMachine',
    initial: 'audioState',
    states: {
        audioState: {
            on: {
                recordAudio: {
                    target: 'startRecording',
                    actions: ['recordAudio']
                }
            }
        },
        startRecording: {
            on: {
                success: 'recording',
                fail: 'audioState'
            }
        },
        recording: {
            on: {
                stopAudio: {
                    target: 'stopped',
                    actions: ['stopAudio']
                }
            }
        },
        stopped: {
            on: {
                success: 'recorded',
                fail: 'audioState'
            }
        },
        recorded: {
            on: {
                uploadAudio: {
                    target: 'upload',
                    actions: ['uploadAudio']
                },
                deleteAudio: {
                    target: 'audioState',
                    actions: ['deleteAudio']
                }
            }
        },
        upload: {
            on: {
                uploadSuccess: {
                    target: 'audioState',
                    actions: ['deleteAudio']
                },
                uploadFail: 'recorded'
            }
        }
    }
})
