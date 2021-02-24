import { List } from 'immutable'
import { model } from '@C4/MilSymbolEditor'
import api from '../../server/api.march'
import { action } from '../../utils/services'
import { MarchKeys } from '../../constants'
import { AFFILIATION_COLOR } from '../../constants/colors'
import utilsMarch from '../../../src/components/common/March/utilsMarch'
import entityKind from '../../../src/components/WebMap/entityKind'
import { MARCH_POINT_TYPES, MARCH_TYPES } from '../../constants/March'
import webmapApi from '../../server/api.webmap'
import osrmApi from '../../server/api.osrm'
import { getUnitObj } from '../../store/actions/selection'
import i18n from './../../i18n'
import { openMapFolder, deleteMap } from './maps'
import * as notifications from './notifications'
import { asyncAction } from './index'

export const GET_TYPE_KINDS = action('GET_TYPE_KINDS')
export const SET_MARCH_PARAMS = action('SET_MARCH_PARAMS')
export const SET_INTEGRITY = action('SET_INTEGRITY')
export const EDIT_FORM_FIELD = action('EDIT_FORM_FIELD')
export const ADD_SEGMENT = action('ADD_SEGMENT')
export const DELETE_SEGMENT = action('DELETE_SEGMENT')
export const ADD_CHILD = action('ADD_CHILD')
export const DELETE_CHILD = action('DELETE_CHILD')
export const SET_COORD_MODE = action('SET_COORD_MODE')
export const SET_COORD_FROM_MAP = action('SET_COORD_FROM_MAP')
export const SET_REF_POINT_ON_MAP = action('SET_REF_POINT_ON_MAP')
export const INIT_MARCH = action('INIT_MARCH')
export const CLOSE_MARCH = action('CLOSE_MARCH')
export const SET_GEO_LANDMARKS = action('SET_GEO_LANDMARKS')
export const SET_VISIBLE_INTERMEDIATE = action('SET_VISIBLE_INTERMEDIATE')
export const ADD_GEO_LANDMARK = action('ADD_GEO_LANDMARK')
export const SET_METRIC = action('SET_METRIC')
export const SET_ROUTE = action('SET_ROUTE')
export const SET_ACTIVE_POINT = action('SET_ACTIVE_POINT')
export const SET_MAP_OBJECTS_IDS = action('SET_MAP_OBJECTS_IDS')

const { getMarchMetric } = api
const {
  convertSegmentsForExplorer,
  getFilteredGeoLandmarks,
  azimuthToCardinalDirection,
  getDataRoute,
  getTwoPointsRoute,
  isValidIncomingPoints,
} = utilsMarch.convertUnits
const { getDefaultMetric, defaultChild, defaultSegment } = utilsMarch.reducersHelpers
const { OWN_RESOURCES } = MARCH_TYPES

const isFilledMarchCoordinates = (segments) => {
  const isFilledCoordinate = (coordinates) => {
    if (coordinates !== undefined) {
      const { lat, lng } = coordinates
      if (lat !== undefined && lng !== undefined) {
        return true
      }
    }
    return false
  }

  for (const segment of segments) {
    const { coordinates, children } = segment

    if (!isFilledCoordinate(coordinates)) {
      return false
    }

    if (children !== undefined && children.length > 0) {
      for (const child of children) {
        if (!isFilledCoordinate(child.coordinates)) {
          return false
        }
      }
    }
  }

  return true
}

const initDefaultSegments = () => ([
  {
    ...defaultSegment(),
    name: i18n.POINT_OF_DEPARTURE,
    refPoint: i18n.BASE,
    required: true,
    editableName: false,
    children: [
      {
        ...defaultChild(),
        type: 5,
        required: true,
      },
    ],
  },
  {
    ...defaultSegment(),
    type: 0,
    name: i18n.DESTINATION,
    required: true,
    editableName: false,
    metric: getDefaultMetric(true),
    children: [],
  },
])

