import { action } from '../../utils/services'

export const actionNames = {
  SET_ZOOM: action('SET_ZOOM'),
}

export const setZoom = (zoom) => ({
  type: actionNames.SET_ZOOM,
  payload: zoom,
})
