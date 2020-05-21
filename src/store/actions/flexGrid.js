import { action } from '../../utils/services'
import { getArrayFromSet } from '../../utils/immutable'
import entityKind from '../../components/WebMap/entityKind'
import { activeMapSelector, visibleLayersSelector, allUnits } from '../selectors'
import i18n from '../../i18n'
import * as asyncAction from './asyncAction'
import * as maps from './maps'
import * as webMap from './webMap'
import * as selection from './selection'
import * as notifications from './notifications'

export const DROP_FLEX_GRID = action('DROP_FLEX_GRID')
export const SHOW_FLEX_GRID_FORM = action('SHOW_FLEX_GRID_FORM')
export const HIDE_FLEX_GRID = action('HIDE_FLEX_GRID')
export const SET_DIRECTIONS = action('SET_DIRECTIONS')
export const SET_ZONES = action('SET_ZONES')
export const CLOSE_FLEX_GRID_FORM = action('CLOSE_FLEX_GRID_FORM')
export const FLEX_GRID_DELETED = action('FLEX_GRID_DELETED')
export const GET_FLEXGRID = action('GET_FLEXGRID')
export const SELECT_DIRECTION = action('SELECT_DIRECTION')
export const DESELECT_DIRECTION = action('DESELECT_DIRECTION')
export const SET_SELECT_ETERNAL = action('SET_SELECT_ETERNAL')
export const CHANGE_ETERNAL = action('CHANGE_ETERNAL')

const getId = ({ id }) => id

const findInGrid = (grid, testUnit, cellDirection, cellZone) => grid
  .filter(({ direction, zone }) => direction !== cellDirection || zone !== cellZone)
  .flatMap(({ units }) => units.filter(({ unit }) => unit === testUnit).map(getId))

const findInCell = (units, testUnit, formationId) => units
  .filter(({ unit, formation }) => unit === testUnit && formation !== formationId)
  .map(getId)

export const setFlexGridDirections = (value) => ({
  type: SET_DIRECTIONS,
  payload: value,
})

export const setFlexGridZones = (value) => ({
  type: SET_ZONES,
  payload: value,
})

export const dropFlexGrid = () => ({
  type: DROP_FLEX_GRID,
})

export const showFlexGridOptions = () => ({
  type: SHOW_FLEX_GRID_FORM,
})

export const hideFlexGrid = () => ({
  type: HIDE_FLEX_GRID,
})

export const closeForm = () => ({
  type: CLOSE_FLEX_GRID_FORM,
})

export const flexGridCreated = (mapId, geometry, attributes) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { objInsert } }) => {
    await objInsert({
      type: entityKind.FLEXGRID,
      layer: mapId,
      ...geometry,
      attributes,
    })
    return dispatch(getFlexGrid(mapId))
  })

export const flexGridChanged = (id, mapId, geometry, attributes) =>
  asyncAction.withNotification((dispatch, _, { webmapApi: { objUpdate } }) => {
    return objUpdate(id, {
      type: entityKind.FLEXGRID,
      layer: mapId,
      ...geometry,
      attributes,
    })
  })

export const flexGridDeleted = () => ({
  type: FLEX_GRID_DELETED,
})

export const getFlexGrid = (mapId, showFlexGrid) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { getFlexGrid } }) => dispatch({
    type: GET_FLEXGRID,
    payload: await getFlexGrid(mapId),
    showFlexGrid,
  }))

export const calcUnits = () => async (dispatch, getState, { flexGridInstance }) => {
  const edited = await window.webMap.checkSaveEditedObject()
  if (edited) {
    await webMap.refreshObject(edited)
  }
  let invalid = []
  const state = getState()
  const mapId = activeMapSelector(state)
  const units = allUnits(state)
  const variantId = state.maps.calc[mapId]
  if (variantId) {
    const layers = visibleLayersSelector(state)
    const objects = state.webMap.objects
      .filter(({ layer, type, unit }) =>
        type === entityKind.POINT &&
        Boolean(layers[layer]) &&
        Boolean(unit) &&
        Boolean(units[unit])) // Тут ми пересвідчуємося, що це саме підрозділ (а не командний пункт)
    const result = []
    if (flexGridInstance) {
      const { options: { directions, zones } } = flexGridInstance
      for (let i = 1; i <= directions; i++) {
        for (let j = -zones; j <= zones; j++) {
          if (j !== 0) {
            result.push({
              direction: i,
              zone: j,
              units: [],
            })
          }
        }
      }
      objects.forEach(({ id, point, unit, layer }) => {
        const cell = flexGridInstance.isInsideCell(point)
        if (cell) {
          const [ d, z ] = cell
          const { units } = result.find(({ direction, zone }) => direction === d && zone === z)
          const insideOtherCell = findInGrid(result, unit, d, z)
          const thisCellButOtherFormation = findInCell(units, unit, layers[layer].formationId)
          if (insideOtherCell.length || thisCellButOtherFormation.length) {
            invalid = invalid.concat(insideOtherCell, thisCellButOtherFormation, [ id ])
          } else if (!units.find((item) => item.unit === unit)) {
            units.push({
              id,
              unit,
              formation: layers[layer].formationId,
            })
          }
        }
      })
    }
    if (!invalid.length) {
      const { directionNames: names, directions } = state.flexGrid.flexGrid
      const units = result.map(({ units, ...rest }) => ({
        units: units.map(({ unit, formation }) => ({ unit, formation })),
        ...rest,
      }))
      const directionNames = getArrayFromSet(names, directions)
      window.explorerBridge.variantResult(variantId, { units, directionNames })
      dispatch(notifications.push({
        type: 'success',
        message: i18n.MESSAGE,
        description: i18n.SENT_TO_ICT,
      }))
    }
  }
  if (invalid.length) {
    dispatch(selection.selectedList(invalid))
    dispatch(notifications.push({
      type: 'error',
      message: i18n.ERROR,
      description: i18n.INVALID_UNITS_IN_GRID,
    }))
  } else {
    dispatch(maps.cancelVariant())
  }
}

export const fixInstance = (flexGrid) => (_1, _2, extra) => {
  extra.flexGridInstance = flexGrid
}

// Directions:
export const selectDirection = ({ index, isMain = true }) => ({
  type: SELECT_DIRECTION,
  payload: { index, isMain },
})

export const deselectDirection = (props) => {
  const res = { type: DESELECT_DIRECTION }
  if (props) {
    const { index, updateMain } = props
    res.payload = { index, updateMain }
  }
  return res
}

export const selectEternal = (props) => {
  const res = { type: SET_SELECT_ETERNAL }
  if (props) {
    const { position, coordinates } = props
    res.payload = { position, coordinates }
  }
  return res
}

export const changeEternal = (position, latlng) => ({
  type: CHANGE_ETERNAL,
  payload: { position, latlng },
})
