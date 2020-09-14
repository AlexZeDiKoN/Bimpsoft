import { List, Record, Set } from 'immutable'
import * as actions from '../actions/flexGrid'
import { merge, update } from '../../utils/immutable'

const MIN_DIRECTIONS = 1
const DEF_DIRECTIONS = 3
export const MAX_DIRECTIONS = 10

const HAS_ZONES = 3
const HASNT_ZONES = 1

const FlexGrid = Record({
  id: null,
  deleted: null,
  eternals: List(),
  directionSegments: List(),
  zoneSegments: List(),
  directions: DEF_DIRECTIONS,
  directionNames: List(),
  mainDirectionSigns: List(),
  eternalDescriptions: List(),
  zones: HAS_ZONES,
})

const SelectedDirections = Record({
  list: Set(),
  main: null,
})

const SelectedEternal = Record({
  position: undefined,
  coordinates: undefined,
})

const FlexGridState = Record({
  options: false,
  visible: false,
  vertical: false,
  present: false,
  selectedDirections: SelectedDirections(),
  selectedEternal: SelectedEternal(),
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
      if (payload && typeof payload !== 'string') { // Без цієї умови деструктуризація нижче кине ексепш
        const {
          id,
          deleted,
          attributes: {
            directions,
            zones,
            directionNames = [],
            mainDirectionSigns = [],
            eternalDescriptions = [],
          } = {},
          geometry: [ eternals, directionSegments, zoneSegments ] = [],
        } = payload
        return update(merge(state, {
          present: !deleted,
          visible: (showFlexGrid || state.visible) && !deleted,
        }), 'flexGrid', merge, {
          id,
          deleted,
          directions: deleted ? DEF_DIRECTIONS : directions,
          zones,
          eternals: List(eternals),
          directionSegments: List(directionSegments),
          directionNames: List(directionNames),
          mainDirectionSigns: List(mainDirectionSigns),
          eternalDescriptions: List(eternalDescriptions),
          zoneSegments: List(zoneSegments),
        })
      } else {
        return merge(state, {
          visible: false,
          present: false,
          flexGrid: FlexGrid(),
        })
      }
    }
    case actions.SELECT_DIRECTION: {
      const { selectedDirections: { list, main } } = state
      const { index, isMain } = payload
      const updaterObj = { list: list.add(index), main: isMain ? index : main }
      return update(state, 'selectedDirections', merge, updaterObj)
    }
    case actions.DESELECT_DIRECTION: {
      const { selectedDirections: { list, main } } = state
      const updaterObj = {}
      if (payload) {
        const { index, updateMain } = payload
        updaterObj.list = list.delete(index)
        updaterObj.main = updateMain || main
      } else {
        updaterObj.list = list.clear()
        updaterObj.main = null
      }
      return update(state, 'selectedDirections', merge, updaterObj)
    }
    case actions.SET_SELECT_ETERNAL: {
      return update(state, 'selectedEternal', payload || { position: undefined, coordinates: undefined })
    }
    case actions.CHANGE_ETERNAL: {
      const { eternals } = state.flexGrid
      const { position, latlng } = payload
      const [ dIndex, zIndex ] = position
      const line = [ ...eternals.get(dIndex, []) ]
      line[zIndex] = latlng
      return update(state, 'flexGrid', merge, { eternals: update(eternals, dIndex, line) })
    }
    default:
      return state
  }
}
