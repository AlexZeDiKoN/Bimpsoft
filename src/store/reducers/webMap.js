import PropTypes from 'prop-types'
import { Record, List, Map } from 'immutable'
import { utils } from '@DZVIN/CommonComponents'
import { model } from '@DZVIN/MilSymbolEditor'
import { update, comparator, filter, merge, eq } from '../../utils/immutable'
import { actionNames } from '../actions/webMap'
import { MapSources, colors } from '../../constants'
import SubordinationLevel from '../../constants/SubordinationLevel'
import entityKind from '../../components/WebMap/entityKind'
import { settings } from '../../utils/svg/lines'
import { makeHash } from '../../utils/mapObjConvertor'
import { LS } from '../../utils'

const { APP6Code: { getAmplifier }, symbolOptions } = model

const { Coordinates: Coord } = utils
const { LINE_WIDTH } = settings

const WebMapPoint = Record({
  lat: null,
  lng: null,
})

const webMapAttributesInitValues = {
  template: '',
  color: colors.BLACK,
  fill: colors.TRANSPARENT,
  lineType: 'solid',
  strokeWidth: LINE_WIDTH,
  lineAmpl: 'none',
  left: 'none',
  right: 'none',
  lineNodes: 'none',
  texts: List(),
  z: null,
}

for (const key of Object.keys(symbolOptions)) {
  webMapAttributesInitValues[key] = ''
}

webMapAttributesInitValues['enableSignOffset'] = ''

export const WebMapAttributes = Record(webMapAttributesInitValues)

export const WebMapObject = Record({
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
  hash: null,
  indicatorsData: undefined,
})

const center = LS.get('view', 'center') || { lat: 48, lng: 35 }
const zoom = Number(LS.get('view', 'zoom')) || 7

const WebMapState = Record({
  center,
  zoom,
  coordinatesType: Coord.types.WGS_84,
  showMiniMap: true,
  showAmplifiers: true,
  // generalization: false,
  isMeasureOn: false,
  isMarkersOn: false,
  isTopographicObjectsOn: false,
  sources: MapSources,
  source: MapSources[0],
  subordinationAuto: true,
  subordinationLevel: SubordinationLevel.TEAM_CREW,
  objects: Map(),
  lockedObjects: Map(),
  version: null,
  contactId: null,
  positionContactId: null,
  unitId: null,
  scaleToSelection: false,
  marker: null,
  topographicObjects: {},
})

const checkLevel = (object) => {
  const { code, level } = object
  object.level = Number(level || (code && getAmplifier(code)))
}

const pointTree = (item) => Array.isArray(item)
  ? List(item.map(pointTree))
  : WebMapPoint(item)

// У випадку, якщо змінюється геометрія об'єкту, оновлюємо значення хеш-ключа
export const updateGeometry = (obj, geometry) => {
  const oldValue = obj.get('geometry')
  const newValue = pointTree(geometry || [])
  return eq(newValue, oldValue)
    ? obj
    : obj
      .set('geometry', newValue)
      .set('hash', makeHash(obj.get('type'), geometry))
}

const updateObject = (map, { id, geometry, point, attributes, ...rest }) =>
  update(map, id, (object) => {
    checkLevel(rest)
    let obj = object || WebMapObject({ id, ...rest })
    obj = update(obj, 'point', comparator, WebMapPoint(point))
    if (attributes) {
      const { texts, ...otherAttrs } = attributes
      obj = update(obj, 'attributes', comparator, WebMapAttributes({ texts: List(texts), ...otherAttrs }))
    } else {
      obj = update(obj, 'attributes', comparator, WebMapAttributes(attributes))
    }
    obj = updateGeometry(obj, geometry)
    return merge(obj, rest)
  })

const lockObject = (map, { objectId, contactName }) => map.get(objectId) !== contactName
  ? map.set(objectId, contactName)
  : map

const unlockObject = (map, { objectId }) => map.get(objectId)
  ? map.delete(objectId)
  : map

const notFlexGrid = (object) => object.type !== entityKind.FLEXGRID

const simpleSetFields = [ {
  action: actionNames.SET_COORDINATES_TYPE,
  field: 'coordinatesType',
}, {
  action: actionNames.SET_MINIMAP,
  field: 'showMiniMap',
}, {
  action: actionNames.SET_AMPLIFIERS,
  field: 'showAmplifiers',
}, /* {
  action: actionNames.SET_GENERALIZATION,
  field: 'generalization',
}, */{
  action: actionNames.SET_SOURCE,
  field: 'source',
}, {
  action: actionNames.SET_SCALE_TO_SELECTION,
  field: 'scaleToSelection',
}, {
  action: actionNames.SET_MARKER,
  field: 'marker',
}, {
  action: actionNames.SUBORDINATION_LEVEL,
  field: 'subordinationLevel',
}, {
  action: actionNames.SUBORDINATION_AUTO,
  field: 'subordinationAuto',
} ]

