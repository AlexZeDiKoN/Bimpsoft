import PropTypes from 'prop-types'
import * as R from 'ramda'
import { Record, List, Map, Set } from 'immutable'
import { utils } from '@C4/CommonComponents'
import { model } from '@C4/MilSymbolEditor'
import { update, comparator, filter, merge, eq, mergePure } from '../../utils/immutable'
import { actionNames, changeTypes } from '../actions/webMap'
import { MapSources, colors, MapModes, paramsNames } from '../../constants'
import SubordinationLevel from '../../constants/SubordinationLevel'
import { IDENTITIES } from '../../utils/affiliations'
import { UNDEFINED_CLASSIFIER } from '../../components/SelectionForm/parts/WithLineClassifier'
import { STATUSES } from '../../components/SelectionForm/parts/WithStatus'
import entityKind from '../../components/WebMap/entityKind'
import { makeHash } from '../../utils/mapObjConvertor'
import { LS } from '../../utils'
import { version as front } from '../../../package.json'
import { evaluateColor } from '../../constants/colors'
import { settings } from '../../constants/drawLines'
import { directionAmps } from '../../constants/symbols'

const { APP6Code: { getAmplifier }, symbolOptions } = model

const { Coordinates: Coord } = utils
const { LINE_WIDTH } = settings

const WebMapPoint = Record({
  lat: null,
  lng: null,
})

const LineAmplifier = Record({
  top: null,
  middle: null,
  bottom: null,
  center: null,
  additional: null,
})

const webMapAttributesInitValues = {
  name: null,
  template: '',
  color: evaluateColor(colors.BLACK),
  fill: colors.TRANSPARENT,
  lineType: 'solid',
  strokeWidth: LINE_WIDTH,
  hatch: 'none',
  intermediateAmplifierType: 'none',
  intermediateAmplifier: LineAmplifier(),
  directionIntermediateAmplifier: directionAmps.ACROSS_LINE,
  shownIntermediateAmplifiers: Set(),
  shownNodalPointAmplifiers: Set(),
  pointAmplifier: LineAmplifier(),
  textAmplifiers: {},
  sectorsInfo: List(),
  params: {},
  left: 'none',
  right: 'none',
  nodalPointIcon: 'none',
  texts: List(),
  z: null,
  taskId: null,
  lineClassifier: UNDEFINED_CLASSIFIER,
  status: STATUSES.EXISTING,
  uniqueDesignation1: '',
  catalogAttributes: {},
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
  affiliation: IDENTITIES.FRIEND,
  layer: null,
  parent: null,
  attributes: WebMapAttributes(),
  hash: null,
  indicatorsData: undefined,
})

const center = LS.get('view', 'center') || { lat: 48, lng: 35 }
const zoom = Number(LS.get('view', 'zoom')) || 7
const shownAmplifiers = Object.fromEntries(paramsNames.AMPLIFIERS_GROUPS.flat(2).map((id) => [ id, true ]))

