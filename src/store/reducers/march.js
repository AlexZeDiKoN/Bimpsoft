import { List } from 'immutable'
import { march } from '../actions'
import utilsMarch from '../../components/common/March/utilsMarch'

const { getDefaultMetric, getDefaultLoadUploadData, defaultChild, defaultSegment, uuid } = utilsMarch.reducersHelpers

const getMarchDetails = utilsMarch.formulas

/*
const updateMetric = (segments, state) => {
  const marchDetails = getMarchDetails(segments.toArray(), state.dataMarch)
  const { time, distance } = marchDetails

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
    time,
    distance,
  }
}
*/

const initState = {
  marchEdit: true,
  indicators: undefined,
  integrity: false,
  coordMode: false,
  coordModeData: { },
  time: 0,
  distance: 0,
  coordRefPoint: null,
  pointsTypes: [
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
      id: uuid(),
      name: 'Пункт відправлення',
      refPoint: 'База',
      segmentType: 41, // Своїм ходом
      terrain: 69, // Рівнинна
      velocity: 30,
      coordinate: {},
      required: true,
      editableName: false,
      metric: getDefaultMetric(),
      children: [
        {
          id: uuid(),
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
      loading: getDefaultLoadUploadData(),
      uploading: getDefaultLoadUploadData(),
    },
    {
      id: uuid(),
      segmentType: 0,
      coordinate: {},
      name: 'Пункт призначення',
      required: true,
      editableName: false,
      metric: getDefaultMetric(true),
    },
  ]),
  existingSegmentsById: {},
  landmarks: [],
}

const initStateEmpty = {
  marchEdit: true,
  indicators: undefined,
  integrity: false,
  coordMode: false,
  coordModeData: { },
  time: 0,
  distance: 0,
  coordRefPoint: null,
  pointsTypes: [
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

  segments: List([]),
  existingSegmentsById: {},
  landmarks: [],
}

export default function reducer (state = initStateEmpty, action) {
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
    case march.EDIT_FORM_FIELD:
    case march.ADD_SEGMENT:
    case march.DELETE_SEGMENT:
    case march.ADD_CHILD:
    case march.DELETE_CHILD:
    case march.SET_COORD_FROM_MAP:
    case march.INIT_MARCH:
      return { ...state, ...payload }
    case march.SET_COORD_MODE: {
      return { ...state, coordMode: !state.coordMode, coordModeData: payload }
    }
    case march.SET_REF_POINT_ON_MAP: {
      return { ...state, coordRefPoint: payload }
    }
    default:
      return state
  }
}
