import { getExplorerApi, getWebmapApi, getServerUrl } from '../../utils/services'
import { ERROR_ACCESS_DENIED, ERROR_OBJ_LOCKED, ERROR_NO_CONNECTION } from '../../i18n/ua'
import SERVERS from '../../constants/servers'

const absoluteUri = new RegExp('^(http|https)://')

const serverRootUrl = getServerUrl()
const explorerApi = serverRootUrl + getExplorerApi()
const webmapApi = getWebmapApi()

export const getWebmapURL = () => webmapApi

const setOptionsData = (options, data) => {
  if (data) {
    const isString = (typeof data === 'string')
    const isFormData = (data instanceof FormData)
    if (isFormData) {
      options.headers.delete('Content-Type')
    } else {
      const contentType = isString ? 'application/octet-stream;charset=UTF-8' : 'application/json;charset=UTF-8'
      options.headers.append('Content-Type', contentType)
    }
    options.body = (isString || isFormData) ? data : JSON.stringify(data)
  }
}

/**
 * async function post
 * @param {string} url
 * @param {Object} data
 * @param {string} route
 * @param namespace
 * @returns {Promise<*>}
 */
export async function post (url, data = {}, route = '/do', namespace) {
  const options = _getOptions('POST')
  const request = {
    operation: url,
    payload: !data ? null : JSON.stringify(data),
  }
  setOptionsData(options, request)
  return getDirect(route, options, namespace)
}

export async function getDirect (url, data = {}, namespace) {
  const options = _getOptions(data ? 'POST' : 'GET')
  setOptionsData(options, data)
  return _createRequest(url, options, namespace !== undefined ? (serverRootUrl + namespace) : undefined)
}

function _getOptions (method) {
  return {
    mode: 'cors',
    credentials: 'include',
    method,
    headers: new Headers(),
  }
}

const _getServerName = (url) => {
  url = new URL(url)
  const route = url.pathname.slice(1).split('/')[0]
  const server = SERVERS.find((server) => {
    if (url.port) {
      if (server.port && url.port === server.port) {
        // -
      } else {
        return false
      }
    }
    return server.routes ? server.routes.includes(route) : true
  })
  return server && server.name
}

const _getConnectionErrorMessage = (url, status) => {
  let serverName = _getServerName(url)
  serverName = serverName ? `[ ${serverName} ]` : ''
  status = status ? `(${status})` : ''
  return [
    ERROR_NO_CONNECTION,
    serverName,
    status,
    `URL: ${url}`,
  ]
    .filter(Boolean)
    .join(' ')
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
  const serviceUrl = absoluteUri.test(url) ? url : `${namespace}${url}`
  let response
  try {
    response = await fetch(serviceUrl, option)
  } catch (err) {
    throw new Error(_getConnectionErrorMessage(serviceUrl))
  }
  switch (response.status) {
    case 200: {
      const contentType = response.headers.get('content-type') || ''
      if (contentType.slice(0, 16) === 'application/json') {
        let jsonPayload = await response.json()
        try {
          if (jsonPayload.payload && typeof jsonPayload.payload === 'string') {
            jsonPayload = JSON.parse(jsonPayload.payload)
          }
        } catch (err) {
          console.warn(err)
        }
        return jsonPayload
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
    default: {
      throw new Error(_getConnectionErrorMessage(serviceUrl, response.status))
    }
  }
}
