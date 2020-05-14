import { List } from 'immutable'
import api from '../../server/api.march'
import { action } from '../../utils/services'
import { MarchKeys } from '../../constants'
import utilsMarch from '../../../src/components/common/March/utilsMarch'
import i18n from './../../i18n'
import { openMapFolder } from './maps'

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

const { getMarchMetric } = api
const getMarchDetails = utilsMarch.formulas
const { convertSegmentsForExplorer } = utilsMarch.convertUnits
const { getDefaultMetric, getDefaultLoadUploadData, defaultChild, defaultSegment, uuid } = utilsMarch.reducersHelpers

const initDefaultSegments = () => ([
  {
    id: uuid(),
    name: i18n.POINT_OF_DEPARTURE,
    refPoint: i18n.BASE,
    segmentType: 41,
    terrain: 69,
    velocity: 30,
    coordinate: {},
    required: true,
    editableName: false,
    metric: getDefaultMetric(),
    children: [
      {
        id: uuid(),
        type: 5,
        lineType: '',
        coordinate: {},
        refPoint: '',
        required: true,
        editableName: true,
        restTime: 0,
        metric: {
          time: 0,
          distance: 0,
        },
      },
    ],
  },
  {
    id: uuid(),
    segmentType: 0,
    coordinate: {},
    name: i18n.DESTINATION,
    required: true,
    editableName: false,
    metric: getDefaultMetric(true),
  },
])

const updateMetric = async (segments, values, indicatorsICT) => {
  const dataMarch = {
    segments: segments.toArray(),
    indicators: indicatorsICT,
    values,
  }

  //console.log('GET METRIC ----------------1 indicators', indicatorsICT)
  const res = await getMarchMetric(dataMarch)

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
  //console.log('GET METRIC ----------------5', res)
  //console.log('GET METRIC ----------------', segmentsWithUpdateMetrics.toArray())

  return {
    segments: segmentsWithUpdateMetrics, // segmentsWithUpdateMetrics,
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

export const editFormField = (data) =>
  async (dispatch, getState) => {
    const { march: { indicatorsICT, values, segments } } = getState()
    const newSegments = getUpdateSegments(segments, data)

    const { segments: segmentsWithMetric, time, distance } = await updateMetric(newSegments, values, indicatorsICT)

    const payload = { segments: segmentsWithMetric, coordMode: false, time, distance }

    dispatch({
      type: EDIT_FORM_FIELD,
      payload,
    })
  }

export const addSegment = (segmentId) =>
  async (dispatch, getState) => {
    const { march: { indicatorsICT, values, segments } } = getState()

    const updateSegments = segments.insert(segmentId + 1, defaultSegment())

    const { segments: segmentsWithMetric, time, distance } = await updateMetric(updateSegments, values, indicatorsICT)

    const payload = { segments: segmentsWithMetric, time, distance }

    dispatch({
      type: ADD_SEGMENT,
      payload,
    })
  }

export const deleteSegment = (segmentId) =>
  async (dispatch, getState) => {
    const { march: { indicatorsICT, values, segments } } = getState()

    const updateSegments = segments.delete(segmentId)

    const { segments: segmentsWithMetric, time, distance } = await updateMetric(updateSegments, values, indicatorsICT)

    const payload = { segments: segmentsWithMetric, time, distance }

    dispatch({
      type: DELETE_SEGMENT,
      payload,
    })
  }

export const addChild = (segmentId, childId) =>
  async (dispatch, getState) => {
    const { march: { indicatorsICT, values, segments } } = getState()

    const children = segments.get(segmentId).children
    children.splice((childId || childId === 0) ? childId + 1 : 0, 0, defaultChild())

    const updateSegments = segments.update(segmentId, (segment) => ({
      ...segment,
      children,
    }))

    const { segments: segmentsWithMetric, time, distance } = await updateMetric(updateSegments, values, indicatorsICT)

    const payload = { segments: segmentsWithMetric, time, distance }

    dispatch({
      type: ADD_CHILD,
      payload,
    })
  }

export const deleteChild = (segmentId, childId) =>
  async (dispatch, getState) => {
    const { march: { indicatorsICT, values, segments } } = getState()

    const children = segments.get(segmentId).children
    children.splice(childId, 1)

    const updateSegments = segments.update(segmentId, (segment) => ({
      ...segment,
      children,
    }))

    const { segments: segmentsWithMetric, time, distance } = await updateMetric(updateSegments, values, indicatorsICT)

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
    const { values, indicatorsICT, segments, coordModeData } = stateMarch
    const data = { ...coordModeData, val: value, fieldName: 'coordinate' }
    const newSegments = getUpdateSegments(segments, data)

    const { segments: segmentsWithMetric, time, distance } = await updateMetric(newSegments, values, indicatorsICT)

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
    const { mapId, values = {}, indicators = [] } = data

    dispatch(openMapFolder(mapId, null, true))

    let segments
    if (!data || !data.segments || !data.segments.length) {
      segments = initDefaultSegments()
    } else {
      segments = data.segments
    }

    segments = List(segments)

    const { segments: segmentsWithMetric, time, distance } = await updateMetric(segments, values, indicators)

    const payload = { segments: segmentsWithMetric, time, distance, values, indicatorsICT: indicators }

    dispatch({
      type: INIT_MARCH,
      payload,
    })
  }

export const sendMarchToExplorer = (data) =>
  async (dispatch, getState) => {
    const { march: { segments } } = getState()

    const segmentsForExplorer = convertSegmentsForExplorer(segments)

    window.explorerBridge.saveMarch(segmentsForExplorer)
  }
