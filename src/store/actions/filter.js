import { List } from 'immutable'
import { utils } from '@C4/CommonComponents'
import * as R from 'ramda'
import L from 'leaflet'
import cloneDeep from 'lodash/cloneDeep'
import { action } from '../../utils/services'
import { MIL_SYMBOL_FILTER_TYPE, TOPOGRAPHIC_OBJECT_FILTER_TYPE } from '../../constants/modals'
import {
  LOADING,
  LOADING_TOPOGRAPHIC_OBJECT,
  MIL_SYMBOL_FILTER,
  SEARCH_FILTER,
  SEARCH_TOPOGRAPHIC_FILTER,
  TOPOGRAPHIC_OBJECT_FILTER,
} from '../../constants/filter'
import {
  flexGridPresent,
  getCatalogMetaLayers,
  getFilteredObjects,
  getModalData,
  isCatalogLayerFunc,
  milSymbolFilters,
  selectedLayerId,
  topographicObjectsFilters,
} from '../selectors'
import { WebMapAttributes, WebMapObject } from '../reducers/webMap'
import SelectionTypes from '../../constants/SelectionTypes'
import { catalogsTopographicByIds } from '../selectors/catalogs'
import { IS_OPERATION_ZONE } from '../../components/Filter/Modals/TopographicObjectModal'
import { prepareBezierPathToGeometry } from '../../components/WebMap/patch/utils/Bezier'
import { TopoObj } from '../../constants'
import { setModalData, close } from './task'
import { copyList } from './webMap'
import { getCatalogAttributesFields, onExpandTopographicItem, setTopographicObjectByIds } from './catalogs'
import { asyncAction, layers } from './index'

const { vld } = utils

export const MERGE_FILTERS = action('MERGE_FILTERS')
export const mergeFilter = (name, value, index) => ({ type: MERGE_FILTERS, payload: { name, value, index } })
export const mergeMilSymbolFilter = mergeFilter.bind(null, MIL_SYMBOL_FILTER)
export const setTopographicObjectFilters = mergeFilter.bind(null, TOPOGRAPHIC_OBJECT_FILTER)
export const setLoadingTopographicObjects = mergeFilter.bind(null, LOADING_TOPOGRAPHIC_OBJECT)

export const REMOVE_FILTER = action('REMOVE_FILTER')
export const removeFilter = (name, value) => ({ type: REMOVE_FILTER, payload: { name, value } })
export const removeFilterTopographicObjects = removeFilter.bind(null, TOPOGRAPHIC_OBJECT_FILTER)

export const SET_FILTERS = action('SET_FILTERS')
export const setFilter = (name, value) => ({ type: SET_FILTERS, payload: { name, value } })
export const setSearchFilter = setFilter.bind(null, SEARCH_FILTER)
export const setSearchTopographicFilter = setFilter.bind(null, SEARCH_TOPOGRAPHIC_FILTER)
export const setMilSymbolFilter = setFilter.bind(null, MIL_SYMBOL_FILTER)
export const setLoading = setFilter.bind(null, LOADING)

export const openModalTopographicFilter = (id) => (dispatch) =>
  dispatch(setModalData({ type: TOPOGRAPHIC_OBJECT_FILTER_TYPE, id }))

export const openMilSymbolModal = (index) => asyncAction.withNotification(async (dispatch, getState) => {
  const state = getState()
  const selectedLayer = selectedLayerId(state)
  const isLayerCatalog = isCatalogLayerFunc(state)(selectedLayer)
  let defaultProps = { type: SelectionTypes.POINT, code: '10000000000000000000', attributes: {} }
  if (isLayerCatalog) {
    await dispatch(getCatalogAttributesFields(selectedLayer))
    defaultProps = { ...defaultProps, ...getCatalogMetaLayers(state)[selectedLayer] }
  }
  typeof index === 'number'
    ? dispatch(setModalData({
      ...milSymbolFilters(state)[index],
      type: MIL_SYMBOL_FILTER_TYPE,
      isNew: false,
      index,
    }))
    : dispatch(setModalData({
      type: MIL_SYMBOL_FILTER_TYPE,
      isNew: true,
      inCurrentLayer: false,
      visible: true,
      name: null,
      data: new WebMapObject({
        type: defaultProps.type,
        code: defaultProps.code,
        layer: selectedLayer,
        geometry: List([ ]),
        attributes: WebMapAttributes(defaultProps.attributes),
      }),
    }))
})

export const onSaveMilSymbolFilters = (data) => (dispatch, getState) => {
  const validation = vld.validate({ name: R.pipe(vld.defined, vld.notNull, vld.text(1, 200)) }, data)
  if (!vld.isValid(validation)) {
    return { errors: { name: true } }
  }
  const state = getState()
  const { index, visible } = getModalData(state)
  dispatch(mergeMilSymbolFilter({ ...data, visible }, index))
  dispatch(close())
}

export const onRemoveMilSymbolFilter = () => (dispatch, getState) => {
  const state = getState()
  const { index } = getModalData(state)
  const filters = milSymbolFilters(state).filter((_, curIndex) => curIndex !== index)
  dispatch(setMilSymbolFilter(filters))
  dispatch(close())
}

export const onChangeMilSymbolVisible = (visible, index) => (dispatch, getState) => {
  const state = getState()
  const dataList = milSymbolFilters(state) ?? []
  typeof index === 'number'
    ? dispatch(mergeMilSymbolFilter({ ...dataList[index], visible }, index))
    : dispatch(setMilSymbolFilter(dataList.map((data) => ({ ...data, visible }))))
}

