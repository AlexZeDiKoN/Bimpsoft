import { action } from '../../utils/services'
import { MarchKeys } from '../../constants'

export const GET_TYPE_KINDS = action('GET_TYPE_KINDS')
export const SET_MARCH_PARAMS = action('SET_MARCH_PARAMS')
export const ADD_POINT = action('ADD_POINT')
export const DELETE_POINT = action('DELETE_POINT')
export const DELETE_SEGMENT = action('DELETE_SEGMENT')
export const SET_INTEGRITY = action('SET_INTEGRITY')
export const GET_EXISTING_SEGMENTS = action('GET_EXISTING_SEGMENTS')

export const getIndicator = () =>
  async (dispatch, getState, { marchApi: { getTypeKinds } }) => {
    const indicators = await getTypeKinds(Object.values(MarchKeys.MARCH_INDICATORS_GROUP))
    dispatch({
      type: GET_TYPE_KINDS,
      payload: indicators,
    })
  }

export const addPoint = (index, optional) => ({
  type: ADD_POINT,
  payload: { index, optional },
})

export const deletePoint = (index) => ({
  type: DELETE_POINT,
  payload: index,
})

export const deleteSegment = (index) => ({
  type: DELETE_SEGMENT,
  payload: index,
})

export const setMarchParams = (data) => ({
  type: SET_MARCH_PARAMS,
  payload: data,
})

export const setIntegrity = (data) => ({
  type: SET_INTEGRITY,
  payload: data,
})

export const getExistingSegments = (startCoord, possibleTypes) =>
  async (dispatch, _, { marchApi: { getSegments } }) => {
    const segments = await getSegments(startCoord, possibleTypes)
    dispatch({
      type: GET_EXISTING_SEGMENTS,
      payload: segments,
    })
  }
