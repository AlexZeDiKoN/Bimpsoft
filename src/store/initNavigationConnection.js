import { createSelector } from 'reselect'
import navigationConnection from './navigationConnection'
import { webMap, /* maps as mapsActions, */ layers as layersActions } from './actions'

const crop = (value) => +value.toFixed(6)
const optionalProp = (obj, key, value) => value
  ? { ...obj, [key]: value }
  : obj
const optionalArray = (obj, key, array) => array && array.length
  ? { ...obj, [key]: array }
  : obj

const mapStateToProps = createSelector(
  (state) => state.webMap.center,
  (state) => state.webMap.zoom,
  (state) => Object.values(state.maps.byId).map(({ operationId: oid, mapId: mid }) => ({ oid, mid })),
  (state) => state.layers.selectedId,
  ({ lat, lng }, z, maps, layer) => ({
    pushProps: optionalArray({}, 'maps', maps),
    replaceProps: optionalProp({
      lat: crop(lat),
      lng: crop(lng),
      z,
    }, 'layer', layer),
  })
)

const onHistoryChange = async (prev, next, dispatch) => {
  if (next.lat && next.lng && next.z && (prev.lat !== next.lat || prev.lng !== next.lng || prev.z !== next.z)) {
    dispatch(webMap.setCenter({ lat: next.lat, lng: next.lng }, next.z))
  }
  if (next.layer && next.layer !== prev.layer) {
    await dispatch(layersActions.selectLayer(next.layer))
  }
  /* if (prev.maps !== next.maps) {
    const nextMaps = next.maps && next.maps.length ? next.maps.split('|') : []
    const prevMaps = prev.maps && prev.maps.length ? prev.maps.split('|') : []
    const nextMapsSet = new Set(nextMaps)
    const prevMapsSet = new Set(prevMaps)
    for (const map of nextMaps) {
      if (!prevMapsSet.has(map)) {
        const [ operationId = null, mapId = null ] = map.split(',')
        if (operationId !== null && mapId !== null) {
          await dispatch(mapsActions.openMapFolder(operationId, mapId))
        }
      }
    }
    for (const map of prevMaps) {
      if (!nextMapsSet.has(map)) {
        const [ operationId = null, mapId = null ] = map.split(',')
        if (operationId !== null && mapId !== null) {
          await dispatch(mapsActions.deleteMap(mapId))
        }
      }
    }
  } */
}

export default navigationConnection(mapStateToProps, onHistoryChange)
