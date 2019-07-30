/**
 * Created by pavlo.cherevko (melight@ex.ua) on 7/15/2019
 */
import { ovt } from '../actions'
const initialState = {
  ovtData: new Map(),
  loaded: false,
}

const reduceArr = (arr) => arr.reduce((newMap, item) => newMap.set(item.id, item), new Map())

export default function (state = initialState, action) {
  const { type } = action
  switch (type) {
    case ovt.GET_OVT_LIST: {
      const { payload: { payload } } = action
      return { ...state, ovtData: reduceArr(payload), loading: false, loaded: true }
    }
    default:
      return state
  }
}
