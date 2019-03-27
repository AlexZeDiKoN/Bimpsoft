import { action } from '../../utils/services'
import { MarchKeys } from '../../constants'

export const GET_TYPE_KINDS = action('GET_TYPE_KINDS')
export const SET_MARCH_PARAMS = action('SET_MARCH_PARAMS')
export const ADD_SEGMENT = action('ADD_SEGMENT')

export const getIndicator = () =>
  async (dispatch, getState, { indicatorApi: { getTypeKinds } }) => {
    const indicators = await getTypeKinds(MarchKeys.MARCH_INDICATORS_GROUP)
    dispatch({
      type: GET_TYPE_KINDS,
      payload: indicators,
    })
  }

export const addSegment = (index) => ({
  type: ADD_SEGMENT,
  payload: index,
})

export const setMarchParams = (data) => ({
  type: SET_MARCH_PARAMS,
  payload: data,
})
