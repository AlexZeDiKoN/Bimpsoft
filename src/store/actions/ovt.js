/**
 * Created by pavlo.cherevko (melight@ex.ua) on 7/15/2019
 */
import { action } from '../../utils/services'
import { asyncAction } from './index'

export const GET_OVT_LIST = action('GET_OVT_LIST')

const setOvt = (payload) => ({
  type: GET_OVT_LIST,
  payload,
})

export const getOvtList = () => asyncAction.withNotification(async (dispatch, _, { ovtApi }) =>
  dispatch(setOvt(await ovtApi.getOvtList())))
