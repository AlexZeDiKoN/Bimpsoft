import { march } from '../actions'

const initState = {
  marchEdit: true,
  indicators: undefined,
  params: {
    segments: [],
  },
}

export default function reducer (state = initState, action) {
  const { type, payload } = action

  switch (type) {
    case march.GET_TYPE_KINDS: {
      const indicators = payload.reduce((prev, current) => ({ ...prev, [ current.typeCode ]: current }), {})
      return { ...state, indicators }
    }
    case march.SET_MARCH_PARAMS: {
      const params = { ...state.params, ...payload }
      return { ...state, params }
    }
    case march.ADD_SEGMENT: {
      const { segments } = state.params
      const position = payload === 1 ? payload + 1 : payload
      const template = { ...segments[0].complementarySegment }
      // segments[payload] = { default: segments[payload].default, id: segments[payload].id }
      const defaultSegmentData = { default: segments[payload].default, id: segments[payload].id }
      segments.splice(payload, 1, defaultSegmentData)
      // const params = { ...state.params, segments: segments.slice() }
      const params = { ...state.params, ...segments.splice(position, 0, template) }

      return { ...state, params }
    }
    default:
      return state
  }
}
