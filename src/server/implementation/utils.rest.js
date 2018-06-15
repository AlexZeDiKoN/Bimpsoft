/* global Headers fetch */
import { getAdminApi, getExplorerApi, getMapApi, getServerUrl } from '../../utils/services'

const absoluteUri = new RegExp('^(http|https)://')

const serverRootUrl = getServerUrl()
const explorerApi = serverRootUrl + getExplorerApi()
export const serverUrl = `${explorerApi}/do`
const mapApi = serverRootUrl + getMapApi()
const adminApi = serverRootUrl + getAdminApi()

/**
 *
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

export async function get (url, entityID) {
  const options = _getOptions('GET')

  const fullUrl = entityID ? url + '/' + entityID : url
  return _createGetRequest(fullUrl, options)
}

export function getVersionUrl () {
  return `${adminApi}/version`
}

/**
 *
 * @param url
 * @param data
 * @returns {Promise<any>}
 */
export async function post (url, data, route = '/do') {
  const options = _getOptions('POST')
  /** @type{server.ServerRequest} */
  const request = {
    operation: url,
    payload: !data ? null : JSON.stringify(data),
  }
  options.body = JSON.stringify(request)
  return _createRequest(route, options)
}

export async function getDirect (url, data) {
  const options = _getOptions(data ? 'POST' : 'GET')
  if (data) {
    options.body = JSON.stringify(data)
  }
  return _createRequest(url, options)
}

export function getFileBlob (url, id) {
  return _getBlob(url, id)
}

function _getOptions (method) {
  const myHeaders = _getDefaultHeaders()
  return {
    mode: 'cors',
    credentials: 'include',
    method: method,
    headers: myHeaders,
  }
}

function _getDefaultHeaders () {
  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json;charset=UTF-8')
  return myHeaders
}

/**
 * @param {string} url
 * @param option
 * @returns {PromiseLike<any>}
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
async function _createRequest (url, option) {
  const serviceUrl = absoluteUri.test(url) ? url : explorerApi + url
  try {
    const request = fetch(serviceUrl, option)
    const responce = await request

    switch (responce.status) {
      case 200:
        if (responce.headers.get('content-type').slice(0, 16) === 'application/json') {
          /** @type{server.ServerResponse} */
          const jsonPayload = await responce.json()
          if (jsonPayload.payload) {
            const parsed = JSON.parse(jsonPayload.payload)
            return parsed
          } else {
            return jsonPayload
          }
        }
        const textPayload = await responce.text()
        return textPayload

      case 204:
        // success code of DELETE request
        return null

      case 401:
        throw new Error('Доступ заборонено')

      default:
        throw new Error(`Сервер не доступний (${responce.status}) (URL: ${serviceUrl})`)
    }
  } catch (e) {
    throw e
  }
}

function _getBlob (url, entityID) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json;charset=UTF-8')
    const options = {
      credentials: 'include',
      method: 'GET',
      headers: myHeaders,
    }

    const serviceUrl = `${serverRootUrl}/${url}/?id=${entityID}`

    fetch(serviceUrl, options)
      .then((resp) => {
        if (resp.status === 200) {
          return resp.blob()
        } else if (resp.status === 401) {
          reject(new Error('Доступ заборонено'))
        } else {
          reject(new Error('Сервер не доступен'))
        }
      })
      .then(/** @type{Blob} */ (data) => {
        resolve(data)
      })
      .catch((error) => {
        reject(error.message)
      })
  })
}

export function startLongPolling (url, processRecord) {
  const headers = new Headers()
  headers.append('Connection', 'Keep-Alive')
  const options = {
    mode: 'cors',
    credentials: 'include',
    method: 'GET',
    headers,
  }

  const poll = () => {
    fetch(url, options)
      .then(async (response) => {
        const reader = response.body.getReader()
        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            break
          }
          try {
            const records = JSON.parse(String.fromCharCode.apply(null, value))
            for (const record of records) {
              processRecord(record)
            }
          } catch (err) {
            console.error(err)
          }
        }
        poll()
      })
      .catch((err) => {
        console.error(err)
        poll()
      })
  }

  poll()
}
