import { omit, remove, update, insert, compose } from 'ramda'
import { march } from '../actions'

const initState = {
  marchEdit: false,
  indicators: undefined,
  params: {
    segments: [],
  },
}

// eslint-disable-next-line
const uuid = () => ([ 1e7 ] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ crypto.getRandomValues(new Uint8Array(1))[ 0 ] & 15 >> c / 4).toString(16))

export default function reducer (state = initState, action) {
  const { type, payload } = action

  switch (type) {
    case march.GET_TYPE_KINDS: {
      const indicators = payload.reduce((prev, current) => ({ ...prev, [ current.typeCode ]: current }), {})
      return { ...state, indicators }
    }
    case march.SET_MARCH_PARAMS: {
      const { marchType, template } = payload
      if (marchType) {
        const segments = template.map((item) => ({ ...item, id: uuid() }))
        const params = { ...state.params, ...{ marchType, segments } }
        return { ...state, params }
      } else {
        const params = { ...state.params, ...payload }
        return { ...state, params }
      }
    }
    case march.ADD_POINT: {
      const { segments } = state.params
      const position = payload === 1 ? payload + 1 : payload
      const template = { ...segments[ 0 ].complementarySegment }
      const updatedSegments = insert(position, {
        ...template,
        id: uuid(),
        coordinateFinish: segments[ payload ].coordinateFinish,
        landmarkFinish: segments[ payload ].landmarkFinish,
      }, segments)

      const defaultSegmentData = { default: updatedSegments[ payload ].default, id: updatedSegments[ payload ].id }
      updatedSegments.splice(payload, 1, defaultSegmentData)

      const params = {
        ...state.params,
        segments: updatedSegments,
      }

      return { ...state, params }
    }
    case march.DELETE_POINT: {
      const { segments } = state.params
      const nextSegmentIndex = payload + 1
      const nextSegment = omit([ 'segment', 'segmentName', 'segmentType' ], segments[nextSegmentIndex])
      const updatedSegments = compose(remove(payload, 1), update(nextSegmentIndex, nextSegment))(segments)
      const params = { ...state.params, segments: updatedSegments }
      return { ...state, params }
    }
    case march.DELETE_SEGMENT: {
      const { segments } = state.params
      const updatedSegment = omit([ 'segment', 'segmentName' ], segments[payload])
      const updatedSegments = update(payload, updatedSegment, segments)
      const params = { ...state.params, segments: updatedSegments }
      return { ...state, params }
    }
    default:
      return state
  }
}