const clearPreviousRoute = (previousLineSegment, updateSegments) => {
  if (previousLineSegment) {
    const { segmentId: prevSegmentId, childId: prevChildId } = previousLineSegment
    if (prevChildId !== null) {
      updateSegments = updateSegments.update(prevSegmentId, (segment) => ({
        ...segment,
        children: segment.children.map((it, id) => (id === prevChildId) ? {
          ...it,
          route: null,
        } : it),
      }))
    } else {
      updateSegments = updateSegments.update(previousLineSegment.segmentId, (segment) => {
        return {
          ...segment,
          route: null,
        }
      })
    }
  }

  return updateSegments
}

export const updateMetric = (payload, initSegments) => asyncAction.withNotification(
  async (dispatch, getState) => {
    let { march: { segments } } = getState()
    segments = initSegments || segments

    const res = await getMarchMetric({
      ...payload,
      segments: segments.toArray(),
    })
    const { march } = getState()
    segments = march.segments

    const marchDetails = res.payload
    const { segments: segmentsDetails } = marchDetails
    const distance = marchDetails.distance || 0
    const time = marchDetails.time || 0

    const segmentsWithUpdateMetrics = segments.map((segment, id) => {
      const {
        children,
        reference = { time: 0, distance: 0 },
        untilPrevious = { time: 0, distance: 0 },
      } = segmentsDetails[id]
      reference.time = reference.time || 0
      reference.distance = reference.distance || 0
      let { distance, time } = segmentsDetails[id]
      distance = distance || 0
      time = time || 0

      segment = { ...segment }
      segment.metric = { children, distance, time, reference, untilPrevious }
      segment.children = segment.children && segment.children.map((child, childId) => {
        const segmentsDetailsChildren = segmentsDetails[id]?.children || []
        let { distance, time } = segmentsDetailsChildren[childId] || {}
        distance = distance || 0
        time = time || 0
        return { ...child, metric: { distance, time } }
      })

      return segment
    })

    const data = {
      segments: segmentsWithUpdateMetrics,
      time,
      distance,
    }

    dispatch({
      type: SET_METRIC,
      payload: data,
    })
  })

const getFormattedGeoLandmarks = (geoLandmarks = {}) => {
  const { features = [] } = geoLandmarks

  const filteredGeoLandmarks = getFilteredGeoLandmarks(features)

  return filteredGeoLandmarks.map((itemGeoLandmark) => {
    const { name, distance, azimuth } = itemGeoLandmark.properties
    const distanceInKm = Number((distance / 1000).toFixed(0))
    const cardinalDirection = azimuthToCardinalDirection(azimuth)

    itemGeoLandmark.propertiesText = distanceInKm
      ? `${distanceInKm} ${i18n.KILOMETER_TO} ${cardinalDirection} ${i18n.FROM_CITY} ${name}`
      : itemGeoLandmark.propertiesText = `${i18n.CITY} ${name}`

    return itemGeoLandmark
  })
}

export const getGeoLandmarks = async (coordinates, geoLandmarks, selectFirstItem = true) => {
  const { lat, lng } = coordinates
  const geoKey = `${lat}:${lng}`

  let geoLandmark = geoLandmarks[geoKey]

  const fixedCoord = {}
  fixedCoord.lat = lat || 0.00001
  fixedCoord.lng = lng || 0.00001
  const geoLandmarkSize = geoLandmark?.length
  let firstGeoLandmark

  if (!geoLandmarkSize) {
    geoLandmark = await webmapApi.nearestSettlement(fixedCoord)
    const formattedGeoLandmark = getFormattedGeoLandmarks(geoLandmark)
    if (formattedGeoLandmark && formattedGeoLandmark.length > 0) {
      firstGeoLandmark = formattedGeoLandmark[0]
    }
    geoLandmarks[geoKey] = formattedGeoLandmark
  } else if (geoLandmarkSize === 1 && geoLandmark[0].isReceived) {
    const fromServerGeoLandmark = await webmapApi.nearestSettlement(fixedCoord)
    const formattedGeoLandmark = getFormattedGeoLandmarks(fromServerGeoLandmark)
    const filteredGeoLandmark = formattedGeoLandmark.filter(
      (item) => {
        return item.propertiesText !== geoLandmark[0].propertiesText
      },
    )
    if (filteredGeoLandmark && filteredGeoLandmark.length > 0) {
      firstGeoLandmark = filteredGeoLandmark[0]
    } else {
      firstGeoLandmark = geoLandmark[0]
    }
    geoLandmarks[geoKey] = [ geoLandmark[0], ...filteredGeoLandmark ]
  } else {
    firstGeoLandmark = geoLandmark[0]
  }

  firstGeoLandmark = selectFirstItem ? firstGeoLandmark : null

  return { firstGeoLandmark, geoLandmarks }
}

