/* global io */
import { getWebmapApi } from '../utils/services'
import { updateColorByLayerId } from './actions/layers'

const updateLayer = (dispatch) => (layerId) => dispatch(updateColorByLayerId(Number(layerId)))

export const initSocketEvents = (dispatch) => {
  let socket
  try {
    socket = io(getWebmapApi())
  } catch (err) {
    console.warn('Вебсокет-сервер недоступний')
    return
  }
  socket.on('update layer', updateLayer(dispatch))
  window.socket = socket
}
