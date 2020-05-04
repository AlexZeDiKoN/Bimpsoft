import { List } from 'immutable'
import { march } from '../actions'
import utilsMarch from '../../components/common/March/utilsMarch'

const getMarchDetails = utilsMarch.formulas

const updateMetric = (segments, state) => {
  const marchDetails = getMarchDetails(segments.toArray(), state.dataMarch)
  const { totalMarchTime, totalMarchDistance } = marchDetails

  const segmentsWithUpdateMetrics = segments.map((segment, id) => {
    segment.metric = { ...marchDetails.segments[id] }

    segment.children = segment.children && segment.children.map((child, childId) => {
      child.metric = marchDetails.segments[id].childSegments[childId]
      return child
    })

    return segment
  })

  return {
    segments: segmentsWithUpdateMetrics,
    totalMarchTime,
    totalMarchDistance,
  }
}

const getDefaultMetric = (emptyChild = false) => {
  return {
    totalTime: 0,
    totalDistance: 0,
    childSegments: emptyChild ? [] : [ { distance: 0, time: 0 } ],
    referenceData: { time: 0, distance: 0 },
    untilPreviousSegment: { time: 0, distance: 0 },
    untilNextSegment: { time: 0, distance: 0 },
  }
}

const initState = {
  marchEdit: true,
  indicators: undefined,
  integrity: false,
  coordMode: false,
  coordModeData: { },
  totalMarchTime: 0,
  totalMarchDistance: 0,
  coordRefPoint: null,
  pointType: [
    { id: 0, name: 'Пункт на маршруті' },
    { id: 1, name: 'Пункт привалу' },
    { id: 2, name: 'Пункт денного (нічного) відпочинку' },
    { id: 3, name: 'Пункт добового відпочинку' },
    { id: 4, name: 'Рубіж регулювання' },
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
    pointRestTime: 1, // hour
    dayNightRestTime: 8, // hour
    dailyRestTime: 24, // hour
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
      metric: getDefaultMetric(),
      children: [
        {
          pointType: 5, // Вихідний рубіж
          lineType: '',
          coord: {},
          refPoint: '',
          required: true,
          editableName: true,
          restTime: 0,
          metric: {
            time: 0,
            distance: 0,
          },
        },
      ],
    },
    {
      segmentType: 0,
      coord: {},
      name: 'Пункт призначення',
      required: true,
      editableName: false,
      metric: getDefaultMetric(true),
    },
  ]),
  existingSegmentsById: {},
  landmarks: [],
}

const defaultSegment = () => ({
  name: '',
  refPoint: '',
  segmentType: 41, // Своїм ходом
  terrain: 69, // Рівнинна
  velocity: 30,
  coord: {},
  required: false,
  editableName: false,
  metric: getDefaultMetric(),
  children: [ defaultChild() ],
})

const defaultChild = () => ({
  pointType: 0,
  lineType: '',
  coord: {},
  refPoint: '',
  required: false,
  editableName: true,
  restTime: 0,
  metric: {
    time: 0,
    distance: 0,
  },
})

// eslint-disable-next-line
export const uuid = () => ([ 1e7 ] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16))

const editFormField = (state, payload) => {
  const { segmentId, childId } = payload
  let { val, fieldName } = payload

  if (!Array.isArray(fieldName)) {
    fieldName = [ fieldName ]
    val = [ val ]
  }
  if (fieldName.length !== val.length) {
    return state
  }

  let newSegments = state.segments

  for (let i = 0; i < fieldName.length; i++) {
    if (childId || childId === 0) {
      newSegments = newSegments.update(segmentId, (segment) => ({
        ...segment,
        children: segment.children.map((it, id) => (id === childId) ? { ...it, [fieldName[i]]: val[i] } : it),
      }))
    } else {
      newSegments = newSegments.update(segmentId, (segment) => ({ ...segment, [fieldName[i]]: val[i] }))
    }
  }

  const { segments, totalMarchTime, totalMarchDistance } = updateMetric(newSegments, state)

  return {
    ...state,
    segments,
    coordMode: false,
    totalMarchTime,
    totalMarchDistance,
  }
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
      const updateSegments = state.segments.insert(payload + 1, defaultSegment())
      const { segments, totalMarchTime, totalMarchDistance } = updateMetric(updateSegments, state)

      return { ...state, segments, totalMarchTime, totalMarchDistance }
    }
    case march.DELETE_SEGMENT: {
      const updateSegments = state.segments.delete(payload)
      const { segments, totalMarchTime, totalMarchDistance } = updateMetric(updateSegments, state)

      return { ...state, segments, totalMarchTime, totalMarchDistance }
    }
    case march.ADD_CHILD: {
      const { segmentId, childId } = payload
      const children = state.segments.get(segmentId).children

      children.splice((childId || childId === 0) ? childId + 1 : 0, 0, defaultChild())

      const updateSegments = state.segments.update(segmentId, (segment) => ({
        ...segment,
        children,
      }))

      const { segments, totalMarchTime, totalMarchDistance } = updateMetric(updateSegments, state)

      return { ...state, segments, totalMarchTime, totalMarchDistance }
    }
    case march.DELETE_CHILD: {
      const { segmentId, childId } = payload
      const children = state.segments.get(segmentId).children

      children.splice(childId, 1)

      const updateSegments = state.segments.update(segmentId, (segment) => ({
        ...segment,
        children,
      }))

      const { segments, totalMarchTime, totalMarchDistance } = updateMetric(updateSegments, state)

      return { ...state, segments, totalMarchTime, totalMarchDistance }
    }
    case march.SET_COORD_MODE: {
      return { ...state, coordMode: !state.coordMode, coordModeData: payload }
    }
    case march.SET_COORD_FROM_MAP: {
      const { coordModeData: data } = state

      return editFormField(state, { ...data, val: payload, fieldName: 'coord' })
    }
    case march.SET_REF_POINT_ON_MAP: {
      return { ...state, coordRefPoint: payload }
    }
    default:
      return state
  }
}
