import { getWebmapURL, getDirect } from './implementation/utils.rest'

const webmapUrl = getWebmapURL()

const WebmapApi = {
  objGetList,
  objUpdate,
  objInsert,
  objDelete,
}

export default WebmapApi

function objGetList (layer = null) {
  return getDirect(`${webmapUrl}/${layer}/get`)
}

function objUpdate (id, data) {
  return getDirect(`${webmapUrl}/set`, { id, ...data })
}

function objInsert (data) {
  return getDirect(`${webmapUrl}/add`, data)
}

function objDelete (id = 0) {
  return getDirect(`${webmapUrl}/${id}/del`)
}