const getUpdateSegments = (segments, data, geoLandmarks, dispatch) => {
  const { segmentId, childId } = data
  let { val, fieldName } = data

  if (!Array.isArray(fieldName)) {
    fieldName = [ fieldName ]
    val = [ val ]
  }

  if (fieldName.length !== val.length) {
    return segments
  }

  let updateSegments = segments

  const clearCoordinate = () => ({ lng: undefined, lat: undefined })

  for (let i = 0; i < fieldName.length; i++) {
    const isSegmentTypeField = fieldName[i] === 'type'
    let previousLineSegment = null
    const isCoordinatesField = fieldName[i] === 'coordinates'

    if (childId || childId === 0) {
      if (childId) {
        previousLineSegment = { segmentId, childId: childId - 1 }
      } else {
        previousLineSegment = { segmentId, childId: null }
      }
      updateSegments = updateSegments.update(segmentId, (segment) => ({
        ...segment,
        route: (childId === 0 && isCoordinatesField) ? null : segment.route,
        children: segment.children.map((it, id) => (id === childId) ? {
          ...it,
          [fieldName[i]]: val[i],
          refPoint: fieldName[i] === 'refPoint' ? val[i] : it.refPoint,
          route: isCoordinatesField ? null : it.route,
        } : (previousLineSegment.childId === id && isCoordinatesField) ? { ...it, route: null } : it),
      }))
    } else {
      let children = segments.get(segmentId).children
      if (segmentId) {
        const previousSegmentId = segmentId - 1
        let lastChildId = null
        const childrenSize = segments.get(previousSegmentId).children.length
        lastChildId = childrenSize ? childrenSize - 1 : null
        previousLineSegment = { segmentId: previousSegmentId, childId: lastChildId }
      } else {
        previousLineSegment = { segmentId: segmentId, childId: null }
      }
      updateSegments = clearPreviousRoute(previousLineSegment, updateSegments)

      if (isSegmentTypeField) {
        if (val[i] === OWN_RESOURCES) {
          children = children.map((child) => ({ ...child, coordinates: clearCoordinate(), refPoint: '' }))
          children.unshift({
            ...defaultChild(),
            type: 5,
            required: true,
          })
        } else {
          children = children.map((child) => ({
            ...child,
            type: 0,
            required: false,
            coordinates: clearCoordinate(),
            refPoint: '',
          }))
        }
      }

      updateSegments = updateSegments.update(segmentId, (segment) => {
        if (isSegmentTypeField) {
          segment.coordinates = clearCoordinate()
          segment.refPoint = ''
        }

        const newRefPoint = fieldName[i] === 'refPoint' ? val[i] : segment.refPoint

        return {
          ...segment,
          [fieldName[i]]: val[i],
          children,
          refPoint: newRefPoint,
        }
      })
    }

    if (isCoordinatesField) {
      const coordinates = val[i]
      dispatch(setGeoLandmarks({
        coordinates: { ...coordinates },
        segmentId,
        childId,
        selectFirstItem: true,
      }))

      if (previousLineSegment) {
        const { segmentId: prevSegmentId, childId: prevChildId } = previousLineSegment
        const previousSegmentNode = segments.get(prevSegmentId)
        const previousChildNode = prevChildId !== null ? previousSegmentNode.children[prevChildId] : null
        const previousNode = previousChildNode || previousSegmentNode

        if (previousNode && previousNode.route) {
          dispatch(getRoute({
            segmentId: prevSegmentId,
            childId: prevChildId,
            dataSegments: updateSegments,
          }))
          dispatch(getRoute({
            segmentId,
            childId,
            dataSegments: updateSegments,
          }))
        }
      }
    }
  }

  return {
    updateSegments,
  }
}

