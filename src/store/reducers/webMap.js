import PropTypes from 'prop-types'
import { Record, List, Map } from 'immutable'
import * as amplifiers from '@DZVIN/MilSymbolEditor/src/model/symbolOptions'
import { update, comparator, filter, merge } from '../../utils/immutable'
import { actionNames } from '../actions/webMap'
import { ZOOMS, CoordinatesTypes, MapSources, colors, paramsNames } from '../../constants'
import SubordinationLevel from '../../constants/SubordinationLevel'

const WebMapPoint = Record({
  lat: null,
  lng: null,
})

for (const key of Object.keys(amplifiers)) {
  amplifiers[key] = ''
}

const WebMapAttributes = Record({
  ...amplifiers,
  template: '',
  color: colors.BLACK,
  fill: colors.TRANSPARENT,
  lineType: 'solid',
  lineAmpl: 'none',
  left: 'none',
  right: 'none',
  lineNodes: 'none',
  texts: [],
  z: null,
})

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
  center: { lat: 48, lng: 35 },
  zoom: 7,
  coordinatesType: CoordinatesTypes.WGS_84,
  showMiniMap: true,
  showAmplifiers: true,
  generalization: false,
  isMeasureOn: false,
  source: MapSources[0],
  subordinationLevel: SubordinationLevel.TEAM_CREW,
  objects: Map(),
})

const checkLevel = (object) => {
  const { code, level } = object
  if (code && !level) {
    object.level = +code.slice(8, 10)
  }
}

const updateObject = (map, { id, geometry, point, attributes, ...rest }) =>
  update(map, id, (object) => {
    checkLevel(rest)
    let obj = object || WebMapObject({ id, ...rest })
    obj = update(obj, 'point', comparator, WebMapPoint(point))
    obj = update(obj, 'attributes', comparator, WebMapAttributes(attributes))
    obj = update(obj, 'geometry', comparator, List((geometry || []).map(WebMapPoint)))
    return merge(obj, rest)
  })

export default function webMapReducer (state = WebMapState(), action) {
  const { type, payload } = action
  switch (type) {
    case actionNames.SET_COORDINATES_TYPE: {
      return state.set('coordinatesType', payload)
    }
    case actionNames.SET_MINIMAP: {
      return state.set('showMiniMap', payload)
    }
    case actionNames.SET_AMPLIFIERS: {
      return state.set('showAmplifiers', payload)
    }
    case actionNames.SET_GENERALIZATION: {
      return state.set('generalization', payload)
    }
    case actionNames.SET_SOURCE: {
      return state.set('source', payload)
    }
    case actionNames.SET_MEASURE: {
      return state.set('isMeasureOn', payload)
    }
    case actionNames.SUBORDINATION_LEVEL: {
      return state.set('subordinationLevel', payload)
    }
    case actionNames.OBJECT_LIST: {
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
    case actionNames.ADD_OBJECT:
    case actionNames.UPD_OBJECT:
      return update(state, 'objects', (map) => updateObject(map, payload))
    case actionNames.DEL_OBJECT:
      return payload ? state.deleteIn([ 'objects', payload ]) : state
    case actionNames.ALLOCATE_OBJECTS_BY_LAYER_ID: {
      const delLayerId = +payload
      return state.set('objects', state.get('objects').filter(({ layer }) => +layer !== delLayerId))
    }
    case actionNames.REFRESH_OBJECT: {
      const { id, object } = payload
      return object.id
        ? update(state, 'objects', (map) => updateObject(map, object)) // Об'єкт додано або змінено
        : state.deleteIn([ 'objects', id ]) // Об'єкт видалено
    }
    case actionNames.SET_MAP_CENTER: {
      const { center, zoom, params } = payload
      let result = state
        .set('center', center)
        .set('zoom', zoom)
      if (state.zoom !== zoom) {
        const scale = ZOOMS[zoom]
        const level = params && params[`${paramsNames.SCALE_VIEW_LEVEL}_${scale}`]
        const sl = +level || state.subordinationLevel
        result = result
          .set('subordinationLevel', sl)
      }
      return result
    }
    default:
      return state
  }
}

export const propTypes = PropTypes.shape({
  objects: PropTypes.object.isRequired,
  source: PropTypes.object.isRequired,
})
