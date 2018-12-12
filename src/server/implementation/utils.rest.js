/* global Headers fetch */
import { getExplorerApi, getWebmapApi, getNodeApi, getServerUrl } from '../../utils/services'
import { ERROR_ACCESS_DENIED, SERVER_ERROR, ERROR_OBJ_LOCKED, ERROR_NO_CONNECTION } from '../../i18n/ua'

const absoluteUri = new RegExp('^(http|https)://')

const serverRootUrl = getServerUrl()
const explorerApi = serverRootUrl + getExplorerApi()
const webmapApi = getWebmapApi()
const nodeApi = getNodeApi()

export const getWebmapURL = () => webmapApi

export async function get (url, namespace = nodeApi) {
  const options = _getOptions('GET')
  return _createGetRequest(url, options, namespace)
}

export async function put (url, data, namespace = nodeApi) {
  const options = _getOptions('PUT')
  options.body = JSON.stringify(data)
  return _createGetRequest(url, options, namespace)
}

/**
 * async function post
 * @param {string} url
 * @param {Object} data
 * @param {string} route
 * @param namespace
 * @returns {Promise<any>}
 */
export async function post (url, data = {}, route = '/do', namespace) {
  const options = _getOptions('POST')
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

function _getOptions (method) {
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
 * function _createGetRequest
 * @param {string} url
 * @param {Object} options
 * @param {string} [namespace]
 * @returns {Promise<any>}
 * @private
 */
function _createGetRequest (url, options, namespace) {
  return new Promise((resolve, reject) => {
    const serviceUrl = `${serverRootUrl}${namespace}${url}`

    fetch(serviceUrl, options)
      .then((resp) => {
        const { status } = resp
        if (status === 200) {
          return resp.json()
        } else if (status === 204) {
          // success code of DELETE request
          return null
        } else if ([ 401, 403, 404 ].indexOf(status) >= 0) {
          reject(new Error(ERROR_ACCESS_DENIED))
        } else if (status === 409) {
          reject(new Error(ERROR_OBJ_LOCKED))
        } else if (status === 500) {
          reject(new Error(SERVER_ERROR))
        } else {
          reject(new Error(ERROR_NO_CONNECTION))
        }
      })
      .then(resolve)
      .catch((error) => reject(new Error(`${ERROR_NO_CONNECTION}: ${serviceUrl} (${error.message})`)))
  })
}

/**
 * function _createRequest
 * @param {string} url
 * @param option
 * @param namespace
 * @returns {Promise<*>}
 * @private
 */
async function _createRequest (url, option, namespace = explorerApi) {
  const serviceUrl = absoluteUri.test(url) ? url : namespace + url
  let response
  try {
    response = await fetch(serviceUrl, option)
  } catch (err) {
    throw new Error(`${ERROR_NO_CONNECTION}: ${serviceUrl} (${err.message})`)
  }
  switch (response.status) {
    case 200: {
      if (response.headers.get('content-type').slice(0, 16) === 'application/json') {
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
    case 403:
    case 404:
      throw new Error(ERROR_ACCESS_DENIED)
    case 409:
      throw new Error(ERROR_OBJ_LOCKED)
    default:
      throw new Error(`${ERROR_NO_CONNECTION} (${response.status}) (URL: ${serviceUrl})`)
  }
}