export const getIndicator = () =>
  async (dispatch, getState, { marchApi: { getTypeKinds } }) => {
    const indicators = await getTypeKinds(Object.values(MarchKeys.MARCH_INDICATORS_GROUP))
    dispatch({
      type: GET_TYPE_KINDS,
      payload: indicators,
    })
  }

export const setMarchParams = (data) => ({
  type: SET_MARCH_PARAMS,
  payload: data,
})

export const setIntegrity = (data) => ({
  type: SET_INTEGRITY,
  payload: data,
})

export const editFormField = (data) => asyncAction.withNotification(
  async (dispatch, getState) => {
    const { march } = getState()
    const { segments, geoLandmarks } = march

    const { updateSegments } = getUpdateSegments(segments, data, geoLandmarks, dispatch)

    const isCoordFilled = isFilledMarchCoordinates(updateSegments.toArray())
    dispatch(updateMetric(march.payload, updateSegments))

    const payload = {
      segments: updateSegments,
      coordMode: false,
      isCoordFilled,
    }

    dispatch({
      type: EDIT_FORM_FIELD,
      payload,
    })
  })

export const addSegment = (segmentId, type) => asyncAction.withNotification(
  async (dispatch, getState) => {
    const { march } = getState()
    let updateSegments = march.segments.insert(segmentId + 1, defaultSegment(type))

    const previousChildren = updateSegments.get(segmentId).children
    const lastPreviousChildId = previousChildren.length - 1

    if (lastPreviousChildId !== -1) {
      if (previousChildren[lastPreviousChildId].route) {
        updateSegments = updateSegments.update(segmentId, (segment) => ({
          ...segment,
          children: segment.children.map((it, id) => (id === lastPreviousChildId) ? {
            ...it,
            route: null,
          } : it),
        }))
      }
    } else {
      updateSegments = updateSegments.update(segmentId, (segment) => ({ ...segment, route: null }))
    }

    const isCoordFilled = isFilledMarchCoordinates(updateSegments.toArray())

    dispatch(updateMetric(march.payload, updateSegments))

    const payload = { segments: updateSegments, isCoordFilled }

    dispatch({
      type: ADD_SEGMENT,
      payload,
    })
  })

export const deleteSegment = (segmentId) => asyncAction.withNotification(
  async (dispatch, getState) => {
    const { march } = getState()

    let updateSegments = march.segments.delete(segmentId)
    if (segmentId) {
      const childrenSize = updateSegments.get(segmentId - 1).children.length
      if (childrenSize) {
        updateSegments = updateSegments.update(segmentId - 1, (segment) => ({
          ...segment,
          children: segment.children.map((it, id) => (id === childrenSize - 1) ? {
            ...it,
            route: null,
          } : it),
        }))
      } else {
        updateSegments = updateSegments.update(segmentId, (segment) => ({ ...segment, route: null }))
      }
    }

    const isCoordFilled = isFilledMarchCoordinates(updateSegments.toArray())

    dispatch(updateMetric(march.payload, updateSegments))

    const payload = { segments: updateSegments, isCoordFilled }

    dispatch({
      type: DELETE_SEGMENT,
      payload,
    })
  })

export const addChild = (segmentId, childId, intermediate = false, coords) => asyncAction.withNotification(
  async (dispatch, getState) => {
    const { march } = getState()

    const segment = march.segments.get(segmentId)
    const children = segment.children
    segment.metric.children.splice((childId || childId === 0) ? childId + 1 : 0, 0, { distance: 0, time: 0 })

    const child = defaultChild()
    if (intermediate && coords) { // вставка промежуточного пункта с карты
      child.coordinates = coords
      child.type = MARCH_POINT_TYPES.INTERMEDIATE_POINT
    }

    children.splice((childId || childId === 0) ? childId + 1 : 0, 0, child)

    const updateSegments = march.segments.update(segmentId, (segment) => ({
      ...segment,
      children,
    }))

    const isCoordFilled = isFilledMarchCoordinates(updateSegments.toArray())

    dispatch(updateMetric(march.payload, updateSegments))

    const payload = { segments: updateSegments, isCoordFilled }

    dispatch({
      type: ADD_CHILD,
      payload,
    })
  })

