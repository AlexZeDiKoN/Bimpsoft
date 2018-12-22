import PropTypes from 'prop-types'
import { Record, List, Map } from 'immutable'
import { model } from '@DZVIN/MilSymbolEditor'
import { update, comparator, filter, merge } from '../../utils/immutable'
import { actionNames } from '../actions/webMap'
import { CoordinatesTypes, MapSources, colors } from '../../constants'
import SubordinationLevel from '../../constants/SubordinationLevel'

const { APP6Code: { getAmplifier }, symbolOptions } = model

const WebMapPoint = Record({
  lat: null,
  lng: null,
})

const webMapAttributesInitValues = {
  template: '',
  color: colors.BLACK,
  fill: colors.TRANSPARENT,
  lineType: 'solid',
  strokeWidth: 2,
  lineAmpl: 'none',
  left: 'none',
  right: 'none',
  lineNodes: 'none',
  texts: [],
  z: null,
}

for (const key of Object.keys(symbolOptions)) {
  webMapAttributesInitValues[key] = ''
}

webMapAttributesInitValues['enableSignOffset'] = ''

const WebMapAttributes = Record(webMapAttributesInitValues)

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
  sources: MapSources,
  source: MapSources[0],
  subordinationLevel: SubordinationLevel.TEAM_CREW,
  objects: Map(),
  lockedObjects: Map(),
  version: null,
  contactId: null,
  scaleToSelection: false,
  marker: null,
})

const checkLevel = (object) => {
  const { code, level } = object
  object.level = Number(level || (code && getAmplifier(code)))
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

const lockObject = (map, { objectId, contactName }) => map.get(objectId) !== contactName
  ? map.set(objectId, contactName)
  : map

const unlockObject = (map, { objectId }) => map.get(objectId)
  ? map.delete(objectId)
  : map

const simpleSetFields = [ {
  action: actionNames.SET_COORDINATES_TYPE,
  field: 'coordinatesType',
}, {
  action: actionNames.SET_MINIMAP,
  field: 'showMiniMap',
}, {
  action: actionNames.SET_AMPLIFIERS,
  field: 'showAmplifiers',
}, {
  action: actionNames.SET_GENERALIZATION,
  field: 'generalization',
}, {
  action: actionNames.SET_SOURCE,
  field: 'source',
}, {
  action: actionNames.SET_MEASURE,
  field: 'isMeasureOn',
}, {
  action: actionNames.SET_SCALE_TO_SELECTION,
  field: 'scaleToSelection',
}, {
  action: actionNames.SET_MARKER,
  field: 'marker',
}, {
  action: actionNames.SUBORDINATION_LEVEL,
  field: 'subordinationLevel',
} ]

const actionField = (actionName) => {
  const simpleSet = simpleSetFields.find(({ action }) => action === actionName)
  return simpleSet
    ? simpleSet.field
    : null
}

export default function webMapReducer (state = WebMapState(), action) {
  const { type, payload } = action
  switch (type) {
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
    case actionNames.SET_SOURCES: {
      console.log(payload.source)
      return state
        .set('sources', payload.sources)
        .set('source', payload.source)
    }
    case actionNames.ADD_OBJECT:
    case actionNames.UPD_OBJECT:
      return update(state, 'objects', (map) => updateObject(map, payload))
    case actionNames.DEL_OBJECT:
      return payload ? state.deleteIn([ 'objects', payload ]) : state
    case actionNames.ALLOCATE_OBJECTS_BY_LAYER_ID: {
      const delLayerId = payload
      return state.set('objects', state.get('objects').filter(({ layer }) => layer !== delLayerId))
    }
    case actionNames.REFRESH_OBJECT: {
      const { id, object } = payload
      return object.id
        ? update(state, 'objects', (map) => updateObject(map, object)) // Об'єкт додано або змінено
        : state.deleteIn([ 'objects', id ]) // Об'єкт видалено
    }
    case actionNames.SET_MAP_CENTER: {
      const { center, zoom } = payload
      let result = state
      if (center) {
        result = result.set('center', center)
      }
      if (zoom) {
        result = result.set('zoom', zoom)
      }
      return result
    }
    case actionNames.APP_INFO: {
      const { version, contactId } = payload
      return state
        .set('version', version)
        .set('contactId', +contactId)
    }
    case actionNames.GET_LOCKED_OBJECTS: {
      const myContactId = state.get('contactId')
      return update(state, 'lockedObjects', (map) => Object.entries(payload)
        .filter(({ contactId }) => String(contactId) !== String(myContactId))
        .map(([ objectId, { contactName } ]) => ({ objectId, contactName }))
        .reduce(lockObject, map))
    }
    case actionNames.OBJECT_LOCKED: {
      return update(state, 'lockedObjects', (map) => lockObject(map, payload))
    }
    case actionNames.OBJECT_UNLOCKED: {
      return update(state, 'lockedObjects', (map) => unlockObject(map, payload))
    }
    default: {
      const field = actionField(type)
      return field
        ? state.set(field, payload)
        : state
    }
  }
}

export const propTypes = PropTypes.shape({
  objects: PropTypes.object.isRequired,
  source: PropTypes.object.isRequired,
})
