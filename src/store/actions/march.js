import { List } from 'immutable'
import { action } from '../../utils/services'
import { MarchKeys } from '../../constants'
import utilsMarch from '../../../src/components/common/March/utilsMarch'

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

const getMarchDetails = utilsMarch.formulas

const { getDefaultMetric, getDefaultLoadUploadData, defaultChild, defaultSegment } = utilsMarch.reducersHelpers

const updateMetric = (segments, dataMarch) => {
  const pr = new Promise((resolve) => {
    setTimeout(() => {
      const marchDetails = getMarchDetails(segments.toArray(), dataMarch)
      const { time, distance } = marchDetails

      const segmentsWithUpdateMetrics = segments.map((segment, id) => {
        segment.metric = { ...marchDetails.segments[id] }

        segment.children = segment.children && segment.children.map((child, childId) => {
          child.metric = marchDetails.segments[id].childSegments[childId]
          return child
        })

        return segment
      })

      resolve({
        segments: segmentsWithUpdateMetrics,
        time,
        distance,
      })
    }, 1000)
  })

  return pr
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

export const editFormField = (data) =>
  async (dispatch, getState) => {
    const { march: stateMarch } = getState()
    const { dataMarch, segments } = stateMarch
    const newSegments = getUpdateSegments(segments, data)

    const { segments: segmentsWithMetric, time, distance } = await updateMetric(newSegments, dataMarch)

    const payload = { segments: segmentsWithMetric, coordMode: false, time, distance }

    dispatch({
      type: EDIT_FORM_FIELD,
      payload,
    })
  }

export const addSegment = (segmentId) =>
  async (dispatch, getState) => {
    const { march: { dataMarch, segments } } = getState()

    const updateSegments = segments.insert(segmentId + 1, defaultSegment())

    const { segments: segmentsWithMetric, time, distance } = await updateMetric(updateSegments, dataMarch)

    const payload = { segments: segmentsWithMetric, time, distance }

    dispatch({
      type: ADD_SEGMENT,
      payload,
    })
  }

export const deleteSegment = (segmentId) =>
  async (dispatch, getState) => {
    const { march: { dataMarch, segments } } = getState()

    const updateSegments = segments.delete(segmentId)

    const { segments: segmentsWithMetric, time, distance } = await updateMetric(updateSegments, dataMarch)

    const payload = { segments: segmentsWithMetric, time, distance }

    dispatch({
      type: DELETE_SEGMENT,
      payload,
    })
  }

export const addChild = (segmentId, childId) =>
  async (dispatch, getState) => {
    const { march: { dataMarch, segments } } = getState()

    const children = segments.get(segmentId).children
    children.splice((childId || childId === 0) ? childId + 1 : 0, 0, defaultChild())

    const updateSegments = segments.update(segmentId, (segment) => ({
      ...segment,
      children,
    }))

    const { segments: segmentsWithMetric, time, distance } = await updateMetric(updateSegments, dataMarch)

    const payload = { segments: segmentsWithMetric, time, distance }

    dispatch({
      type: ADD_CHILD,
      payload,
    })
  }

export const deleteChild = (segmentId, childId) =>
  async (dispatch, getState) => {
    const { march: { dataMarch, segments } } = getState()

    const children = segments.get(segmentId).children
    children.splice(childId, 1)

    const updateSegments = segments.update(segmentId, (segment) => ({
      ...segment,
      children,
    }))

    const { segments: segmentsWithMetric, time, distance } = await updateMetric(updateSegments, dataMarch)

    const payload = { segments: segmentsWithMetric, time, distance }

    dispatch({
      type: DELETE_CHILD,
      payload,
    })
  }

// data = { segmentId <, childId> }
export const setCoordMode = (data) => ({
  type: SET_COORD_MODE,
  payload: data,
})

export const setCoordFromMap = (value) =>
  async (dispatch, getState) => {
    const { march: stateMarch } = getState()
    const { dataMarch, segments, coordModeData } = stateMarch
    const data = { ...coordModeData, val: value, fieldName: 'coordinate' }
    const newSegments = getUpdateSegments(segments, data)

    const { segments: segmentsWithMetric, time, distance } = await updateMetric(newSegments, dataMarch)

    const payload = { segments: segmentsWithMetric, coordMode: false, time, distance }

    dispatch({
      type: SET_COORD_FROM_MAP,
      payload,
    })
  }

export const setRefPointOnMap = (data = null) => ({
  type: SET_REF_POINT_ON_MAP,
  payload: data,
})

export const initMarch = (data) =>
  async (dispatch, getState) => {
    const { march: { dataMarch } } = getState()

    console.log('*******', data)
    if (!data) {
      return
    }
    data.segments = List(data.segments)

    const { segments: segmentsWithMetric, time, distance } = await updateMetric(data.segments, dataMarch)

    const payload = { segments: segmentsWithMetric, time, distance }

    dispatch({
      type: INIT_MARCH,
      payload,
    })
  }
