/**
 * Created by pavlo.cherevko (melight@ex.ua) on 7/15/2019
 */

export const getOvtList = (asyncFunc, payload) => async (dispatch, _, { ovtApi }) => {
  dispatch({ type: 'GET_OVT_LIST_START', payload })
  try {
    const res = await ovtApi.getOvtList()
    dispatch({ type: 'GET_OVT_LIST_SUCCESS', payload: res.payload })
  } catch (error) {
    dispatch({ type: 'GET_OVT_LIST_ERROR', payload: error })
    throw error
  }
}
