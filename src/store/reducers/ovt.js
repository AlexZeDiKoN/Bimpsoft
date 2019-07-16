/**
 * Created by pavlo.cherevko (melight@ex.ua) on 7/15/2019
 */

const initialState = {
  ovtData: new Map(),
  loading: false,
  loaded: false,
}

const reduceArr = (arr) => arr.reduce((newMap, item) => newMap.set(item.id, item), new Map())

export default function (state = initialState, action) {
  const { type, payload } = action
  switch (type) {
    case 'GET_OVT_LIST_START': {
      return { ...state, loading: true }
    }
    case 'GET_OVT_LIST_SUCCESS': {
      return { ...state, ovtData: reduceArr(payload), loading: false, loaded: true }
    }
    case 'GET_OVT_LIST_ERROR': {
      return { ...state, error: payload, loading: false }
    }
    default:
      return state
  }
}
