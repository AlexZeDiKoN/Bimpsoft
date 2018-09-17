import { getWebmapURL, getDirect } from './implementation/utils.rest'

const webmapUrl = getWebmapURL()

export default {
  objGetList,
  objUpdate,
  objUpdateGeometry,
  objInsert,
  objDelete,
  objRefresh,
  placeSearch,
  layerGetColor,
  layerSetColor,
  getVersion,
}

function getVersion () {
  return getDirect(`${webmapUrl}/version`, false)
}

function objGetList (layer = null) {
  return getDirect(`${webmapUrl}/obj/${layer}/get`, false)
}

function objUpdate (id, data) {
  return getDirect(`${webmapUrl}/obj/set`, { id, ...data })
}

function objUpdateGeometry (id, data) {
  return getDirect(`${webmapUrl}/obj/geom`, { id, ...data })
}

function objInsert (data) {
  return getDirect(`${webmapUrl}/obj/add`, data)
}

function objDelete (id = 0) {
  return getDirect(`${webmapUrl}/obj/${id}/del`, false)
}

function objRefresh (id = 0) {
  return getDirect(`${webmapUrl}/obj/${id}/refresh`, false)
}

function placeSearch (sample) {
  return getDirect(`${webmapUrl}/place?q=${sample}`, false)
}

function layerGetColor (id) {
  return getDirect(`${webmapUrl}/color/${id}/get`, false)
}

function layerSetColor (id, color) {
  return getDirect(`${webmapUrl}/color/set`, { id, color })
}
