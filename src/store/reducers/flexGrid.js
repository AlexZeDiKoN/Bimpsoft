import { List, Record } from 'immutable'
import * as actions from '../actions/flexGrid'
import { merge, update } from '../../utils/immutable'

const MIN_DIRECTIONS = 1
const DEF_DIRECTIONS = 3
const MAX_DIRECTIONS = 10

const HAS_ZONES = 3
const HASNT_ZONES = 1

const FlexGrid = Record({
  id: null,
  deleted: null,
  eternals: List(),
  directionSegments: List(),
  zoneSegments: List(),
  directions: DEF_DIRECTIONS,
  zones: HAS_ZONES,
})

const FlexGridState = Record({
  options: false,
  visible: false,
  vertical: false,
  present: false,
  flexGrid: FlexGrid(),
})

export default function reducer (state = FlexGridState(), action) {
  const { type, payload, showFlexGrid } = action
  switch (type) {
    case actions.DROP_FLEX_GRID: {
      return merge(state, {
        options: false,
        visible: true,
      })
    }
    case actions.SET_DIRECTIONS: {
      let directions = Number(payload)
      if (isNaN(directions) || directions < MIN_DIRECTIONS || directions > MAX_DIRECTIONS) {
        directions = DEF_DIRECTIONS
      }
      return update(state, 'flexGrid', merge, { directions })
    }
    case actions.SET_ZONES: {
      const zones = payload ? HAS_ZONES : HASNT_ZONES
      return update(state, 'flexGrid', merge, { zones })
    }
    case actions.FLEX_GRID_DELETED: {
      return merge(state, {
        present: false,
        visible: false,
      })
    }
    case actions.SHOW_FLEX_GRID_FORM: {
      const delta = state.present
        ? { visible: true }
        : { options: true }
      return merge(state, delta)
    }
    case actions.HIDE_FLEX_GRID: {
      return update(state, 'visible', false)
    }
    case actions.CLOSE_FLEX_GRID_FORM: {
      return update(state, 'options', false)
    }
    case actions.GET_FLEXGRID: {
      if (payload) { // Без цієї умови деструктуризація нижче кине ексепш
        const {
          id,
          deleted,
          attributes: { directions, zones },
          geometry: [ eternals, directionSegments, zoneSegments ],
        } = payload
        return payload
          ? update(merge(state, {
            present: !deleted,
            visible: (showFlexGrid || state.visible) && !deleted,
          }), 'flexGrid', merge, {
            id,
            deleted,
            directions,
            zones,
            eternals: List(eternals),
            directionSegments: List(directionSegments),
            zoneSegments: List(zoneSegments),
          })
          : merge(state, {
            visible: false,
            present: false,
            flexGrid: FlexGrid(),
          })
      } else {
        return merge(state, {
          visible: false,
          present: false,
          flexGrid: FlexGrid(),
        })
      }
    }
    default:
      return state
  }
}
