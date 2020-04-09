import { List } from 'immutable'
import { march } from '../actions'

const initState = {
  marchEdit: true,
  indicators: undefined,
  integrity: false,
  coordMode: false,
  coordModeData: { },
  dataMarch: {
    vehiclesLength: 30,
    distanceVehicle: 50,
    distanceRots: 10,
    distanceBats: 20,
    distanceBrg: 30,
    distanceGslz: 40,
    vehiclesCount: 5,
    rotsCount: 60,
    batsCount: 50,
    brgCount: 40,
    timeIncreaseFactor: 1.2,
    timeCorrectionFactor: 1.3,
    mountingFactor: 1.4,
    workInDarkFactor: 1.5,
    workInGasMasksFactor: 1.6,
    loadingTimes: [ 30, 50, 120, 60, 180 ],
    uploadingTimes: [ 20, 40, 110, 40, 160 ],
    intervalEchelon: 1,
    numberEchelons: 1,
  },
  segments: List([
    {
      name: 'Пункт відправлення',
      refPoint: 'База',
      segmentType: 41, // Своїм ходом
      terrain: 69, // Рівнинна
      velocity: 30,
      coord: {
        lat: 0,
        lng: 0,
      },
      required: true,
      editableName: false,
      children: [
        {
          name: 'Вихідний рубіж',
          lineType: '',
          coord: {
            lat: 0,
            lng: 0,
          },
          refPoint: '',
          required: true,
          editableName: true,
          restTime: null,
        },
      ],
    },
    {
      segmentType: 0,
      coord: {
        lat: 0,
        lng: 0,
      },
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
  coord: {
    lat: 0,
    lng: 0,
  },
  required: false,
  editableName: false,
  // eslint-disable-next-line
  //children: [ ],
}

const defaultChild = {
  name: '',
  lineType: '',
  coord: {
    lat: 0,
    lng: 0,
  },
  refPoint: '',
  required: false,
  editableName: true,
  restTime: 0,
}

// eslint-disable-next-line
export const uuid = () => ([ 1e7 ] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16))

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
      const firstPoint = { ...defaultChild }
      firstPoint.required = true
      firstPoint.editableName = false
      firstPoint.name = 'Вихідний рубіж'

      return { ...state,
        segments: state.segments.insert(payload + 1,
          { ...defaultSegment, children: [ firstPoint ] }),
      }
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
      return { ...state, coordMode: !state.coordMode, coordModeData: payload }
    }
    case march.SET_COORD_FROM_MAP: {
      const { coordModeData: data } = state

      return editFormField(state, { ...data, val: payload, fieldName: 'coord' })
    }
    default:
      return state
  }
}
