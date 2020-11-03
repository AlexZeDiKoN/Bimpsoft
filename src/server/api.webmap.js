import { getDirect } from './implementation/utils.rest'

const webmapUrl = '/map'

export default {
  // API загального призначення
  getVersion: () =>
    getDirect(`${webmapUrl}/version`, false),
  getContactId: () =>
    getDirect(`${webmapUrl}/contactId`, false),
  getContactName: (contactId) =>
    getDirect(`${webmapUrl}/contact-name`, { contactId }),

  // API параметрів користувацьких налаштувань
  paramGetAll: () =>
    getDirect(`${webmapUrl}/params`, false),
  paramGet: (name) =>
    getDirect(`${webmapUrl}/param/${name}/get`, false),
  paramSet: (name, value) =>
    getDirect(`${webmapUrl}/param/${name}/set`, { value }),

  // API карт і шарів
  getMap: (mapId) =>
    getDirect(`${webmapUrl}/map/${mapId}`, false),
  layerGetColor: (layerId) =>
    getDirect(`${webmapUrl}/layer/${layerId}/color`, false),
  layerSetColor: (layerId, color) =>
    getDirect(`${webmapUrl}/layer/${layerId}/color`, { color }), // (8) Set Layer highlight color
  getFlexGrid: (mapId) =>
    getDirect(`${webmapUrl}/grid/${mapId}/get`, false),
  createCOPReport: (mapName, fromMapId, dateOn) =>
    getDirect(`${webmapUrl}/createCOPReport`, { mapName, dateOn, fromMapId }),
  heightProfile: (body) =>
    getDirect(`${webmapUrl}/heightProfile`, body),
  getBlindZone: (body) =>
    getDirect(`${webmapUrl}/blindZone`, body),

  // API тактичних знаків
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
  objRefreshFull: (id = 0) =>
    getDirect(`${webmapUrl}/obj/${id}/refresh-full`, false),
  objAccess: (id = 0) =>
    getDirect(`${webmapUrl}/obj/${id}/access`, false),
  objLock: (id = 0) =>
    getDirect(`${webmapUrl}/obj/${id}/lock`, false),
  objUnlock: (id = 0) =>
    getDirect(`${webmapUrl}/obj/${id}/unlock`, false),
  objStillLocked: (id = 0) =>
    getDirect(`${webmapUrl}/obj/${id}/still`, false),
  lockedObjects: () =>
    getDirect(`${webmapUrl}/obj/locked`, false),
  contourCreate: (layer, objects) =>
    getDirect(`${webmapUrl}/contour/create`, { layer, objects }), // (9) Create contour
  contourDelete: (layer, contour) =>
    getDirect(`${webmapUrl}/contour/drop`, { layer, contour }), // (10) Delete contour
  contourRestore: (layer, contour, objects) =>
    getDirect(`${webmapUrl}/contour/restore`, { layer, contour, objects }),
  contourCopy: (id, layer, shift) =>
    getDirect(`${webmapUrl}/contour/copy`, { id, layer, shift }), // (11) Copy contour
  contourMove: (id, shift) =>
    getDirect(`${webmapUrl}/contour/move`, { id, shift }), // (12) Move contour
  objListMove: (ids, shift) =>
    getDirect(`${webmapUrl}/obj/move`, { ids, shift }), // (13) Move list of objects
  buildZone: (objects, enemy) =>
    getDirect(`${webmapUrl}/zone/build`, { objects, enemy }),
  groupCreate: (type, objects, layer, scale) =>
    getDirect(`${webmapUrl}/group/${type}/create`, { objects, layer, scale }), /// (14) Create group
  groupDrop: (group, layer) =>
    getDirect(`${webmapUrl}/group/drop`, { group, layer }), /// (15) Drop group
  groupCopy: (id, layer, shift) =>
    getDirect(`${webmapUrl}/group/copy`, { id, layer, shift }), /// ---(16)
  groupMove: (id, shift) =>
    getDirect(`${webmapUrl}/group/move`, { id, shift }), /// ---(17)
  copyList: (fromLayer, toLayer, list) =>
    getDirect(`${webmapUrl}/obj/copy-list`, { fromLayer, toLayer, list }), /// ---(18)
  objRefreshList: (list, layer) =>
    getDirect(`${webmapUrl}/obj/refresh-list`, { list, layer }),
  groupRestore: (layer, group, objects) =>
    getDirect(`${webmapUrl}/group/restore`, { layer, group, objects }),

  // API друку карти
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
  printFileMapAvailability: (scale, coordinates) => // {"scale": 100000, "coordinates": [{"lat": 50, "lng": 31}, {"lat": 50, "lng": 32}, ...]}
    getDirect(`${webmapUrl}/printToFile/mapAvailability`, { scale, coordinates }), // {"unavailable":  [{"lat": 50, "lng": 31}, {"lat": 50, "lng": 32}]}
  getDefaultConfig: () =>
    getDirect(`${webmapUrl}/getDefaultConfig`, false),

  // API функцій картографії
  getMapSources: () =>
    getDirect(`/tiles/index.json`, false, ''),
  placeSearch: (sample) =>
    getDirect(`${webmapUrl}/place?q=${sample}`, false),
  nearestSettlement: ({ lat, lng }) => // coord = { lat, lng }
    getDirect(`${webmapUrl}/nearestSettlement`, { x: lng, y: lat }),
  getTopographicObjects: (data) =>
    getDirect(`${webmapUrl}/topographicObjects/list`, { data }),
  getHeight: (x, y) =>
    getDirect(`${webmapUrl}/height`, { x, y }),
}
