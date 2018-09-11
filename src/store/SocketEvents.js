/* global io */
import { getWebmapApi } from '../utils/services'
import { updateColorByLayerId } from './actions/layers'
import * as webMapActions from './actions/webMap'

const updateLayer = (dispatch) => (layerId) => {
  dispatch(updateColorByLayerId(Number(layerId)))
}

const updateObject = (dispatch) => (id) => {
  dispatch(webMapActions.refreshObject(id))
}

export const initSocketEvents = (dispatch, getState) => {
  let socket
  try {
    socket = io(getWebmapApi())
  } catch (err) {
    console.warn('Вебсокет-сервер недоступний')
    return
  }
  socket.on('update layer', updateLayer(dispatch))
  socket.on('update object', updateObject(dispatch))
}
