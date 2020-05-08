import { getDirect } from './implementation/utils.rest'

const webmapUrl = '/map'

export default {
  objGetList: (layer = null) =>
    getDirect(`${webmapUrl}/obj/${layer}/get`, false),
  objUpdate: (id, data) =>
    getDirect(`${webmapUrl}/obj/set`, { id, ...data }), // (1) Update entire object
  objUpdateGeometry: (id, data) =>
    getDirect(`${webmapUrl}/obj/geom`, { id, ...data }), // (2) Update object geometry only
  objUpdateAttr: (id, attributes) =>
    getDirect(`${webmapUrl}/obj/attr`, { id, attributes }), // (3) Update object attributes only
  objUpdatePartially: (id, data) =>
    getDirect(`${webmapUrl}/obj/upd`, { id, ...data }), // (4) Update object attributes and geometry only
  objInsert: (data) =>
    getDirect(`${webmapUrl}/obj/add`, data), // (5) Add new object
  objDelete: (id = 0) =>
    getDirect(`${webmapUrl}/obj/${id}/del`, false), // (6) Delete existing object
  objRestore: (id = 0) =>
    getDirect(`${webmapUrl}/obj/${id}/restore`, false),
  objDeleteList: (list = []) =>
    getDirect(`${webmapUrl}/obj/del`, { list }), // (7) Delete list of objects
  objRestoreList: (list = []) =>
    getDirect(`${webmapUrl}/obj/restore`, { list }),
  objRefresh: (id = 0) =>
    getDirect(`${webmapUrl}/obj/${id}/refresh`, false),
  objLock: (id = 0) =>
    getDirect(`${webmapUrl}/obj/${id}/lock`, false),
  objUnlock: (id = 0) =>
    getDirect(`${webmapUrl}/obj/${id}/unlock`, false),
  objStillLocked: (id = 0) =>
    getDirect(`${webmapUrl}/obj/${id}/still`, false),
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
  getMap: (mapId) =>
    getDirect(`${webmapUrl}/map/${mapId}`, false),
  layerGetColor: (layerId) =>
    getDirect(`${webmapUrl}/layer/${layerId}/color`, false),
  layerSetColor: (layerId, color) =>
    getDirect(`${webmapUrl}/layer/${layerId}/color`, { color }), // (8) Set Layer highlight color
  getMapSources: () =>
    getDirect(`/tiles/index.json`, false, ''),
  getPrintBounds: (data) =>
    getDirect(`${webmapUrl}/printToFile/getPrintBounds`, data),
  printFileCreate: ({ printBounds, scale, dpi, mapName, mapId, partsSvgs, legendSvg, requisites }) => {
    const formData = new FormData()
    partsSvgs.forEach((part, i) => {
      formData.append('SvgParts', new Blob([ part ], { type: 'text/html' }), `part${i}.svg`)
    })
    formData.append('legend', new Blob([ legendSvg ], { type: 'text/html' }), 'legend.svg')
    formData.append('params', JSON.stringify({ ...printBounds, scale, dpi, mapName, mapId, requisites }))
    return getDirect(`${webmapUrl}/printToFile/add`, formData, '')
  },
  printFileCancel: (id) =>
    getDirect(`${webmapUrl}/printToFile/cancel`, { id }),
  printFileRetry: (id) =>
    getDirect(`${webmapUrl}/printToFile/retry`, { id }),
  printFileList: () =>
    getDirect(`${webmapUrl}/printToFile/list`, false),
  getTopographicObjects: (data) =>
    getDirect(`${webmapUrl}/topographicObjects/list`, { data }),
  contourCreate: (layer, objects) =>
    getDirect(`${webmapUrl}/contour/create`, { layer, objects }), ///---(9)
  contourDelete: (layer, contour) =>
    getDirect(`${webmapUrl}/contour/drop`, { layer, contour }), ///---(10)
  contourCopy: (id, layer, shift) =>
    getDirect(`${webmapUrl}/contour/copy`, { id, layer, shift }), ///---(11)
  contourMove: (id, shift) =>
    getDirect(`${webmapUrl}/contour/move`, { id, shift }), ///---(12)
  objListMove: (ids, shift) =>
    getDirect(`${webmapUrl}/obj/move`, { ids, shift }), ///---(13)
  buildZone: (objects, enemy) =>
    getDirect(`${webmapUrl}/zone/build`, { objects, enemy }),
  groupCreate: (type, objects, layer, scale) =>
    getDirect(`${webmapUrl}/group/${type}/create`, { objects, layer, scale }), ///---(14)
  groupDrop: (group, layer) =>
    getDirect(`${webmapUrl}/group/drop`, { group, layer }), ///---(15)
  groupCopy: (id, layer, shift) =>
    getDirect(`${webmapUrl}/group/copy`, { id, layer, shift }), ///---(16)
  groupMove: (id, shift) =>
    getDirect(`${webmapUrl}/group/move`, { id, shift }), ///---(17)
}
