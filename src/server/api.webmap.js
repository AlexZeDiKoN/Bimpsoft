import { getWebmapURL, getDirect } from './implementation/utils.rest'

const webmapUrl = getWebmapURL()

const WebmapApi = {
  objGetList,
  objUpdate,
  objUpdateGeometry,
  objInsert,
  objDelete,
  placeSearch,
}

export default WebmapApi

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

function placeSearch (sample) {
  return getDirect(`${webmapUrl}/place?q=${sample}`, false)
}
