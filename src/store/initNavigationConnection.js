import { createSelector } from 'reselect'
import navigationConnection from './navigationConnection'
import { webMap, maps as mapsActions, layers as layersActions } from './actions'
import { catchError } from './actions/asyncAction'

const crop = (value) => Number(value).toFixed(6)
const optionalProp = (obj, key, value) => value
  ? { ...obj, [key]: value }
  : obj
const optionalArray = (obj, key, array, pack) => array && array.length
  ? { ...obj, [key]: pack ? pack(array) : array }
  : obj
const packMaps = (expandedMaps) => (maps) => maps
  .map(({ mapId }) => `${mapId},${expandedMaps.hasOwnProperty(mapId) ? 'o' : 'c'}`)
  .join(';')
const unpackMaps = (maps) => maps && maps.length
  ? maps
    .split(';')
    .map((map) => {
      const [ mapId = null, expanded ] = map.split(',')
      return { mapId, expanded: expanded === 'o' }
    })
    .filter(({ mapId }) => mapId !== null)
  : []
const findMap = (sample) => (map) => map.mapId === sample.mapId

const mapStateToProps = createSelector(
  (state) => state.webMap.center,
  (state) => state.webMap.zoom,
  (state) => Object.values(state.maps.byId),
  (state) => state.maps.expandedIds,
  (state) => state.layers.selectedId,
  ({ lat, lng }, z, maps, expandedMaps, layer) => ({
    pushProps: optionalArray({}, 'maps', maps, packMaps(expandedMaps)),
    replaceProps: optionalProp({
      lat: +crop(lat),
      lng: +crop(lng),
      z,
    }, 'layer', layer),
  }),
)

const onHistoryChange = async (prev, next, dispatch) => {
  if (next.lat && next.lng && next.z && (prev.lat !== next.lat || prev.lng !== next.lng || prev.z !== next.z)) {
    await catchError(webMap.setCenter)({ lat: +next.lat, lng: +next.lng }, +next.z)(dispatch)
  }
  if (prev.maps !== next.maps) {
    catchError(mapsActions.setStatusMapLoading)()(dispatch)
    const nextMaps = unpackMaps(next.maps)
    const prevMaps = unpackMaps(prev.maps)
    for (const map of nextMaps) {
      const prevMap = prevMaps.find(findMap(map))
      if (!prevMap) {
        await catchError(mapsActions.openMapFolder)(map.mapId, next.layer)(dispatch)
      }
      if (!prevMap || map.expanded !== prevMap.expanded) {
        await catchError(mapsActions.expandMap)(map.mapId, map.expanded)(dispatch)
      }
    }
    for (const map of prevMaps) {
      if (!nextMaps.find(findMap(map))) {
        await catchError(mapsActions.deleteMap)(map.mapId)(dispatch)
      }
    }
    catchError(mapsActions.setStatusMapLoading)(false)(dispatch)
  }
  if (next.layer && next.layer !== prev.layer) {
    await catchError(layersActions.selectLayer)(next.layer)(dispatch)
  }
}

export default navigationConnection(mapStateToProps, onHistoryChange)
