import { getWebmapURL, getDirect } from './implementation/utils.rest'

const webmapUrl = getWebmapURL()

export default {
  objGetList: (layer = null) =>
    getDirect(`${webmapUrl}/obj/${layer}/get`, false),
  objUpdate: (id, data) =>
    getDirect(`${webmapUrl}/obj/set`, { id, ...data }),
  objUpdateGeometry: (id, data) =>
    getDirect(`${webmapUrl}/obj/geom`, { id, ...data }),
  objInsert: (data) =>
    getDirect(`${webmapUrl}/obj/add`, data),
  objDelete: (id = 0) =>
    getDirect(`${webmapUrl}/obj/${id}/del`, false),
  objRefresh: (id = 0) =>
    getDirect(`${webmapUrl}/obj/${id}/refresh`, false),
  objLock: (id = 0) =>
    getDirect(`${webmapUrl}/obj/${id}/lock`, false),
  objUnlock: (id = 0) =>
    getDirect(`${webmapUrl}/obj/${id}/unlock`, false),
  placeSearch: (sample) =>
    getDirect(`${webmapUrl}/place?q=${sample}`, false),
  getVersion: () =>
    getDirect(`${webmapUrl}/version`, false),
  getContactId: () =>
    getDirect(`${webmapUrl}/contactId`, false),
  paramGetAll: () =>
    getDirect(`${webmapUrl}/params`, false),
  paramGet: (name) =>
    getDirect(`${webmapUrl}/param/${name}/get`, false),
  paramSet: (name, value) =>
    getDirect(`${webmapUrl}/param/${name}/set`, { value }),
  getFlexGrid: (mapId) =>
    getDirect(`${webmapUrl}/grid/${mapId}/get`, false),
  lockedObjects: () =>
    getDirect(`${webmapUrl}/obj/locked`, false),
  getMapSources: () =>
    getDirect(`/tiles/index.json`, false, ''),
  printFileCreate: ({ dpi, northEast, southWest, svg, projectionGroup, printScale, mapName }) =>
    getDirect(`${webmapUrl}/printFile/add?dpi=${dpi}&northEastLat=${northEast.lat}&northEastLng=${northEast.lng}&southWestLat=${southWest.lat}&southWestLng=${southWest.lng}&projectionGroup=${projectionGroup}&scale=${printScale}&name=${mapName}`, svg, ''),
}
