import { action } from '../../utils/services'

export const GET_TYPE_KINDS = action('GET_TYPE_KINDS')

export const getIndicator = (typeCode = 'TEST') =>
  async (dispatch, getState, { indicatorApi: { getTypeKinds } }) => {
    const indicators = await getTypeKinds(typeCode)
    dispatch({
      type: GET_TYPE_KINDS,
      payload: indicators,
    })
  }
