import { getWebmapURL, getDirect } from './implementation/utils.rest'

const webmapUrl = getWebmapURL()

export default {
  objGetList: (layer = null) =>
    getDirect(`${webmapUrl}/obj/${layer}/get`, false),
  objUpdate: (id, data) =>
    getDirect(`${webmapUrl}/obj/set`, { id, ...data }),
  objUpdateGeometry: (id, data) =>
    getDirect(`${webmapUrl}/obj/geom`, { id, ...data }),
  objUpdateAttr: (id, attributes) =>
    getDirect(`${webmapUrl}/obj/attr`, { id, attributes }),
  objUpdatePartially: (id, data) =>
    getDirect(`${webmapUrl}/obj/upd`, { id, ...data }),
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
    getDirect(`${webmapUrl}/layer/${layerId}/color`, { color }),
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
    getDirect(`${webmapUrl}/contour/create`, { layer, objects }),
  contourDelete: (layer, contour) =>
    getDirect(`${webmapUrl}/contour/drop`, { layer, contour }),
  contourCopy: (id, layer, shift) =>
    getDirect(`${webmapUrl}/contour/copy`, { id, layer, shift }),
  contourMove: (id, shift) =>
    getDirect(`${webmapUrl}/contour/move`, { id, shift }),
  objListMove: (ids, shift) =>
    getDirect(`${webmapUrl}/obj/move`, { ids, shift }),
}
