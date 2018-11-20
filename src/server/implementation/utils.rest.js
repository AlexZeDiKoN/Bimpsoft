/* global Headers fetch */
import { getExplorerApi, getWebmapApi, getServerUrl } from '../../utils/services'
import { ERROR_ACCESS_DENIED, ERROR_NO_CONNECTION } from '../../i18n/ua'

const absoluteUri = new RegExp('^(http|https)://')

const serverRootUrl = getServerUrl()
const explorerApi = serverRootUrl + getExplorerApi()
const webmapApi = getWebmapApi()

export const getWebmapURL = () => webmapApi

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
          reject(new Error(ERROR_ACCESS_DENIED))
        } else {
          reject(new Error(ERROR_NO_CONNECTION))
        }
      })
      .then((data) => {
        resolve(data)
      })
      .catch((error) => {
        reject(new Error(`${ERROR_NO_CONNECTION}: ${serviceUrl} (${error.message})`))
      })
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
      throw new Error(ERROR_ACCESS_DENIED)
    default:
      throw new Error(`${ERROR_NO_CONNECTION} (${response.status}) (URL: ${serviceUrl})`)
  }
}
