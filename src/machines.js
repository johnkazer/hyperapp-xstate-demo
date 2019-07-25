import { Machine } from 'xstate'

export const videoMachine = Machine ({
    id: 'videoMachine',
    context: {
        statusMessage: ''
    },
    initial: 'setup',
    states: {
        setup: {
            entry: ['setup', 'activate'],
            on: {
                connect: 'connected',
                fail: 'setup'
            }
        },
        connected: {
            on: {
                captureImage: 'capture'
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