export const deleteChild = (segmentId, childId) => asyncAction.withNotification(
  async (dispatch, getState) => {
    const { march } = getState()
    const segment = march.segments.get(segmentId)

    let children = segment.children
    children.splice(childId, 1)
    segment.metric.children.splice(childId, 1)
    if (childId) {
      children = children.map((it, id) => {
        return (id === childId - 1) ? { ...it, route: null } : it
      })
    }

    const updateSegments = march.segments.update(segmentId, (segment) => ({
      ...segment,
      children,
    }))

    const isCoordFilled = isFilledMarchCoordinates(updateSegments.toArray())

    dispatch(updateMetric(march.payload, updateSegments))

    const payload = { segments: updateSegments, isCoordFilled }

    dispatch({
      type: DELETE_CHILD,
      payload,
    })
  })

// data = { segmentId <, childId> }
export const setCoordMode = (data) => ({
  type: SET_COORD_MODE,
  payload: data,
})

// изменение координат точки марша value = { segmentId , childId, val }
// val - новые latlng координаты
export const setCoordDotFromMap = (value) => asyncAction.withNotification(
  async (dispatch, getState) => {
    const { march } = getState()
    const { segments, geoLandmarks } = march
    const data = { ...value, fieldName: 'coordinates' }
    const { updateSegments } = getUpdateSegments(segments, data, geoLandmarks, dispatch)
    const isCoordFilled = isFilledMarchCoordinates(updateSegments.toArray())

    dispatch(updateMetric(march.payload, updateSegments))

    const payload = {
      segments: updateSegments,
      coordMode: false,
      isCoordFilled,
    }

    dispatch({
      type: SET_COORD_FROM_MAP,
      payload,
    })
  })

export const setCoordFromMap = (value) => asyncAction.withNotification(
  async (dispatch, getState) => {
    const { march } = getState()
    const { segments, coordModeData, geoLandmarks } = march
    const data = { ...coordModeData, val: value, fieldName: 'coordinates' }
    const { updateSegments } = getUpdateSegments(segments, data, geoLandmarks, dispatch)
    const isCoordFilled = isFilledMarchCoordinates(updateSegments.toArray())

    dispatch(updateMetric(march.payload, updateSegments))

    const payload = {
      segments: updateSegments,
      coordMode: false,
      isCoordFilled,
    }

    dispatch({
      type: SET_COORD_FROM_MAP,
      payload,
    })
  })

export const setRefPointOnMap = (data = null) => ({
  type: SET_REF_POINT_ON_MAP,
  payload: data,
})

export const openMarch = (data) => asyncAction.withNotification(
  async (dispatch) => {
    const { mapId, layerId, readOnly, unitId, mapObjectsIds } = data

    const geoLandmarks = {}

    dispatch(openMapFolder(mapId, layerId))
    let segments
    if (!data || !data.segments || !data.segments.length) {
      segments = initDefaultSegments()
    } else {
      segments = data.segments

      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i]
        const { coordinates, refPoint, children } = segment
        const { lat, lng } = coordinates
        const geoKey = `${lat}:${lng}`
        const childrenMetric = []
        segment.metric = {
          time: 0,
          distance: 0,
          reference: { time: 0, distance: 0 },
          untilPrevious: { time: 0, distance: 0 },
          children: childrenMetric,
        }

        geoLandmarks[geoKey] = [ {
          propertiesText: refPoint,
          isReceived: true,
          geometry: {
            coordinates: [ lat, lng ],
          },
        } ]

        if (children && children.length > 0) {
          for (let j = 0; j < children.length; j++) {
            const { lat, lng } = children[j].coordinates
            segment.metric.children.push({ distance: 0, time: 0 })
            const geoKey = `${lat}:${lng}`
            children[j].metric = {
              time: 0,
              distance: 0,
            }

            geoLandmarks[geoKey] = [ {
              propertiesText: children[j].refPoint,
              isReceived: true,
              geometry: {
                coordinates: [ lat, lng ],
              },
            } ]
          }
        }
      }
    }

    const isCoordFilled = isFilledMarchCoordinates(segments)

    segments = List(segments)
    dispatch(updateMetric(data.payload, segments))

    const payload = {
      segments,
      payload: data.payload,
      marchEdit: true,
      isCoordFilled,
      readOnly,
      mapId,
      unitId,
      layerId,
      mapObjectsIds,
      geoLandmarks,
    }

    dispatch({
      type: INIT_MARCH,
      payload,
    })
  })

