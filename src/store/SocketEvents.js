/* global io */
import { getWebmapApi } from '../utils/services'
import { UPDATE_LAYER } from './actions/layers'
import * as webMapActions from './actions/webMap'
import { printFileSet } from './actions/print'
import { catchError } from './actions/asyncAction'

const updateLayer = (dispatch) => ({ id: layerId, color }) => dispatch({
  type: UPDATE_LAYER,
  layerData: { layerId, color },
})

const updateObject = (dispatch) => ({ id }) =>
  catchError(webMapActions.refreshObject)(id)(dispatch)

const lockObject = (dispatch, getState) => ({ objectId, contactId, contactName }) => {
  if (String(getState().webMap.contactId) !== String(contactId)) {
    catchError(webMapActions.objectLocked)(objectId, contactName)(dispatch)
  }
}

const unlockObject = (dispatch) => ({ objectId }) =>
  catchError(webMapActions.objectUnlocked)(objectId)(dispatch)

const printGeneratingStatus = (dispatch) => ({ id, message, name }) =>
  catchError(printFileSet)(id, message, name)(dispatch)

export const initSocketEvents = (dispatch, getState) => {
  let socket
  try {
    socket = io(getWebmapApi())
  } catch (err) {
    console.warn('Вебсокет-сервер недоступний')
    return
  }
  socket.on('update layer color', updateLayer(dispatch))
  socket.on('update object', updateObject(dispatch))
  socket.on('lock object', lockObject(dispatch, getState))
  socket.on('unlock object', unlockObject(dispatch))
  socket.on('printStatus', printGeneratingStatus(dispatch))
}
