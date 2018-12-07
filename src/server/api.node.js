import { ApiError } from '../constants/errors'
import { get, put } from './implementation/utils.rest'

const CODE_SUCCESS = 2000

/**
 * Отримання атрибутів карти і списку її шарів
 * @param {string} mapId - ідентифікатор карти
 * @returns {Promise<*>}
 */
const getMap = async (mapId = '0') =>
  checkServerResponse(get(`/web_map/map/${mapId}`))

/**
 * Отримання кольору підсвітки шару
 * @param {string} layerId - ідентифікатор шару
 * @returns {Promise<*>}
 */
const layerGetColor = async (layerId = '0') =>
  (await checkServerResponse(get(`/web_map/layer/${layerId}`))).color

/**
 * Встановлення кольору підсвітки шару
 * @param {string} layerId - ідентифікатор шару
 * @param {string} color - колір
 * @returns {Promise<*>}
 */
const layerSetColor = async (layerId = '0', color = '') =>
  checkServerResponse(put(`/web_map/layer/${layerId}`, { color }))

/**
 * Перевірка відповіді сервера. Кидає ApiError у випадку помилки.
 * @param {Promise} promise
 * @returns {Object}
 */
const checkServerResponse = async (promise) => {
  let response
  try {
    response = await promise
  } catch (error) {
    console.error(error)
    throw new ApiError(error.message)
  }
  if (!response) {
    throw new ApiError('Немає відповіді сервера')
  }
  if (response.error) {
    throw new ApiError(`Помилка сервера [${response.code}]: ${response.message}`)
  } else if (!response.data) {
    throw new ApiError(`Нерозпізнана відповідь сервера`)
  }
  if (response.data.code !== CODE_SUCCESS) {
    throw new ApiError(`Помилка сервера [${response.data.code}]: ${response.data.message}`)
  }
  return response.data.message
}

export default {
  getMap,
  layerGetColor,
  layerSetColor,
}
