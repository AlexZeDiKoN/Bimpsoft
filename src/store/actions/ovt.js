/**
 * Created by pavlo.cherevko (melight@ex.ua) on 7/15/2019
 */
import { action } from '../../utils/services'
import { asyncAction } from './index'

export const GET_OVT_LIST_SUCCESS = action('GET_OVT_LIST_SUCCESS')

const setOvt = (payload) => ({
  type: GET_OVT_LIST_SUCCESS,
  payload,
})

export const getOvtList = () => asyncAction.withNotification(async (dispatch, _, { ovtApi }) =>
  dispatch(setOvt(await ovtApi.getOvtList())))
