import { action } from '../../utils/services'
import entityKind from '../../components/WebMap/entityKind'
import * as asyncAction from './asyncAction'

export const DROP_FLEX_GRID = action('DROP_FLEX_GRID')
export const SHOW_FLEX_GRID_FORM = action('SHOW_FLEX_GRID_FORM')
export const HIDE_FLEX_GRID = action('HIDE_FLEX_GRID')
export const SET_DIRECTIONS = action('SET_DIRECTIONS')
export const SET_ZONES = action('SET_ZONES')
export const CLOSE_FLEX_GRID_FORM = action('CLOSE_FLEX_GRID_FORM')
export const FLEX_GRID_CREATED = action('FLEX_GRID_CREATED')
export const FLEX_GRID_DELETED = action('FLEX_GRID_DELETED')
export const GET_FLEXGRID = action('GET_FLEXGRID')
// export const FLEX_GRID_CALC_UNITS = action('FLEX_GRID_CALC_UNITS')

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

export const getFlexGrid = (mapId) =>
  asyncAction.withNotification(async (dispatch, _, { webmapApi: { getFlexGrid } }) => dispatch({
    type: GET_FLEXGRID,
    payload: await getFlexGrid(mapId),
  }))

export const calcUnits = () => (dispatch, getState, { flexGridInstance }) => {
  // const state = getState()
  // const objects = state.webMap.objects
  // const units = state.orgStructures.unitsById

}

export const fixInstance = (flexGrid) => (_1, _2, extra) => {
  extra.flexGridInstance = flexGrid
}
