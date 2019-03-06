import { action } from '../../utils/services'
import { MARCH_INDICATORS_GROUP } from '../../constants/March'

export const GET_TYPE_KINDS = action('GET_TYPE_KINDS')

export const getIndicator = () =>
  async (dispatch, getState, { indicatorApi: { getTypeKinds } }) => {
    const indicators = await getTypeKinds(MARCH_INDICATORS_GROUP)
    dispatch({
      type: GET_TYPE_KINDS,
      payload: indicators,
    })
  }
