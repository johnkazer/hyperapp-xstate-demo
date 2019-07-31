import { Machine } from 'xstate'

export const videoMachine = Machine ({
    id: 'videoMachine',
    context: {
        statusMessage: ''
    },
    initial: 'connected',
    states: {
        connected: {
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
                fail: 'connected'
            }
        },
        captured: {
            on: {
                uploadImage: 'upload',
                discardImage: 'delete'
            }
        },
        upload: {
            on: {
                success: 'delete',
                fail: 'captured'
            }
        },
        delete: {
            on: {
                deleted: 'connected',
                fail: 'captured'
            }
        }
    }
})
