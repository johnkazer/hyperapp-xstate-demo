import { map, filter, pipe, curry } from 'ramda'
import * as idb from 'idb-keyval'
const requestHandler = (function () {
    /** The camera handling function
     * Based on [@link https://dev.to/ore/building-an-offline-pwa-camera-app-with-react-and-cloudinary-5b9k]
     */
    const camera = (function () {
        let webcamElement = HTMLVideoElement
        let canvasElement = HTMLCanvasElement
        /** initialise the camera
         * @return {Promise} A promise to connect to the camera
         */
        const setup = function () {
            webcamElement = getWebcam();
            canvasElement = document.createElement('canvas');
            return new Promise((resolve, reject) => {
                if (navigator.mediaDevices.getUserMedia !== undefined) {
                    const userMediaResponse = navigator.mediaDevices.getUserMedia({
                        audio: false, video: { facingMode: 'environment' } // facingMode is 'user' for selfie cam
                    })
                        .then((mediaStream) => {
                            if ("srcObject" in webcamElement) {
                                webcamElement.srcObject = mediaStream;
                            } else {
                            // For older browsers without the srcObject.
                                webcamElement.src = window.URL.createObjectURL(mediaStream);
                            }
                            return webcamElement.addEventListener(
                                'loadeddata',
                                async () => {
                                    const adjustedSize = adjustVideoSize(
                                        webcamElement.videoWidth,
                                        webcamElement.videoHeight
                                    );
                                    return resolve(webcamElement);
                                },
                                false
                            );
                        });
                    return resolve()
                } else {
                    return reject('No media device available');
                }
            });
        }
        /** Take a photo as a canvas Blob
         * @return {Promise} A promise to return and object with the blob, height, width
         */
        function takeBlobPhoto() {
            const { imageWidth, imageHeight } = drawImage();
            return new Promise((resolve, reject) => {
                return canvasElement.toBlob((blob) => {
                    return resolve({ blob, imageHeight, imageWidth });
                });
            });
        }
        /** Take a photo as a base64 image
         * @param {object} - An object defining type and quality, defaults are 'png', 1
         * @return {object} an object with the base64 image, height, width
         */
        function takeBase64Photo({ type, quality } = { type: 'png', quality: 1 }) {
            const { imageHeight, imageWidth } = drawImage();
            const base64 = canvasElement.toDataURL('image/' + type, quality);
            return { base64, imageHeight, imageWidth };
        }
        // define the dimensions of the streamed video
        const adjustVideoSize = function (width, height) {
            const aspectRatio = width / height;
            if (width >= height) {
                webcamElement.width = aspectRatio * webcamElement.height;
            } else  {
                webcamElement.height = webcamElement.width / aspectRatio;
            }
            return webcamElement
        }
        // define the required dimensions for a new image
        function drawImage() {
            const imageWidth = webcamElement.videoWidth;
            const imageHeight = webcamElement.videoHeight;

            const context = canvasElement.getContext('2d');
            canvasElement.width = imageWidth;
            canvasElement.height = imageHeight;

            const drawnImage = context.drawImage(webcamElement, 0, 0, imageWidth, imageHeight);
            return { imageHeight, imageWidth };
        }
        function getWebcam () {
            return document.getElementById('webcam')
        }
        function getCanvas () {
            return document.getElementById('photoCanvas')
        }

        return Object.freeze({
            setup,
            takeBase64Photo,
            takeBlobPhoto
        })
    })(); // camera

    const offlineSupport = (function () {
        const findLocalItems = (type) => {
            const query = type + '_pwa_'
            return idb.keys() // IndexedDb key list
                .then(function (items) {
                    const promises = pipe(filter(item => item.includes(query)), map((item) => idb.get(item)))(items)
                    return Promise.all(promises)
                        .then((result) => result)
                })
        }
        const storeLocalItems = (item, type) => {
            if (item && (item.length === undefined || item.length === 0)) return
            // create a random string with a prefix
            const prefix = type + '_pwa_';
            // create random string
            const rs = Math.random().toString(36).substr(2, 5);
            const key = `${prefix}${rs}`
            if (Array.isArray(item)) {
                const storeItem = curry(idb.set)(key)
                return map(storeItem, item)
            }
            return idb.set(key, item);
        }
        const removeLocalItems = () => {
            return idb.clear()
        }
        return Object.freeze({
            findLocalItems,
            storeLocalItems,
            removeLocalItems
        })
    })(); // offlineSupport

    const audio = (function () {
        let recorder = undefined
        const mimeType = 'audio/webm';
        let chunks = [];
        let returnDataCB
        const setup = function (action, dispatch, readyStatus) {
            if ('MediaRecorder' in window) {
                try {
                    navigator.mediaDevices.getUserMedia({
                        audio: true,
                        video: false
                    })
                        .then(function (stream) {
                            recorder = new MediaRecorder(stream, { type: mimeType });
                            recorder.addEventListener('dataavailable', event => {
                                if (typeof event.data === 'undefined') return;
                                if (event.data.size === 0) return;
                                chunks.push(event.data);
                                const blob = new Blob(chunks, { type: mimeType });
                                // https://stackoverflow.com/questions/18650168/convert-blob-to-base64
                                // setup a local audio URL to enable playback in the browser
                                const audioURL = window.URL.createObjectURL(blob);
                                // audio.src = audioURL;
                                let recording
                                const reader = new window.FileReader();
                                reader.readAsDataURL(blob);
                                reader.onloadend = function () {
                                    recording = reader.result;
                                    chunks = [];
                                    dispatch(action, {
                                        status: readyStatus,
                                        recordings: [recording],
                                        url: audioURL
                                    })
                                }
                            });
                        })
                } catch {
                    return 'You denied access to the microphone so this feature will not work.'
                }
            } else {
                throw ('Your browser does not support audio recording.')
            }
        }
        function start() {
            recorder.start()
            return true
        }
        function stop() {
            recorder.stop()
        }
        return Object.freeze({
            setup,
            start,
            stop
        })
    })(); // audio

    const notes = (function () {
        const takeANote = function () { return true }
        return Object.freeze({
            takeANote
        })
    })

    const manageClient = (function () {
        const retrieveClientDetails = function (client) { return true }
        return Object.freeze({
            retrieveClientDetails
        })
    })

    return Object.freeze({
        camera,
        audio,
        notes,
        manageClient,
        offlineSupport
    })
})(); // handleRequests

export default requestHandler
