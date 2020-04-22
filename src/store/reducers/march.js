import { List } from 'immutable'
import { march } from '../actions'

const initState = {
  marchEdit: true,
  indicators: undefined,
  integrity: false,
  coordMode: false,
  coordModeData: { },
  pointType: [
    { id: 0, name: 'Пункт на маршруті' },
    { id: 1, name: 'Пункт привалу' },
    { id: 2, name: 'Пункт денного (нічного) відпочинку' },
    { id: 3, name: 'Пункт добового відпочинку' },
    { id: 4, name: 'Рубіж регулювання' },
    { id: 5, name: 'Вихідний рубіж' },
  ],
  dataMarch: {
    vehiclesLength: 0,
    distanceVehicle: 50,
    distanceRots: 100,
    distanceBats: 2000,
    distanceBrg: 3000,
    distanceGslz: 3000,
    vehiclesCount: 1,
    rotsCount: 0,
    batsCount: 0,
    brgCount: 0,
    timeIncreaseFactor: 1,
    timeCorrectionFactor: 1,
    mountingFactor: 1,
    workInDarkFactor: 0,
    workInGasMasksFactor: 0,
    loadingTimes: [],
    uploadingTimes: [],
    intervalEchelon: 1,
    numberEchelons: 1,
    extractionInColumnFactor: 0.8,
    extractionColumnFactor: 0.7,
    pointRestTime: 1,
    dayNightRestTime: 8,
    dailyRestTime: 24,
  },
  segments: List([
    {
      name: 'Пункт відправлення',
      refPoint: 'База',
      segmentType: 41, // Своїм ходом
      terrain: 69, // Рівнинна
      velocity: 30,
      coord: {},
      required: true,
      editableName: false,
      children: [
        {
          pointType: 5, // Вихідний рубіж
          lineType: '',
          coord: {},
          refPoint: '',
          required: true,
          editableName: true,
          restTime: null,
        },
      ],
    },
    {
      segmentType: 0,
      coord: {},
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
  coord: {},
  required: false,
  editableName: false,
  // eslint-disable-next-line
  //children: [ ],
}

const defaultChild = {
  pointType: 0,
  lineType: '',
  coord: {},
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
