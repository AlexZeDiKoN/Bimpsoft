import { List } from 'immutable'
import { march } from '../actions'
import { uuid } from '../../components/WebMap/patch/Sophisticated/utils'
import { MARCH_POINT_TYPES as pointTypes } from '../../constants/March'
import i18n from './../../i18n'

const initState = {
  readOnly: false,
  isChanged: false,
  mapId: null,
  marchEdit: false,
  indicators: undefined,
  integrity: false,
  coordMode: false,
  coordModeData: { },
  geoLandmarks: {},
  isCoordFilled: false,
  activePoint: {
    segmentId: null,
    childId: null,
  },
  time: 0,
  distance: 0,
  coordRefPoint: null,
  pointsTypes: [
    { id: pointTypes.POINT_ON_MARCH, name: i18n.POINT_ON_MARCH },
    { id: pointTypes.REST_POINT, name: i18n.REST_POINT },
    { id: pointTypes.DAY_NIGHT_REST_POINT, name: i18n.DAY_NIGHT_REST_POINT },
    { id: pointTypes.DAILY_REST_POINT, name: i18n.DAILY_REST_POINT },
    { id: pointTypes.LINE_OF_REGULATION, name: i18n.LINE_OF_REGULATION },
    { id: pointTypes.INTERMEDIATE_POINT, name: i18n.POINT_ON_MARCH_INTERMEDIATE },
  ],
  pointsTypesM: new Map([
    [ pointTypes.POINT_ON_MARCH, { id: pointTypes.POINT_ON_MARCH, name: i18n.POINT_ON_MARCH } ],
    [ pointTypes.REST_POINT, { id: pointTypes.REST_POINT, name: i18n.REST_POINT } ],
    [ pointTypes.DAY_NIGHT_REST_POINT, { id: pointTypes.DAY_NIGHT_REST_POINT, name: i18n.DAY_NIGHT_REST_POINT } ],
    [ pointTypes.DAILY_REST_POINT, { id: pointTypes.DAILY_REST_POINT, name: i18n.DAILY_REST_POINT } ],
    [ pointTypes.LINE_OF_REGULATION, { id: pointTypes.LINE_OF_REGULATION, name: i18n.LINE_OF_REGULATION } ],
    [ pointTypes.INTERMEDIATE_POINT, { id: pointTypes.INTERMEDIATE_POINT, name: i18n.POINT_ON_MARCH_INTERMEDIATE } ],
  ]),
  payload: null,
  segments: List([]),
  existingSegmentsById: {},
  landmarks: [],
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
        const segments = template.map((item) => ({ showIntermediate: true, ...item, id: uuid() }))
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
    case march.SET_ROUTE:
      return { ...state, ...payload, isChanged: true }
    case march.INIT_MARCH:
      return { ...state, ...payload }
    case march.SET_COORD_MODE: {
      return { ...state, coordMode: !state.coordMode, coordModeData: payload }
    }
    case march.SET_REF_POINT_ON_MAP: {
      return { ...state, coordRefPoint: payload, isChanged: true }
    }
    case march.CLOSE_MARCH: {
      return { ...state, marchEdit: false, segments: List([]) }
    }
    case march.ADD_GEO_LANDMARK: {
      const { coordinates, geoLandmark, segmentId, childId } = payload

      const { lat, lng } = coordinates
      const geoKey = `${lat}:${lng}`

      let updateGeoLandmark = state.geoLandmarks[geoKey]

      if (Array.isArray(updateGeoLandmark)) {
        const filterLandmark = geoLandmark.trim().toUpperCase()

        for (let i = 0; i < updateGeoLandmark.length; i++) {
          const itemLandmark = updateGeoLandmark[i].propertiesText.trim().toUpperCase()

          if (itemLandmark === filterLandmark) {
            return state
          }
        }
      }

      const newGeoLandmark = {
        propertiesText: geoLandmark,
        geometry: {
          coordinates: [ null, null ],
        },
      }

      let updateSegments

      if (childId || childId === 0) {
        updateSegments = state.segments.update(segmentId, (segment) => ({
          ...segment,
          children: segment.children.map((it, id) => (id === childId) ? {
            ...it,
            refPoint: geoLandmark,
          } : it),
        }))
      } else {
        const children = state.segments.get(segmentId).children

        updateSegments = state.segments.update(segmentId, (segment) => {
          return {
            ...segment,
            refPoint: geoLandmark,
            children,
          }
        })
      }

      updateGeoLandmark = Array.isArray(updateGeoLandmark)
        ? [ newGeoLandmark, ...updateGeoLandmark ]
        : [ newGeoLandmark ]

      const updaterGeoLandmarks = { ...state.geoLandmarks }
      updaterGeoLandmarks[geoKey] = updateGeoLandmark

      return { ...state, segments: updateSegments, geoLandmarks: updaterGeoLandmarks, isChanged: true }
    }
    case march.SET_GEO_LANDMARKS:
    case march.SET_METRIC:
    case march.SET_ACTIVE_POINT: {
      return { ...state, ...payload }
    }
    case march.SET_VISIBLE_INTERMEDIATE: { // вкл./отк. отображения промежуточных точек маршрута на форме марша
      const { segmentId, visibleIntermediate } = payload
      const updateSegments = state.segments.update(segmentId, (segment) => {
        return {
          ...segment,
          showIntermediate: visibleIntermediate,
        }
      })
      return { ...state, segments: updateSegments }
    }
    default:
      return state
  }
}
