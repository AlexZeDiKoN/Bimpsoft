import { action } from '../../utils/services'

export const ASYNC_ACTION_START = action('ASYNC_ACTION_START')
export const ASYNC_ACTION_SUCCESS = action('ASYNC_ACTION_SUCCESS')
export const ASYNC_ACTION_ERROR = action('ASYNC_ACTION_ERROR')

export const withNotification = (asyncFunc, payload) => async (dispatch, getState, options) => {
  dispatch({ type: ASYNC_ACTION_START, payload })
  try {
    const res = await asyncFunc(dispatch, getState, options)
    dispatch({ type: ASYNC_ACTION_SUCCESS, payload })
    return res
  } catch (error) {
    console.error(error)
    dispatch({ type: ASYNC_ACTION_ERROR, payload, error })
    return null
  }
}
