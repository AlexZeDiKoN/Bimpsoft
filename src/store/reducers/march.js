import { List } from 'immutable'
import { march } from '../actions'

const initState = {
  marchEdit: true,
  indicators: undefined,
  integrity: false,
  coordMode: false,
  coordModeData: { },
  segments: List([
    {
      name: 'Пункт відправлення',
      refPoint: 'База',
      segmentType: 41, // Своїм ходом
      terrain: 69, // Рівнинна
      velocity: 30,
      coord: { },
      required: true,
      editableName: false,
      children: [
        {
          name: 'Вихідний рубіж',
          lineType: '',
          coord: { },
          refPoint: '',
          required: true,
          editableName: false,
        },
      ],
    },
    {
      segmentType: 0,
      coord: { },
      name: 'Пункт призначення',
      required: true,
      editableName: false,
    },
  ]),
  existingSegmentsById: {},
  landmarks: [],
}

const defaultSegment = {
  name: '',
  refPoint: '',
  segmentType: 41, // Своїм ходом
  terrain: 69, // Рівнинна
  velocity: 30,
  coord: { },
  required: false,
  editableName: true,
  children: [ ],
}

const defaultChild = {
  name: '',
  lineType: '',
  coord: { },
  refPoint: '',
  required: false,
  editableName: true,
}

// eslint-disable-next-line
const uuid = () => ([ 1e7 ] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16))

const editFormField = (state, payload) => {
  const { val, fieldName, segmentId, childId } = payload

  let newSegments
  if (childId || childId === 0) {
    newSegments = state.segments.update(segmentId, (segment) => ({
      ...segment,
      children: segment.children.map((it, id) => (id === childId) ? { ...it, [fieldName]: val } : it),
    }))
  } else {
    newSegments = state.segments.update(segmentId, (segment) => ({ ...segment, [fieldName]: val }))
  }

  return { ...state, segments: newSegments, coordMode: false }
}

export default function reducer (state = initState, action) {
  const { type, payload } = action

  switch (type) {
    case march.GET_TYPE_KINDS: {
      const indicators = payload.reduce(
        (prev, current) => ({ ...prev, [current.typeCode]: current }), {})
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
    case march.SET_INTEGRITY: {
      return { ...state, integrity: payload }
    }
    case march.EDIT_FORM_FIELD: {
      return editFormField(state, payload)
    }
    case march.ADD_SEGMENT: {
      return { ...state, segments: state.segments.insert(payload + 1, defaultSegment) }
    }
    case march.DELETE_SEGMENT: {
      return { ...state, segments: state.segments.delete(payload) }
    }
    case march.ADD_CHILD: {
      const { segmentId, childId } = payload
      const children = state.segments.get(segmentId).children

      children.splice((childId || childId === 0) ? childId + 1 : 0, 0, defaultChild)

      return { ...state,
        segments: state.segments.update(segmentId, (segment) => ({
          ...segment,
          children,
        })) }
    }
    case march.DELETE_CHILD: {
      const { segmentId, childId } = payload
      const children = state.segments.get(segmentId).children

      children.splice(childId, 1)

      return { ...state,
        segments: state.segments.update(segmentId, (segment) => ({
          ...segment,
          children,
        })) }
    }
    case march.SET_COORD_MODE: {
      return { ...state, coordMode: true, coordModeData: payload }
    }
    case march.SET_COORD_FROM_MAP: {
      const { coordModeData: data } = state

      return editFormField(state, { ...data, val: payload, fieldName: 'coord' })
    }
    default:
      return state
  }
}
