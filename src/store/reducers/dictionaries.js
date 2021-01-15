import { dictionaries } from '../actions'

const initialState = {
  dictionaries: {},
  loaded: false,
}

const parseMap = (arr) => Object.fromEntries(
  Object.entries(arr).map(([ key, value ]) => [ key, new Map(value.map((item) => [ item.id, item ])) ]),
)

export default function (state = initialState, action) {
  const { type } = action
  switch (type) {
    case dictionaries.GET_DICTIONARIES: {
      const { payload } = action
      return { ...state, dictionaries: parseMap(payload), loaded: true }
    }
    case dictionaries.CLEAR_DICTIONARIES: {
      return { ...state, dictionaries: initialState.dictionaries, loaded: false }
    }
    default:
      return state
  }
}
