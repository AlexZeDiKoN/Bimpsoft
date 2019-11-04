import { UPDATE_LAYER } from './actions/layers'
import * as webMapActions from './actions/webMap'
import { printFileSet } from './actions/print'
import { catchError } from './actions/asyncAction'
import * as catalogActions from './actions/catalogs'

const server = process.env.REACT_APP_SERVER_URL

const loadWebSocketClient = () =>
  new Promise((resolve, reject) => {
    try {
      const script = document.createElement('script')
      script.src = `${server}/socket.io/socket.io.js`
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

const updateCatalogObject = (dispatch) => ({ itemId, catalogId }) => {
  // console.log('socket.io: update object', { id, type, layer })
  catchError(catalogActions.updateCatalogObject)(itemId, catalogId)(dispatch)
}

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

const printGeneratingStatus = (dispatch) => ({ id, message, name, documentPath }) =>
  catchError(printFileSet)(id, message, name, documentPath)(dispatch)

export const initSocketEvents = async (dispatch, getState) => {
  try {
    const io = await loadWebSocketClient()
    const socket = io(server)
    socket.on('map:update layer color', updateLayer(dispatch))
    socket.on('map:update object', updateObject(dispatch))
    socket.on('map:lock object', lockObject(dispatch, getState))
    socket.on('map:unlock object', unlockObject(dispatch))
    socket.on('map:printStatus', printGeneratingStatus(dispatch))
    socket.on('catalog:createOrUpdateCriticalObjectItem', updateCatalogObject(dispatch))
    console.info('Підключено до вебсокет-серверу')
    window.socket = socket
  } catch (err) {
    console.warn('Вебсокет-сервер недоступний')
  }
}