const WebMapState = Record({
  mode: MapModes.NONE,
  center,
  zoom,
  bounds: null,
  coordinatesType: Coord.types.WGS_84,
  showMiniMap: true,
  showAmplifiers: true,
  shownAmplifiers,
  generalization: false,
  isMeasureOn: false,
  isMarkersOn: false,
  isZoneProfileOn: false,
  isZoneVisionOn: false,
  isTopographicObjectsOn: false,
  sources: MapSources,
  source: MapSources[0],
  subordinationAuto: true,
  subordinationLevel: SubordinationLevel.TEAM_CREW,
  objects: Map(),
  lockedObjects: Map(),
  version: null,
  contactId: null,
  contactFullName: '',
  positionContactId: null,
  unitId: null,
  countryId: null,
  formationId: null,
  defOrgStructure: null,
  scaleToSelection: false,
  marker: null,
  catalogModalData: { visible: false },
  topographicObjects: {},
  undoRecords: List(),
  undoPosition: 0,
  reportMap: {},
  geoLandmark: {},
  deleteMarchPointModal: {},
  highlighted: null,
  objectsInfo: {},
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

export const createObjectRecord = (attributes) => {
  const {
    texts,
    pointAmplifier,
    intermediateAmplifier,
    shownIntermediateAmplifiers,
    shownNodalPointAmplifiers,
    sectorsInfo,
    ...otherAttrs
  } = attributes
  return WebMapAttributes({
    texts: List(texts),
    intermediateAmplifier: LineAmplifier(intermediateAmplifier),
    shownIntermediateAmplifiers: Set(shownIntermediateAmplifiers),
    shownNodalPointAmplifiers: Set(shownNodalPointAmplifiers),
    pointAmplifier: LineAmplifier(pointAmplifier),
    sectorsInfo: List(sectorsInfo),
    ...otherAttrs,
  })
}

const updateObject = (map, { id, geometry, point, attributes, ...rest }) =>
  update(map, id, (object) => {
    checkLevel(rest)
    let obj = object || WebMapObject({ id, ...rest })
    obj = update(obj, 'point', comparator, WebMapPoint(point))
    if (attributes) {
      obj = update(obj, 'attributes', comparator, createObjectRecord(attributes))
    } else {
      obj = update(obj, 'attributes', comparator, WebMapAttributes(attributes))
    }
    obj = updateGeometry(obj, geometry)
    return mergePure(obj, rest)
  })

const updateObjectInfo = (mapState, fullObjects, isDelete) => {
  const newState = { ...mapState }
  Array.isArray(fullObjects) && fullObjects.forEach((item) => {
    if (isDelete) {
      delete newState[item]
    } else {
      newState[item?.id] = {
        inserted: item?.inserted,
        insertedById: item?.inserted_by_id,
        updated: item?.updated,
        updatedById: item?.updated_by_id,
      }
    }
  })
  return newState
}

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
}, {
  action: actionNames.SET_AMPLIFIERS_FILTER,
  field: 'shownAmplifiers',
}, {
  action: actionNames.SET_GENERALIZATION,
  field: 'generalization',
}, {
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
}, {
  action: actionNames.SET_CATALOG_MODAL_DATA,
  field: 'catalogModalData',
} ]

const toggleSetFields = [ {
  action: actionNames.TOGGLE_MEASURE,
  field: 'isMeasureOn',
}, {
  action: actionNames.TOGGLE_MARKERS,
  field: 'isMarkersOn',
}, {
  action: actionNames.TOGGLE_TOPOGRAPHIC_OBJECTS,
  field: 'isTopographicObjectsOn',
}, {
  action: actionNames.TOGGLE_ZONE_PROFILE,
  field: 'isZoneProfileOn',
}, {
  action: actionNames.TOGGLE_ZONE_VISION,
  field: 'isZoneVisionOn',
} ]

const findField = (actionName, list) => {
  const item = list.find(({ action }) => action === actionName)
  return item && item.field
}

const simpleSetField = (actionName) => findField(actionName, simpleSetFields)

const simpleToggleField = (actionName) => findField(actionName, toggleSetFields)

function addUndoRecord (state, payload) {
  let objData, oldData, newData

  const { changeType, id, flexGridPrevState } = payload
  const newRecord = { changeType, ...R.pick([ 'id', 'list', 'layer' ], payload), timestamp: Date.now() }
  if (id) {
    objData = state.getIn([ 'objects', id ])
  }

  switch (changeType) {
    case changeTypes.UPDATE_OBJECT: {
      const { id, ...rest } = objData.toJS()
      oldData = rest
      newData = payload.object
      break
    }
    case changeTypes.UPDATE_GEOMETRY: {
      if (flexGridPrevState) {
        oldData = {
          geometry: flexGridPrevState,
        }
      } else {
        oldData = {
          point: objData.get('point').toJS(),
          geometry: objData.get('geometry').toJS(),
        }
      }
      newData = payload.geometry
      break
    }
    case changeTypes.LAYER_COLOR: {
      oldData = payload.oldColor
      newData = payload.newColor
      break
    }
    case changeTypes.MOVE_CONTOUR:
    case changeTypes.MOVE_LIST: {
      const { x, y } = payload.shift
      oldData = { x: -x, y: -y }
      newData = { x, y }
      break
    }
    case changeTypes.INSERT_OBJECT:
    case changeTypes.DELETE_OBJECT:
    case changeTypes.DELETE_LIST:
    case changeTypes.COPY_LIST:
    case changeTypes.CREATE_CONTOUR:
    case changeTypes.DELETE_CONTOUR:
    case changeTypes.COPY_CONTOUR:
    case changeTypes.CREATE_GROUP:
    case changeTypes.DROP_GROUP:
      break
    default:
      return state
  }
  if (oldData && newData) {
    if (JSON.stringify(oldData) === JSON.stringify(newData)) {
      return state
    }
    newRecord.oldData = oldData
    newRecord.newData = newData
  }
  let records = state.get('undoRecords')
  const undoPosition = state.get('undoPosition')
  if (undoPosition < records.size) {
    records = records.skipLast(records.size - undoPosition)
  }
  return state
    .set('undoRecords', records.push(newRecord))
    .set('undoPosition', undoPosition + 1)
}

