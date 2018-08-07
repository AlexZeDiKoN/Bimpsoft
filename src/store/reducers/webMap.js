import PropTypes from 'prop-types'
import { Record, List, Map } from 'immutable'
import { update, comparator, filter } from '../../utils/immutable'
import { actionNames } from '../actions/webMap'
import { OBJECT_LIST, ADD_OBJECT, DEL_OBJECT, UPD_OBJECT } from '../actions/layers'
import { CoordinatesTypes } from '../../constants'

const WebMapPoint = Record({
  lat: null,
  lng: null,
})

const WebMapAttributes = Record({})

const WebMapObject = Record({
  id: null,
  type: null,
  code: null,
  point: WebMapPoint(),
  geometry: List(),
  unit: null,
  level: null,
  affiliation: null,
  layer: null,
  parent: null,
  attributes: WebMapAttributes(),
})

const WebMapState = Record({
  isMapEditMode: false,
  isPointMarkEditMode: false,
  isTextMarkEditMode: false,
  isTimelineEditMode: false,
  coordinatesType: CoordinatesTypes.WGS_84,
  showMiniMap: true,
  showAmplifiers: false,
  generalization: false,
  objects: Map(),
})

const updateObject = (map, { id, geometry, point, attributes, ...rest }) =>
  update(map, id, (object) => {
    let obj = object || WebMapObject({ id, ...rest })
    obj = update(obj, 'point', comparator, WebMapPoint(point))
    obj = update(obj, 'attributes', comparator, WebMapAttributes(attributes))
    obj = update(obj, 'geometry', comparator, List(geometry.map(WebMapPoint)))
    return obj
  })

export default function webMapReducer (state = WebMapState(), action) {
  let { type, payload } = action
  switch (type) {
    case actionNames.TOGGLE_MAP_EDIT_MODE: {
      if (!payload) {
        payload = !state.get('isMapEditMode')
      }
      return state.merge({
        isMapEditMode: payload,
        isPointMarkEditMode: false,
        isTextMarkEditMode: false,
      })
    }
    case actionNames.TOGGLE_POINT_MARK_EDIT_MODE: {
      if (!payload) {
        payload = !state.get('isPointMarkEditMode')
      }
      return state.merge({
        isMapEditMode: false,
        isPointMarkEditMode: payload,
        isTextMarkEditMode: false,
      })
    }
    case actionNames.TOGGLE_TEXT_MARK_EDIT_MODE: {
      if (!payload) {
        payload = !state.get('isTextMarkEditMode')
      }
      return state.merge({
        isMapEditMode: false,
        isPointMarkEditMode: false,
        isTextMarkEditMode: payload,
      })
    }
    case actionNames.SET_COORDINATES_TYPE: {
      return state.merge({
        coordinatesType: payload,
      })
    }
    case actionNames.SET_MINIMAP: {
      return state.merge({
        showMiniMap: payload,
      })
    }
    case actionNames.SET_AMPLIFIERS: {
      return state.merge({
        showAmplifiers: payload,
      })
    }
    case actionNames.SET_GENERALIZATION: {
      return state.merge({
        generalization: payload,
      })
    }
    case actionNames.TOGGLE_TIMELINE_EDIT_MODE: {
      if (!payload) {
        payload = !state.get('isTimelineEditMode')
      }
      return state.set('isTimelineEditMode', payload)
    }
    case OBJECT_LIST: {
      if (!payload) {
        return state
      }
      const { layerId, objects } = payload
      return update(state, 'objects', (map) => {
        map = objects.reduce(updateObject, map)
        map = filter(map, ({ id, layer }) => (layer !== layerId) || objects.find((object) => object.id === id))
        return map
      })
    }
    case ADD_OBJECT:
    case UPD_OBJECT:
      return update(state, 'objects', (map) => updateObject(map, payload))
    case DEL_OBJECT:
      return payload ? state.deleteIn([ 'objects', payload ]) : state
    default:
      return state
  }
}

export const propTypes = PropTypes.shape({
  isMapEditMode: PropTypes.bool.isRequired,
  isPointMarkEditMode: PropTypes.bool.isRequired,
  isTextMarkEditMode: PropTypes.bool.isRequired,
  isTimelineEditMode: PropTypes.bool.isRequired,
  objects: PropTypes.object.isRequired,
})
