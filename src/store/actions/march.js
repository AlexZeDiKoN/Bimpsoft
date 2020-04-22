import { action } from '../../utils/services'
import { MarchKeys } from '../../constants'

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

// data = { val, fieldName, segmentId <, childId> }
export const editFormField = (data) => ({
  type: EDIT_FORM_FIELD,
  payload: data,
})

export const addSegment = (segmentId) => ({
  type: ADD_SEGMENT,
  payload: segmentId,
})

export const deleteSegment = (segmentId) => ({
  type: DELETE_SEGMENT,
  payload: segmentId,
})

export const addChild = (segmentId, childId) => ({
  type: ADD_CHILD,
  payload: {
    segmentId,
    childId,
  },
})

export const deleteChild = (segmentId, childId) => ({
  type: DELETE_CHILD,
  payload: {
    segmentId,
    childId,
  },
})

// data = { segmentId <, childId> }
export const setCoordMode = (data) => ({
  type: SET_COORD_MODE,
  payload: data,
})

export const setCoordFromMap = (coord) => ({
  type: SET_COORD_FROM_MAP,
  payload: coord,
})