export const onCreateLayerAndCopyUnits = (data) => asyncAction.withNotification(async (dispatch, getState) => {
  dispatch(setLoading(true))
  const result = await dispatch(layers.createLayer(data))
  if (result.success) {
    const state = getState()
    const toLayer = result.payload
    const points = getFilteredObjects(state)
      .filter((item) => item.type === SelectionTypes.POINT)
      .map((item) => item?.toJS ? item?.toJS() : item)
    const layersIds = points.reduce((acc, current) => {
      const sendObj = { type: SelectionTypes.POINT, data: current }
      const layerData = acc[current.layer] ? [ ...acc[current.layer], sendObj ] : [ sendObj ]
      return { ...acc, [current.layer]: layerData }
    }, {})
    await Promise.all(
      Object.entries(layersIds).map(([ fromLayer, ids ]) => dispatch(copyList(fromLayer, toLayer, ids))),
    )
    dispatch(close())
  } else {
    return result
  }
  dispatch(setLoading(false))
})

const onShowTopographicItem = (shown, id) => (dispatch, getState) => {
  const state = getState()
  const byIds = catalogsTopographicByIds(state)
  const result = id
    ? { ...byIds, [id]: { ...byIds[id], shown } }
    : Object.fromEntries(Object.entries(byIds)
      .map(([ id, data ]) => [ id, { ...data, shown } ]),
    )
  dispatch(setTopographicObjectByIds(result))
}

export const onClickVisibleTopographicObject = (shown, id) => asyncAction.withNotification(
  async (dispatch, getState) => {
    const state = getState()
    const filtersData = topographicObjectsFilters(state)[id]
    if (shown && !filtersData?.filters) {
      !filtersData?.filters && await dispatch(loadTopographicObjectById(id))
      dispatch(onExpandTopographicItem(id, true))
    } else if (!shown && !filtersData?.filters) {
      dispatch(setTopographicObjectFilters({ [id]: { ...filtersData, objects: [] } }))
      dispatch(onExpandTopographicItem(id, false))
    }
    dispatch(onShowTopographicItem(shown, id))
  })

export const onSaveTopographicObjectFilter = (filters) => (dispatch, getState) => {
  const state = getState()
  const { id } = getModalData(state)
  Object.keys(filters).length
    ? dispatch(setTopographicObjectFilters({ [id]: { filters } }))
    : dispatch(removeFilterTopographicObjects(id))
  dispatch(loadTopographicObjectById(id))
  dispatch(onShowTopographicItem(true, id))
  dispatch(onExpandTopographicItem(id, true))
  dispatch(close())
}

const setAttributesName = (topocodeData, objects) => objects.map(({ properties: prop, ...rest }) => {
  const properties = Object.fromEntries(topocodeData.attributes.map(({ id, name, value }) => {
    const isSelectValue = Array.isArray(value)
    const textValue = isSelectValue ? value.find(({ id: valueId }) => valueId === prop[id])?.name ?? '' : prop[id]
    return [ name, textValue ]
  }))
  properties[TopoObj.OBJECT_TYPE] = topocodeData.name
  properties[TopoObj.TOPCODE] = topocodeData.id
  return { ...rest, properties }
})

const loadTopographicObjectById = (topocode) => asyncAction.withNotification(
  async (dispatch, getState, { catalogApi }) => {
    dispatch(setLoadingTopographicObjects({ [topocode]: true }))
    const state = getState()
    const filtersData = topographicObjectsFilters(state)[topocode]
    const filters = { ...filtersData?.filters }
    let points
    if (filters[IS_OPERATION_ZONE] && flexGridPresent(state)) {
      const layerPointToLatLng = window.webMap.map.layerPointToLatLng.bind(window.webMap.map)
      const isFlexGridInit = window.webMap.flexGrid._leaflet_id
      const flexGrid = isFlexGridInit ? window.webMap.flexGrid : cloneDeep(window.webMap.flexGrid)
      if (!isFlexGridInit) {
        const latLngToLayerPoint = window.webMap.map.latLngToLayerPoint.bind(window.webMap.map)
        const render = {
          _layers: {},
          ...L.SVG.prototype,
        }
        render._initFlexGrid(flexGrid)
        flexGrid._map = { latLngToLayerPoint }
        flexGrid._project()
      }
      const layerPoints = prepareBezierPathToGeometry(flexGrid._borderLine())
      points = layerPoints.map(layerPointToLatLng)
    } else {
      const { _southWest: firstPoint, _northEast: secondPoint } = window.webMap?.getBoundsMap() || state.webMap.bounds
      points = [ firstPoint, secondPoint ]
    }
    delete filters[IS_OPERATION_ZONE]
    const objects = await catalogApi.getTopographicObjects({ topocode, points, zoom: state.webMap.zoom, filters })
      .then((objects) => setAttributesName(catalogsTopographicByIds(state)[topocode], objects))
      .finally(() => { dispatch(setLoadingTopographicObjects({ [topocode]: false })) })
    dispatch(setTopographicObjectFilters({ [topocode]: { ...filtersData, objects } }))
  })

export const onRemoveTopographicObjectFilter = () => (dispatch, getState) => {
  const { id: topocode } = getModalData(getState())
  dispatch(onShowTopographicItem(false, topocode))
  dispatch(onExpandTopographicItem(topocode, false))
  dispatch(removeFilterTopographicObjects(topocode))
  dispatch(close())
}