const toggleSetFields = [ {
  action: actionNames.TOGGLE_MEASURE,
  field: 'isMeasureOn',
}, {
  action: actionNames.TOGGLE_MARKERS,
  field: 'isMarkersOn',
} ]

const findField = (actionName, list) => {
  const item = list.find(({ action }) => action === actionName)
  return item && item.field
}

const simpleSetField = (actionName) => findField(actionName, simpleSetFields)

const simpleToggleField = (actionName) => findField(actionName, toggleSetFields)

export default function webMapReducer (state = WebMapState(), action) {
  const { type, payload } = action
  switch (type) {
    case actionNames.OBJECT_LIST: {
      if (!payload) {
        return state
      }
      const { layerId, objects } = payload
      return update(state, 'objects', (map) => {
        map = objects.filter(notFlexGrid).reduce(updateObject, map)
        map = filter(map, ({ id, layer }) => (layer !== layerId) || objects.find((object) => object.id === id))
        return map
      })
    }
    case actionNames.RETURN_UNIT_INDICATORS: {
      const { indicatorsData, unitId } = payload
      const objects = state.get('objects')
      const objectsArray = [ ...objects.values() ]
      const currentObject = objectsArray.find(({ unit }) => {
        return unit === unitId
      })
      const newObjects = objects.setIn([ currentObject.id, 'indicatorsData' ], indicatorsData)
      return state
        .set('objects', newObjects)
    }
    case actionNames.SET_SOURCES: {
      return state
        .set('sources', payload.sources)
        .set('source', payload.source)
    }
    case actionNames.ADD_OBJECT:
    case actionNames.UPD_OBJECT:
      return update(state, 'objects', (map) => updateObject(map, payload))
    case actionNames.DEL_OBJECT:
      return payload
        ? state.deleteIn([ 'objects', payload ])
        : state
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
        LS.set('view', 'center', center)
      }
      if (zoom) {
        result = result.set('zoom', zoom)
        LS.set('view', 'zoom', zoom)
      }
      return result
    }
    case actionNames.APP_INFO: {
      const { version, contactId, positionContactId, unitId } = payload
      console.info(`Backend version: ${version}`)
      console.info(`My IDs: ${JSON.stringify({ contactId, positionContactId, unitId })}`)
      return merge(state, {
        version,
        contactId: Number(contactId),
        positionContactId: Number(positionContactId),
        unitId: Number(unitId),
      })
    }
    case actionNames.GET_LOCKED_OBJECTS: {
      const myContactId = state.get('contactId')
      return update(state, 'lockedObjects', (map) => Object.entries(payload)
        .filter(({ contactId }) => String(contactId) !== String(myContactId))
        .map(([ objectId, { contactName } ]) => ({ objectId, contactName }))
        .reduce(lockObject, map))
    }
    case actionNames.OBJECT_LOCKED: {
      // console.log(`OBJECT_LOCKED`, payload)
      return update(state, 'lockedObjects', (map) => lockObject(map, payload))
    }
    case actionNames.OBJECT_UNLOCKED: {
      // console.log(`OBJECT_UNLOCKED`, payload)
      return update(state, 'lockedObjects', (map) => unlockObject(map, payload))
    }
    case actionNames.GET_TOPOGRAPHIC_OBJECTS: {
      const data = {
        ...payload,
        visible: true,
        selectedItem: 0,
      }
      return state.set('topographicObjects', data)
    }
    case actionNames.SELECT_TOPOGRAPHIC_ITEM: {
      return update(state, 'topographicObjects', { ...state.topographicObjects, selectedItem: payload })
    }
    case actionNames.TOGGLE_TOPOGRAPHIC_OBJECTS: {
      // return update(state, 'isTopographicObjectsOn', !state.isTopographicObjectsOn)
      return state
        .set('isTopographicObjectsOn', !state.isTopographicObjectsOn)
        .set('topographicObjects', {})
    }
    case actionNames.TOGGLE_TOPOGRAPHIC_OBJECTS_MODAL: {
      const visible = !state.topographicObjects.visible
      return update(state, 'topographicObjects', { ...state.topographicObjects, visible: visible })
    }
    default: {
      const f1 = simpleSetField(type)
      if (f1) {
        return state.set(f1, payload)
      }
      const f2 = simpleToggleField(type)
      if (f2) {
        return toggleSetFields
          .map(({ field }) => field)
          .filter((field) => field !== f2)
          .reduce((current, field) => current.set(field, false), state)
          .set(f2, !state.get(f2))
      }
      return state
    }
  }
}

export const propTypes = PropTypes.shape({
  objects: PropTypes.object.isRequired,
  source: PropTypes.object.isRequired,
})
