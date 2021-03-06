import { ERROR_ACCESS_DENIED, ERROR_OBJ_LOCKED, ERROR_NO_CONNECTION } from '../../i18n/ua'
import SERVERS from '../../constants/servers'

const base = process.env.REACT_APP_SERVER_URL

export const getAuthToken = () => getDirect('/secret', null)

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
 * @param {string} operation
 * @param {string} route
 * @returns {Promise<*>}
 */
export function post (url, data = {}, operation, route = '/do') {
  const request = {
    operation,
    payload: !data ? null : JSON.stringify(data),
  }
  return getDirect(`${url}${route}`, request)
}

export function getDirect (url, data = {}, withoutCredentials) {
  const options = _getOptions(data ? 'POST' : 'GET', withoutCredentials)
  setOptionsData(options, data)
  return _createRequest(url, options)
}

function _getOptions (method, withoutCredentials) {
  const auth = window.session
    ? window.session.authHeader()
    : null
  const headers = new Headers()
  if (auth) {
    headers.append('Authorization', auth)
  }
  const result = {
    method,
    headers,
  }
  if (!withoutCredentials) {
    result.mode = 'cors'
    result.credentials = 'include'
  }
  return result
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

const _getAuthHeader = async () => {
  if (window.ubConnection) {
    const session = await window.ubConnection.authorize()
    return session.authHeader()
  }
  return null
}

/**
 * function _createRequest
 * @param {string} url
 * @param options
 * @returns {Promise<*>}
 * @private
 */
async function _createRequest (url, options) {
  url = `${base}${url}`
  let response
  try {
    const authHeader = await _getAuthHeader()
    if (authHeader) {
      options.headers.append('ub-authorization', authHeader)
    }
    response = await fetch(url, options)
  } catch (err) {
    throw new Error(_getConnectionErrorMessage(url))
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
      throw new Error(_getConnectionErrorMessage(url, response.status))
    }
  }
}
