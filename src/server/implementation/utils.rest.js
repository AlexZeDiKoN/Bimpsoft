/* global Headers fetch */
import { getAdminApi, getExplorerApi, getMapApi, getWebmapApi, getServerUrl } from '../../utils/services'

const absoluteUri = new RegExp('^(http|https)://')

// export const serverUrl = `${explorerApi}/do`
const serverRootUrl = getServerUrl()
const explorerApi = serverRootUrl + getExplorerApi()
const mapApi = serverRootUrl + getMapApi()
const adminApi = serverRootUrl + getAdminApi()
const webmapApi = getWebmapApi()

/**
 * getDownloadURL
 * @param {number} id - documentID
 */
export function getDownloadURL (id) {
  return `${explorerApi}/file?id=${id}`
}

/**
 * /mapstate/v1/layers/{id}
 * @param {number} id
 * @returns {string}
 */
export function getLayerURL (id) {
  return `${mapApi}/exportLayer/${id}`
}

export function getMapURL (id) {
  return `${mapApi}/exportMap/${id}`
}

export function getWebmapURL () {
  return webmapApi
}

export async function get (url, entityID) {
  const options = _getOptions('GET')
  const fullUrl = entityID ? url + '/' + entityID : url
  return _createGetRequest(fullUrl, options)
}

export async function put (url, data) {
  const options = _getOptions('PUT')
  if (data) {
    options.body = JSON.stringify(data)
  }
  return _createGetRequest(url, options)
}

export function getVersionUrl () {
  return `${adminApi}/version`
}

/**
 *
 * @param {string} url
 * @param {Object} data
 * @param {string} route
 * @returns {Promise<any>}
 */
export async function post (url, data = {}, route = '/do', namespace) {
  const options = _getOptions('POST')
  /** @type{server.ServerRequest} */
  const request = {
    operation: url,
    payload: !data ? null : JSON.stringify(data),
  }
  options.body = JSON.stringify(request)
  return _createRequest(route, options, namespace ? (serverRootUrl + namespace) : undefined)
}

export async function getDirect (url, data = {}) {
  const options = _getOptions(data ? 'POST' : 'GET')
  if (data) {
    options.body = JSON.stringify(data)
  }
  return _createRequest(url, options)
}

/* export function getFileBlob (url, id) {
  return _getBlob(url, id)
} */

function _getOptions (method) {
  // const myHeaders = _getDefaultHeaders(method === 'POST')
  return {
    mode: 'cors',
    credentials: 'include',
    method,
    headers: _getDefaultHeaders(),
  }
}

function _getDefaultHeaders (addContentType = true) {
  const myHeaders = new Headers()
  if (addContentType) {
    myHeaders.append('Content-Type', 'application/json;charset=UTF-8')
  }
  return myHeaders
}

/**
 * @param {string} url
 * @param option
 * @returns {Promise<any>}
 * @private
 */
function _createGetRequest (url, option) {
  return new Promise((resolve, reject) => {
    const serviceUrl = serverRootUrl + url

    fetch(serviceUrl, option)
      .then((resp) => {
        if (resp.status === 200) {
          return resp.json()
        } else if (resp.status === 204) {
          // success code of DELETE request
          return Promise.resolve(null)
        } else if (resp.status === 401) {
          reject(new Error('Доступ заборонено'))
        } else {
          reject(new Error('Сервер не доступний'))
        }
      })
      .then((data) => {
        resolve(data)
      })
      .catch((error) => {
        reject(error.message)
      })
  })
}

/**
 *
 * @param {string} url
 * @param option
 * @returns {Promise<*>}
 * @private
 */
async function _createRequest (url, option, namespace = explorerApi) {
  const serviceUrl = absoluteUri.test(url) ? url : namespace + url
  const response = await fetch(serviceUrl, option)
  switch (response.status) {
    case 200: {
      if (response.headers.get('content-type').slice(0, 16) === 'application/json') {
        /** @type{server.ServerResponse} */
        const jsonPayload = await response.json()
        if (jsonPayload.payload) {
          return JSON.parse(jsonPayload.payload)
        } else {
          return jsonPayload
        }
      }
      return response.text()
    }
    case 204: // success code of DELETE request
      return null
    case 401:
      throw new Error('Доступ заборонено')
    default:
      throw new Error(`Сервер недоступний (${response.status}) (URL: ${serviceUrl})`)
  }
}

/* function _getBlob (url, entityID) {
  return new Promise((resolve, reject) => {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json;charset=UTF-8')
    fetch(`${serverRootUrl}/${url}/?id=${entityID}`, {
      credentials: 'include',
      method: 'GET',
      headers,
    }).then((resp) => {
      if (resp.status === 200) {
        return resp.blob()
      } else if (resp.status === 401) {
        reject(new Error('Доступ заборонено'))
      } else {
        reject(new Error('Сервер недоступнний'))
      }
    }).then((data) => {
      resolve(data)
    }).catch((error) => {
      reject(error.message)
    })
  })
} */
