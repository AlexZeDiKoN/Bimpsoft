import { List } from 'immutable'
import api from '../../server/api.march'
import { action } from '../../utils/services'
import { MarchKeys } from '../../constants'
import utilsMarch from '../../../src/components/common/March/utilsMarch'
import { MARCH_TYPES } from '../../constants/March'
import webmapApi from '../../server/api.webmap'
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
export const ADD_GEO_LANDMARK = action('ADD_GEO_LANDMARK')
export const SET_METRIC = action('SET_METRIC')

const { getMarchMetric } = api
const { convertSegmentsForExplorer, getFilteredGeoLandmarks, azimuthToCardinalDirection } = utilsMarch.convertUnits
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
        let { distance, time } = segmentsDetails[id].children[childId]
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

    if (childId || childId === 0) {
      updateSegments = updateSegments.update(segmentId, (segment) => ({
        ...segment,
        children: segment.children.map((it, id) => (id === childId) ? {
          ...it,
          [fieldName[i]]: val[i],
          refPoint: fieldName[i] === 'refPoint' ? val[i] : it.refPoint,
        } : it),
      }))
    } else {
      let children = segments.get(segmentId).children
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

    if (fieldName[i] === 'coordinates') {
      const coordinates = val[i]
      dispatch(setGeoLandmarks({
        coordinates: { ...coordinates },
        segmentId,
        childId,
        selectFirstItem: true,
      }))
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

    dispatch(updateMetric(march.payload))

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

    const updateSegments = march.segments.insert(segmentId + 1, defaultSegment(type))

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

    const updateSegments = march.segments.delete(segmentId)

    const isCoordFilled = isFilledMarchCoordinates(updateSegments.toArray())

    dispatch(updateMetric(march.payload, updateSegments))

    const payload = { segments: updateSegments, isCoordFilled }

    dispatch({
      type: DELETE_SEGMENT,
      payload,
    })
  })

export const addChild = (segmentId, childId) => asyncAction.withNotification(
  async (dispatch, getState) => {
    const { march } = getState()

    const segment = march.segments.get(segmentId)
    const children = segment.children
    segment.metric.children.splice((childId || childId === 0) ? childId + 1 : 0, 0, { distance: 0, time: 0 })
    children.splice((childId || childId === 0) ? childId + 1 : 0, 0, defaultChild())

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

    const children = segment.children
    children.splice(childId, 1)
    segment.metric.children.splice(childId, 1)

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
    const { mapId, readOnly } = data

    const geoLandmarks = {}

    dispatch(openMapFolder(mapId))
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
      geoLandmarks,
    }

    dispatch({
      type: INIT_MARCH,
      payload,
    })
  })

export const sendMarchToExplorer = () =>
  (dispatch, getState) => {
    const { march: { segments, isCoordFilled, readOnly } } = getState()

    if (isCoordFilled && !readOnly) {
      const segmentsForExplorer = convertSegmentsForExplorer(segments)

      const res = window.explorerBridge.saveMarch(segmentsForExplorer)
      dispatch(notifications.push({
        type: 'success',
        message: i18n.MESSAGE,
        description: i18n.SUCCESS_SEND_MARCH_TO_EXPLORER,
      }))
      dispatch(closeMarch())

      return res
    }

    return null
  }

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
