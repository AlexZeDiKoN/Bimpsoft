import { ApiError } from '../constants/errors'
import { post } from './implementation/utils.rest'

/**
 * Получение документов по операции/пунктуменю/папке
 * @param {number} operationId
 * @param {string} mainTag
 * @param {number} folderID
 * @returns {Promise<any>}
 */
const getFolderContent = ({ operationId, folderID } = {}) =>
  post('FolderContents', { operationID: operationId, mainTag: 'workMap', folderID })

const checkServerResponse = (response) => {
  if (response.errors && response.errors.length) {
    throw new ApiError(response.errors.join(', '))
  }
}

export default {
  checkServerResponse,
  getFolderContent,
}
