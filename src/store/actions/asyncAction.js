export const ASYNC_ACTION_START = 'ASYNC_ACTION_START'
export const ASYNC_ACTION_SUCCESS = 'ASYNC_ACTION_SUCCESS'
export const ASYNC_ACTION_ERROR = 'ASYNC_ACTION_ERROR'

export const withNotification = (asyncFunc, payload) => async (dispatch, getState, options) => {
  dispatch({ type: ASYNC_ACTION_START, payload })
  try {
    await asyncFunc(dispatch, getState, options)
    dispatch({ type: ASYNC_ACTION_SUCCESS, payload })
  } catch (error) {
    console.error(error)
    dispatch({ type: ASYNC_ACTION_ERROR, payload, error })
  }
}
