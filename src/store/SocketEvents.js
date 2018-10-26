/* global io */
import { getWebmapApi } from '../utils/services'
import { UPDATE_LAYER } from './actions/layers'
import * as webMapActions from './actions/webMap'

const updateLayer = (dispatch) => ({ id: layerId, color }) => dispatch({
  type: UPDATE_LAYER,
  layerData: { layerId, color },
})

const updateObject = (dispatch) => ({ id }) => {
  dispatch(webMapActions.refreshObject(id))
}

export const initSocketEvents = (dispatch/* , getState */) => {
  let socket
  try {
    socket = io(getWebmapApi())
  } catch (err) {
    console.warn('Вебсокет-сервер недоступний')
    return
  }
  socket.on('update layer color', updateLayer(dispatch))
  socket.on('update object', updateObject(dispatch))
}
