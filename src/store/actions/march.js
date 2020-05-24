import { List } from 'immutable'
import api from '../../server/api.march'
import { action } from '../../utils/services'
import { MarchKeys } from '../../constants'
import utilsMarch from '../../../src/components/common/March/utilsMarch'
import i18n from './../../i18n'
import { openMapFolder } from './maps'
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

const { getMarchMetric } = api
const { convertSegmentsForExplorer } = utilsMarch.convertUnits
const { getDefaultMetric, defaultChild, defaultSegment } = utilsMarch.reducersHelpers

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
    const { coordinate, children } = segment

    if (!isFilledCoordinate(coordinate)) {
      return false
    }

    if (children !== undefined && children.length > 0) {
      for (const child of children) {
        if (!isFilledCoordinate(child.coordinate)) {
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
    segmentType: 0,
    name: i18n.DESTINATION,
    required: true,
    editableName: false,
    metric: getDefaultMetric(true),
    children: [],
  },
])

const updateMetric = async (segments, payload) => {
  const res = await getMarchMetric({
    ...payload,
    segments: segments.toArray(),
  })

  const marchDetails = res.payload
  const { time = 0, distance = 0, segments: segmentsDetails } = marchDetails

  const segmentsWithUpdateMetrics = segments.map((segment, id) => {
    const {
      children,
      reference = { time: 0, distance: 0 },
      untilPrevious = { time: 0, distance: 0 },
    } = segmentsDetails[id]
    let { distance, time } = segmentsDetails[id]
    distance = distance || 0
    time = time || 0

    segment.metric = { children, distance, time, reference, untilPrevious }
    segment.children = segment.children && segment.children.map((child, childId) => {
      let { distance, time } = segmentsDetails[id].children[childId]
      distance = distance || 0
      time = time || 0

      child.metric = { distance, time }
      return child
    })

    return segment
  })

  return {
    segments: segmentsWithUpdateMetrics,
    time,
    distance,
  }
}

const getUpdateSegments = (segments, data) => {
  const { segmentId, childId } = data
  let { val, fieldName } = data

  if (!Array.isArray(fieldName)) {
    fieldName = [ fieldName ]
    val = [ val ]
  }

  if (fieldName.length !== val.length) {
    return segments
  }

  let newSegments = segments

  for (let i = 0; i < fieldName.length; i++) {
    if (childId || childId === 0) {
      newSegments = newSegments.update(segmentId, (segment) => ({
        ...segment,
        children: segment.children.map((it, id) => (id === childId) ? { ...it, [fieldName[i]]: val[i] } : it),
      }))
    } else {
      newSegments = newSegments.update(segmentId, (segment) => ({ ...segment, [fieldName[i]]: val[i] }))
    }
  }

  return newSegments
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
    const newSegments = getUpdateSegments(march.segments, data)

    const isCoordFilled = isFilledMarchCoordinates(newSegments.toArray())

    const { segments: segmentsWithMetric, time, distance } = await updateMetric(newSegments, march.payload)

    const payload = { segments: segmentsWithMetric, coordMode: false, time, distance, isCoordFilled }

    dispatch({
      type: EDIT_FORM_FIELD,
      payload,
    })
  })

export const addSegment = (segmentId, segmentType) => asyncAction.withNotification(
  async (dispatch, getState) => {
    const { march } = getState()

    const updateSegments = march.segments.insert(segmentId + 1, defaultSegment(segmentType))

    const isCoordFilled = isFilledMarchCoordinates(updateSegments.toArray())

    const { segments: segmentsWithMetric, time, distance } = await updateMetric(updateSegments, march.payload)

    const payload = { segments: segmentsWithMetric, time, distance, isCoordFilled }

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

    const { segments: segmentsWithMetric, time, distance } = await updateMetric(updateSegments, march.payload)

    const payload = { segments: segmentsWithMetric, time, distance, isCoordFilled }

    dispatch({
      type: DELETE_SEGMENT,
      payload,
    })
  })

export const addChild = (segmentId, childId) => asyncAction.withNotification(
  async (dispatch, getState) => {
    const { march } = getState()

    const children = march.segments.get(segmentId).children
    children.splice((childId || childId === 0) ? childId + 1 : 0, 0, defaultChild())

    const updateSegments = march.segments.update(segmentId, (segment) => ({
      ...segment,
      children,
    }))

    const isCoordFilled = isFilledMarchCoordinates(updateSegments.toArray())

    const { segments: segmentsWithMetric, time, distance } = await updateMetric(updateSegments, march.payload)

    const payload = { segments: segmentsWithMetric, time, distance, isCoordFilled }

    dispatch({
      type: ADD_CHILD,
      payload,
    })
  })

export const deleteChild = (segmentId, childId) => asyncAction.withNotification(
  async (dispatch, getState) => {
    const { march } = getState()

    const children = march.segments.get(segmentId).children
    children.splice(childId, 1)

    const updateSegments = march.segments.update(segmentId, (segment) => ({
      ...segment,
      children,
    }))

    const isCoordFilled = isFilledMarchCoordinates(updateSegments.toArray())

    const { segments: segmentsWithMetric, time, distance } = await updateMetric(updateSegments, march.payload)

    const payload = { segments: segmentsWithMetric, time, distance, isCoordFilled }

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
    const { segments, coordModeData } = march
    const data = { ...coordModeData, val: value, fieldName: 'coordinate' }
    const newSegments = getUpdateSegments(segments, data)

    const isCoordFilled = isFilledMarchCoordinates(newSegments)

    const { segments: segmentsWithMetric, time, distance } = await updateMetric(newSegments, march.payload)

    const payload = { segments: segmentsWithMetric, coordMode: false, time, distance, isCoordFilled }

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
    const { mapId } = data

    dispatch(openMapFolder(mapId, null, true))
    let segments
    if (!data || !data.segments || !data.segments.length) {
      segments = initDefaultSegments()
    } else {
      segments = data.segments
    }

    const isCoordFilled = isFilledMarchCoordinates(segments)

    segments = List(segments)
    const { segments: segmentsWithMetric, time, distance } = await updateMetric(segments, data.payload)
    const payload = { segments: segmentsWithMetric,
      time,
      distance,
      payload: data.payload,
      marchEdit: true,
      isCoordFilled }

    dispatch({
      type: INIT_MARCH,
      payload,
    })
  })

export const sendMarchToExplorer = () =>
  (dispatch, getState) => {
    const { march: { segments, isCoordFilled } } = getState()

    if (isCoordFilled) {
      const segmentsForExplorer = convertSegmentsForExplorer(segments)

      return window.explorerBridge.saveMarch(segmentsForExplorer)
    }

    return null
  }

export const closeMarch = () => ({
  type: CLOSE_MARCH,
})
