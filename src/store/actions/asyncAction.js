import { action } from '../../utils/services'

export const ASYNC_ACTION_START = action('ASYNC_ACTION_START')
export const ASYNC_ACTION_SUCCESS = action('ASYNC_ACTION_SUCCESS')
export const ASYNC_ACTION_ERROR = action('ASYNC_ACTION_ERROR')

// TODO: Індикацію помилки винести на рівень catchError
// TODO: Із withNotification прибрати перехват помилки
// TODO: Потім переконатися, що усі використання withNotification обгорнуті зовні у catchError

export const withNotification = (asyncFunc, payload) => async (dispatch, getState, options) => {
  dispatch({ type: ASYNC_ACTION_START, payload })
  try {
    const res = await asyncFunc(dispatch, getState, options)
    dispatch({ type: ASYNC_ACTION_SUCCESS, payload })
    return res
  } catch (error) {
    dispatch({ type: ASYNC_ACTION_ERROR, payload, error })
    throw error
  }
}

export const catchError = (getAction) => (...args) => async (dispatch) => {
  try {
    return await dispatch(getAction(...args))
  } catch (error) {
    console.error(error)
  }
}

export const catchErrors = (events) => {
  for (const key of Object.keys(events)) {
    events[key] = catchError(events[key])
  }
  return events
}