const saveMarchUnit = (startRouteCoodr, endRouteCoodr) =>
  asyncAction.withNotification(async (dispatch, getState, { webmapApi, milOrgApi }) => {
    const state = getState()
    const { march } = state
    const dictionaries = await milOrgApi.allDc()

    const unitCurrent = getUnitObj({
      unitID: march.unitId,
      point: startRouteCoodr,
      dictionaries,
      state,
    })
    const unitPlanned = getUnitObj({
      unitID: march.unitId,
      point: endRouteCoodr,
      dictionaries,
      state,
    })
    unitPlanned.code = model.APP6Code.setStatus(unitPlanned.code, '1')

    if (!march.mapObjectsIds) {
      const { id: unitCurrentId } = await webmapApi.objInsert(unitCurrent)
      const { id: unitPlannedId } = await webmapApi.objInsert(unitPlanned)
      return {
        unitCurrentId,
        unitPlannedId,
      }
    } else {
      const { id: unitCurrentId } = await webmapApi.objUpdate(march.mapObjectsIds.unitCurrentId, unitCurrent)
      const { id: unitPlannedId } = await webmapApi.objUpdate(march.mapObjectsIds.unitPlannedId, unitPlanned)
      return {
        unitCurrentId,
        unitPlannedId,
      }
    }
  })

const saveMarchRoute = (geometry) =>
  asyncAction.withNotification(async (dispatch, getState, { webmapApi }) => {
    const { march, orgStructures } = getState()
    const unit = orgStructures.byIds[march.unitId] || {}

    const marchObj = {
      attributes: {
        lineType: 'dashed',
        color: AFFILIATION_COLOR[unit.affiliationTypeID],
      },
      code: '',
      geometry,
      hash: null,
      layer: march.layerId,
      level: null,
      parent: null,
      point: geometry[0],
      type: entityKind.POLYLINE,
      unit: null,
    }

    if (!march.mapObjectsIds) {
      const { id: routeId } = await webmapApi.objInsert(marchObj)
      return routeId
    } else {
      marchObj.id = march.mapObjectsIds.routeId
      const { id: routeId } = await webmapApi.objUpdate(march.mapObjectsIds.routeId, marchObj)
      return routeId
    }
  })

export const sendMarchToExplorer = (mapObjectsIds) =>
  async (dispatch, getState) => {
    const { march: { segments, isCoordFilled, readOnly } } = getState()

    if (isCoordFilled && !readOnly) {
      const payload = convertSegmentsForExplorer(segments)
      payload.mapObjectsIds = mapObjectsIds

      const res = window.explorerBridge.saveMarch(payload)
      dispatch(notifications.push({
        type: 'success',
        message: i18n.MESSAGE,
        description: i18n.SUCCESS_SEND_MARCH_TO_EXPLORER,
      }))

      return res
    }

    return null
  }

const getMarchRouteGeometry = (march) =>
  march.segments.toJS().reduce((acc, segment) => {
    acc.push(segment.coordinates)
    if (segment.children && segment.children.length) {
      acc = acc.concat(segment.children.map(({ coordinates }) => coordinates))
    }
    return acc
  }, [])

