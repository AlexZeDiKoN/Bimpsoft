import { getWebmapApi } from '../utils/services'
import { UPDATE_LAYER } from './actions/layers'
import * as webMapActions from './actions/webMap'
import { printFileSet } from './actions/print'
import { catchError } from './actions/asyncAction'

const loadWebSocketClient = (url) =>
  new Promise((resolve, reject) => {
    try {
      const script = document.createElement('script')
      script.src = url + '/socket.io/socket.io.js'
      script.onload = () => {
        console.info(`socket.io script loaded`)
        resolve(window.io)
      }
      document.getElementsByTagName('head')[0].appendChild(script)
    } catch (err) {
      reject(err)
    }
  })

const updateLayer = (dispatch) => ({ id: layerId, color }) => dispatch({
  type: UPDATE_LAYER,
  layerData: { layerId, color },
})

const updateObject = (dispatch) => ({ id, type, layer }) => {
  // console.log('socket.io: update object', { id, type, layer })
  catchError(webMapActions.refreshObject)(id, type, layer)(dispatch)
}

const lockObject = (dispatch, getState) => ({ objectId, contactId, contactName }) => {
  // console.log(`lockObject`, getState().webMap.contactId, contactId)
  if (String(getState().webMap.contactId) !== String(contactId)) {
    catchError(webMapActions.objectLocked)(objectId, contactName)(dispatch)
  }
}

const unlockObject = (dispatch) => ({ objectId }) =>
  catchError(webMapActions.objectUnlocked)(objectId)(dispatch)

const printGeneratingStatus = (dispatch) => ({ id, message, name }) =>
  catchError(printFileSet)(id, message, name)(dispatch)

export const initSocketEvents = async (dispatch, getState) => {
  try {
    const url = getWebmapApi()
    const io = await loadWebSocketClient(url)
    const socket = io(url)
    socket.on('update layer color', updateLayer(dispatch))
    socket.on('update object', updateObject(dispatch))
    socket.on('lock object', lockObject(dispatch, getState))
    socket.on('unlock object', unlockObject(dispatch))
    socket.on('printStatus', printGeneratingStatus(dispatch))
    console.info('Підключено до вебсокет-серверу')
  } catch (err) {
    console.warn('Вебсокет-сервер недоступний')
  }
}
