import { action } from '../../utils/services'
import entityKind from '../../components/WebMap/entityKind'
import { activeMapSelector, visibleLayersSelector } from '../selectors'
import * as asyncAction from './asyncAction'
import * as maps from './maps'

export const DROP_FLEX_GRID = action('DROP_FLEX_GRID')
export const SHOW_FLEX_GRID_FORM = action('SHOW_FLEX_GRID_FORM')
export const HIDE_FLEX_GRID = action('HIDE_FLEX_GRID')
export const SET_DIRECTIONS = action('SET_DIRECTIONS')
export const SET_ZONES = action('SET_ZONES')
export const CLOSE_FLEX_GRID_FORM = action('CLOSE_FLEX_GRID_FORM')
export const FLEX_GRID_CREATED = action('FLEX_GRID_CREATED')
export const FLEX_GRID_DELETED = action('FLEX_GRID_DELETED')
export const GET_FLEXGRID = action('GET_FLEXGRID')

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
    dispatch({
      type: FLEX_GRID_CREATED,
    })
  })

export const flexGridChanged = (id, mapId, geometry, attributes) =>
  asyncAction.withNotification((dispatch, _, { webmapApi: { objUpdate } }) => objUpdate(id, {
    type: entityKind.FLEXGRID,
    layer: mapId,
    ...geometry,
    attributes,
  }))

export const flexGridDeleted = () => ({
  type: FLEX_GRID_DELETED,
})

export const getFlexGrid = (mapId, showFlexGrid) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { getFlexGrid } }) => dispatch({
    type: GET_FLEXGRID,
    payload: await getFlexGrid(mapId),
    showFlexGrid,
  }))

export const calcUnits = () => (dispatch, getState, { flexGridInstance }) => {
  const state = getState()
  const mapId = activeMapSelector(state)
  const variantId = state.maps.calc[mapId]
  if (variantId) {
    const layers = visibleLayersSelector(state)
    const objects = state.webMap.objects
      .filter(({ layer, type }) => Boolean(layers[layer]) && type === entityKind.POINT)
    // const units = state.orgStructures.unitsById
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
      objects.forEach(({ point, unit }) => {
        const cell = flexGridInstance.isInsideCell(point)
        if (cell) {
          const [ d, z ] = cell
          result
            .find(({ direction, zone }) => direction === d && zone === z)
            .units.push(unit)
        }
      })
    }
    console.info(result)
    window.explorerBridge.variantResult(variantId, result)
  }
  dispatch(maps.cancelVariant())
}

export const fixInstance = (flexGrid) => (_1, _2, extra) => {
  extra.flexGridInstance = flexGrid
}
