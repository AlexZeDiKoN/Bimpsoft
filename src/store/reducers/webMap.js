import PropTypes from 'prop-types'
import { Record, List, Map } from 'immutable'
import { actionNames } from '../actions/webMap'
import { OBJECT_LIST, ADD_OBJECT, DEL_OBJECT, UPD_OBJECT } from '../actions/layers'

const WebMapPoint = Record({
  lat: null,
  lng: null,
})

const WebMapAttributes = Record()

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
  objects: Map(),
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
      let newState = state
      objects.forEach(({ id, type, code, point, geometry, unit, level, affiliation, layer, parent, attributes }) => {
        newState = newState.update(id, WebMapObject(), (object) => object
          .mergeDeep({ type, code, unit, level, affiliation, layer, parent, point, attributes })
          .update('geometry', (list) => list
            .setSize(geometry.length)
            .merge(List(geometry.map((point) => WebMapPoint(point))))
          )
        )
      })
      return newState
        .filter(({ id, layer }) => (layer !== layerId) || objects.find((object) => object.id === id))
    }
    case ADD_OBJECT:
    case UPD_OBJECT: {
      if (!payload) {
        return state
      }
      const { id, type, code, point, geometry, unit, level, affiliation, layer, parent, attributes } = payload
      return state
        .update(id, WebMapObject(), (object) => object
          .mergeDeep({ type, code, unit, level, affiliation, layer, parent, point, attributes })
          .update('geometry', (list) => list
            .setSize(geometry.length)
            .merge(List(geometry.map((point) => WebMapPoint(point))))
          )
        )
    }
    case DEL_OBJECT: {
      if (!payload) {
        return state
      }
      return state.delete(payload)
    }
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