export default function webMapReducer (state = WebMapState(), action) {
  const { type, payload } = action
  switch (type) {
    case actionNames.OBJECT_LIST: {
      if (!payload) {
        return state
      }
      const { layerId, objects } = payload
      const newState = update(state, 'objects', (map) => {
        map = objects
          .filter(({ code, type }) => (type !== entityKind.POINT && type !== entityKind.SOPHISTICATED) || code)
          .filter(notFlexGrid)
          .reduce(updateObject, map)
        map = filter(map, ({ id, layer }) => (layer !== layerId) || objects.find((object) => object.id === id))
        return map
      })
      return update(newState, 'objectsInfo', (map) => updateObjectInfo(map, objects))
    }
    case actionNames.RETURN_UNIT_INDICATORS: {
      const { indicatorsData, unitId } = payload
      const objects = state.get('objects')
      const objectsWithUnit = objects.filter(({ unit }) => unit === unitId)
      const newArrOfObjectWithUnit = []
      objectsWithUnit.forEach((value) => {
        newArrOfObjectWithUnit.push(value)
      })
      const newRecordOfObjects = newArrOfObjectWithUnit.reduce((acc, curr) => {
        const newObjects = curr.set('indicatorsData', indicatorsData)
        return update(acc, curr.id, newObjects)
      }, objects)
      return merge(state, {
        objects: newRecordOfObjects,
      })
    }
    case actionNames.SET_SOURCES: {
      return state
        .set('sources', payload.sources)
        .set('source', payload.source)
    }
    case actionNames.SET_MAP_MODE: {
      return state.mode === payload ? state : state.set('mode', payload)
    }
    case actionNames.ADD_UNDO_RECORD:
      return addUndoRecord(state, payload)
    case actionNames.UNDO:
      return update(state, 'undoPosition',
        (position) => Math.max(position - 1, 0))
    case actionNames.REDO:
      return update(state, 'undoPosition',
        (position) => Math.min(position + 1, state.get('undoRecords').size))
    case actionNames.OBJECT_LIST_REFRESH: {
      if (!payload) {
        return state
      }
      const { toUpdate, toDelete } = payload
      if (toUpdate && toUpdate.length) {
        state = update(state, 'objects', (map) => toUpdate.reduce(updateObject, map))
        state = update(state, 'objectsInfo', (map) => updateObjectInfo(map, toUpdate))
      }
      if (toDelete && toDelete.length) {
        state = update(state, 'objects', (map) => map.filter((value, key) => !toDelete.includes(key)))
        state = update(state, 'objectsInfo', (map) => updateObjectInfo(map, toDelete, true))
      }
      return state
    }
    case actionNames.ADD_OBJECT:
    case actionNames.UPD_OBJECT:
      // блокируем обработку FlexGrid (ОЗ)? иначе добавиться в WebMap.objects
      return (payload.type === entityKind.FLEXGRID)
        ? state
        : update(
          update(state, 'objects', (map) => updateObject(map, payload)),
          'objectsInfo',
          (map) => updateObjectInfo(map, [ payload ]),
        )
    case actionNames.DEL_OBJECT:
      return payload
        ? state.deleteIn([ 'objects', payload ])
        : state
    case actionNames.DEL_OBJECTS:
      return payload
        ? update(state, 'objects', (map) => map.filter((value, key) => !payload.includes(key)))
        : state
    case actionNames.ALLOCATE_OBJECTS_BY_LAYER_ID: {
      const delLayerId = payload
      return update(state, 'objects', (map) => map.filter(({ layer }) => layer !== delLayerId))
    }
    case actionNames.REFRESH_OBJECT: {
      const { id, object } = payload
      return object.id
        ? update(state, 'objects', (map) => updateObject(map, object)) // Об'єкт додано або змінено
        : state.deleteIn([ 'objects', id ]) // Об'єкт видалено
    }
    case actionNames.SET_MAP_CENTER: {
      const { center, zoom, bounds } = payload
      if (center) {
        state = update(state, 'center', center)
        LS.set('view', 'center', center)
      }
      if (zoom) {
        state = update(state, 'zoom', zoom)
        LS.set('view', 'zoom', zoom)
      }
      if (bounds) {
        state = update(state, 'bounds', bounds)
      }
      return state
    }
    case actionNames.APP_INFO: {
      const {
        version, contactId, positionContactId, unitId, countryId, formationId, defOrgStructure, contactFullName,
      } = payload
      console.info(`Backend version`, version)
      console.info(`Frontend version`, front)
      console.info(`My IDs`, {
        contactId, positionContactId, unitId, countryId, formationId, contactFullName,
      })
      return merge(state, {
        version,
        defOrgStructure,
        contactId: Number(contactId),
        positionContactId: Number(positionContactId),
        unitId: Number(unitId),
        countryId: Number(countryId),
        formationId: Number(formationId),
        contactFullName,
      })
    }
    case actionNames.GET_LOCKED_OBJECTS: {
      const myContactId = state.get('contactId')
      return update(state, 'lockedObjects', (map) => Object.entries(payload)
        .filter(([ _, { contactId } ]) => String(contactId) !== String(myContactId))
        .map(([ objectId, { contactName } ]) => ({ objectId, contactName }))
        .reduce(lockObject, map))
    }
    case actionNames.OBJECT_LOCKED: {
      return update(state, 'lockedObjects', (map) => lockObject(map, payload))
    }
    case actionNames.OBJECT_UNLOCKED: {
      return update(state, 'lockedObjects', (map) => unlockObject(map, payload))
    }
    case actionNames.GET_TOPOGRAPHIC_OBJECTS: {
      const data = {
        ...payload,
        visible: true,
        selectedItem: 0,
      }
      return update(state, 'topographicObjects', data)
    }
    case actionNames.SELECT_TOPOGRAPHIC_ITEM: {
      return update(state, 'topographicObjects', { ...state.topographicObjects, selectedItem: payload })
    }
    case actionNames.TOGGLE_TOPOGRAPHIC_OBJECTS_MODAL: {
      const visible = !state.topographicObjects.visible
      return update(state, 'topographicObjects', { ...state.topographicObjects, visible: visible })
    }
    case actionNames.TOGGLE_REPORT_MAP_MODAL: {
      const { visible, dataMap } = payload
      if (visible === false && dataMap && dataMap.mapId !== state?.reportMap?.dataMap?.mapId) {
        return state
      }
      return update(state, 'reportMap', { ...state.reportMap, ...payload })
    }
    case actionNames.TOGGLE_GEO_LANDMARK_MODAL: {
      return update(state, 'geoLandmark', { ...state.geoLandmark, ...payload })
    }
    case actionNames.TOGGLE_DELETE_MARCH_POINT_MODAL: {
      return update(state, 'deleteMarchPointModal', { ...state.deleteMarchPointModal, ...payload })
    }
    case actionNames.HIGHLIGHT_OBJECT: {
      return payload || state.get('highlighted')
        ? state.set('highlighted', payload)
        : state
    }
    default: {
      const setField = simpleSetField(type)
      if (setField) {
        return state.set(setField, payload)
      }
      const toggleField = simpleToggleField(type)
      if (toggleField) {
        return toggleSetFields
          .map(({ field }) => field)
          .filter((field) => field !== toggleField)
          .reduce((current, field) => current.set(field, false), state)
          .set(toggleField, !state.get(toggleField))
          .set('topographicObjects', {})
      }
      return state
    }
  }
}

export const propTypes = PropTypes.shape({
  objects: PropTypes.object.isRequired,
  source: PropTypes.object.isRequired,
})