export const onSaveMarch = () =>
  asyncAction.withNotification(async (dispatch, getState) => {
    const { march } = getState()
    const geometry = getMarchRouteGeometry(march)
    const startRouteCoodr = geometry[0]
    const endRouteCoodr = geometry[geometry.length - 1]

    const routeId = await dispatch(saveMarchRoute(geometry))
    const { unitCurrentId, unitPlannedId } = await dispatch(saveMarchUnit(startRouteCoodr, endRouteCoodr))
    const mapObjectsIds = { routeId, unitCurrentId, unitPlannedId }
    dispatch({
      type: SET_MAP_OBJECTS_IDS,
      payload: { mapObjectsIds },
    })
    dispatch(sendMarchToExplorer(mapObjectsIds))
  })

export const closeMarch = () =>
  (dispatch, getState) => {
    const { march: { mapId } } = getState()

    mapId && dispatch(deleteMap(mapId))
    dispatch({
      type: CLOSE_MARCH,
    })

    return null
  }

export const addGeoLandmark = (coordinates, geoLandmark, segmentId, childId) => ({
  type: ADD_GEO_LANDMARK,
  payload: {
    coordinates,
    geoLandmark,
    segmentId,
    childId,
  },
})

export const setGeoLandmarks = (data) => asyncAction.withNotification(
  async (dispatch, getState) => {
    const { march: { geoLandmarks } } = getState()
    const { coordinates, segmentId, childId, selectFirstItem } = data

    const {
      firstGeoLandmark,
      geoLandmarks: updateGeoLandmarks,
    } = await getGeoLandmarks(coordinates, geoLandmarks, selectFirstItem)

    const { march: { segments } } = getState()
    let currentSegments

    if (childId || childId === 0) {
      currentSegments = segments.update(segmentId, (segment) => ({
        ...segment,
        children: segment.children.map((it, id) => {
          return (id === childId) ? {
            ...it,
            refPoint: firstGeoLandmark ? firstGeoLandmark.propertiesText : it.refPoint,
          } : it
        }),
      }))
    } else {
      const children = segments.get(segmentId).children

      currentSegments = segments.update(segmentId, (segment) => {
        return {
          ...segment,
          refPoint: firstGeoLandmark ? firstGeoLandmark.propertiesText : segment.refPoint,
          children,
        }
      })
    }

    const payload = { segments: currentSegments, geoLandmarks: updateGeoLandmarks }

    dispatch({
      type: SET_GEO_LANDMARKS,
      payload,
    })
  })

export const setVisibleIntermediate = (segmentId, visibleIntermediate) => ({
  type: SET_VISIBLE_INTERMEDIATE,
  payload: {
    segmentId,
    visibleIntermediate,
  },
})

export const getRoute = ({
  segmentId,
  childId,
  dataSegments = null,
  isClearRoute = false,
}) => asyncAction.withNotification(
  async (dispatch, getState) => {
    let state = getState()
    const { march: { payload } } = state

    let segments = dataSegments || state.march.segments
    let dataRoute

    if (isClearRoute) {
      dataRoute = null
    } else {
      const twoPointsRoute = getTwoPointsRoute(segments.toArray(), segmentId, childId)
      if (!isValidIncomingPoints(twoPointsRoute)) {
        return
      }

      const rawRoute = await osrmApi.getRoute(twoPointsRoute[0], twoPointsRoute[1])
      dataRoute = getDataRoute(rawRoute)
    }

    state = getState()
    segments = state.march.segments

    let updateSegments
    if (childId || childId === 0) {
      updateSegments = segments.update(segmentId, (segment) => ({
        ...segment,
        children: segment.children.map((it, id) => {
          return (id === childId) ? {
            ...it,
            route: dataRoute,
          } : it
        }),
      }))
    } else {
      updateSegments = segments.update(segmentId, (segment) => {
        return {
          ...segment,
          route: dataRoute,
        }
      })
    }
    dispatch(updateMetric(payload, updateSegments))

    dispatch({
      type: SET_ROUTE,
      payload: { segments: updateSegments },
    })
  })

export const setActivePoint = (segmentId = null, childId = null) => ({
  type: SET_ACTIVE_POINT,
  payload: { activePoint: {
    segmentId,
    childId,
  } },
})
