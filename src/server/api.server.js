// import { arrToMap, decodingEntities } from '../utils/helpers'

import {
  get,
  getDirect,
  getDownloadURL,
  getFileBlob,
  getLayerURL,
  getMapURL,
  getVersionUrl,
  post,
} from './implementation/utils.rest'

const ServerApi = {
  getAppInfo,
  getVersion,
  getUnreadTotals,
  getOperations,
  addOperation,
  editOperation,
  closeOperation,
  openOperation,
  getDocuments,
  getFolderContent,
  getAllUnits,
  addLayersFolder,
  addLayer,
  addFolder,
  removeItem,
  downloadFile,
  getContacts,
  getAllContacts,
  startApprovalProcess,
  approveItem,
  confirmItem,
  getDocflowState,
  sendItem,
  getDeliveryState,
  doEditItem,
  doItemAction,
  // getReferences,
}

export default ServerApi

/**
 * Візуальна інформація щодо поточного користувача і організації
 * Інформація щодо поточного користувача
 * @return {PromiseLike<server.ApplicationInfo>}
 */
function getAppInfo () {
  return post('GetAppInfo')
}

// async function getReferences () {
//   const natoURL = '/mapstate/v1/dicts/nato'
//   const objectURL = '/mapstate/v1/dicts/object'
//
//   return {
//     nato: {
//       affiliations: arrToMap(await get(natoURL + '/affiliations'), null, 'ID', true),
//       battles: arrToMap(await get(natoURL + '/battles'), null, 'ID', true),
//       enforces: arrToMap(await get(natoURL + '/enforces'), null, 'ID', true),
//       icons: arrToMap(await get(natoURL + '/icons'), null, 'ID', true),
//       levels: arrToMap(await get(natoURL + '/levels'), null, 'ID', true),
//       mobilities: arrToMap(await get(natoURL + '/mobilities'), null, 'ID', true),
//       statuses: arrToMap(await get(natoURL + '/statuses'), null, 'ID', true),
//     },
//     object: {
//       typetypes: arrToMap(await get(objectURL + '/typetypes'), null, 'ID', true),
//       types: arrToMap(await get(objectURL + '/types'), null, 'ID', true),
//       orientations: arrToMap(await get(objectURL + '/orientations'), null, 'ID', true),
//       affiliations: arrToMap(await get(objectURL + '/affiliations'), null, 'ID', true),
//       units: arrToMap(await post('GetAllUnits'), null, 'ID', true),
//     },
//   }
// }

/**
 * Версія хаба
 * @returns {PromiseLike<any>}
 */
function getVersion () {
  return getDirect(getVersionUrl(), {})
}

/**
 * Данные о непрочитаных сообщениях
 * @returns {PromiseLike<any>}
 */
function getUnreadTotals () {
  return post('GetUnreadTotals')
}

/**
 * Список доступных операций
 * @return {PromiseLike<Array<server.Operation>>}
 */
function getOperations () {
  return post('Operations')
}

/**
 * Добавить оперцию, возвращает ID новой операции
 * @param {string} name - название операции
 * @param {Date?} dateFact - Час Ч
 * @param {string} datePlan - Підстава
 * @returns {PromiseLike<{operationID:number, operations:Array<server.Operation>}>}
 */
function addOperation ({ name, datePlan, reason } = {}) {
  return new Promise((resolve, reject) => {
    post('AddOperationWithReason', { name, datePlan, reason })
      .then((operationID) => {
        getOperations()
          .then((operations) => {
            resolve({ operationID, operations })
          })
      })
      .catch(reject)
  })
}

/**
 * Добавить оперцию, возвращает ID новой операции
 * @param {number} id - название операции
 * @param {string} name - название операции
 * @param {Date?} zeroHour - Час Ч
 * @param {string} reason - Підстава
 * @param datePlan
 * @returns {PromiseLike<{operationID:number, operations:Array<server.Operation>}>}
 */
function editOperation ({ id, name, zeroHour, reason, datePlan } = {}) {
  return new Promise((resolve, reject) => {
    post('EditOperation', { id, name, zeroHour, reason, datePlan })
      .then((operationID) => {
        getOperations()
          .then((operations) => {
            resolve({ operationID, operations })
          })
      })
      .catch(reject)
  })
}

/**
 * Закрыть операцию
 * @param {number} id - название операции
 * @param {string} reason - Підстава
 * @returns {PromiseLike<{operationID:number, operations:Array<server.Operation>}>}
 */
function closeOperation ({ id, reason } = {}) {
  return new Promise((resolve, reject) => {
    post('CloseOperation', { id, reason })
      .then((operationID) => {
        getOperations()
          .then((operations) => {
            resolve({ operationID, operations })
          })
      })
      .catch(reject)
  })
}

/**
 * Открыть операцию
 * @param {number} id - название операции
 * @param {string} reason - Підстава
 * @returns {PromiseLike<{operationID:number, operations:Array<server.Operation>}>}
 */
function openOperation ({ id, reason } = {}) {
  return new Promise((resolve, reject) => {
    post('OpenOperation', { id, reason })
      .then((operationID) => {
        getOperations()
          .then((operations) => {
            resolve({ operationID, operations })
          })
      })
      .catch(reject)
  })
}

/**
 * Получение документов по операции/пунктуменю/папке
 * @param {number} operationId
 * @param {string} mainTag
 * @param {number} folderID
 * @returns {PromiseLike<Array<server.Document>>}
 */
async function getDocuments ({ operationId, mainTag, folderID } = {}) {
  /** @type{server.Document[]} */
  const contents = await post('DocumentsPlain', { operationID: operationId, mainTag, folderID })
  _processURLs(contents)
  return contents
}

/**
 * Получение документов по операции/пунктуменю/папке
 * @param {number} operationId
 * @param {string} mainTag
 * @param {number} folderID
 * @param {client.IFolderContentFilter} filter
 * @param store
 * @returns {PromiseLike<server.FolderContents>}
 */
async function getFolderContent ({ operationId, folderID } = {}, store) {
  /** @type{server.FolderContents} */
  const content = await post('FolderContents', { operationID: operationId, mainTag: 'workMap', folderID })
  return content
}

async function getAllUnits () {
  return post('GetAllUnits')
}
/**
 *
 * @param {server.Document[]} content
 * @private
 */
function _processURLs (content) {
  content.filter((doc) => doc.type === 'document').forEach((doc) => {
    doc.uri = getDownloadURL(doc.id)
  })
  content.filter((doc) => doc.type === 'layer').forEach((doc) => {
    doc.uri = getLayerURL(doc.entityID)
  })
  content.filter((doc) => doc.type === 'layersFolder').forEach((doc) => {
    doc.uri = getMapURL(doc.id)
  })
}

/**
 * добавление "мапи" спец папки только для слоев
 * @param {number} operationId
 * @param {string} mainTag
 * @param {number} currentID
 * @param {string} name
 * @param {Date} dateFor
 * @returns {PromiseLike<number>}
 */
function addLayersFolder ({ operationId, mainTag, currentID, name, dateFor } = {}) {
  return post('AddLayersFolder', { operationID: operationId, mainTag, parentID: currentID, name, dateFor })
}

/**
 * добавление слоя в операцию в тэг
 * @param {number} operationId
 * @param {string} mainTag
 * @param {number} currentID
 * @param {string} name
 * @param {Date} dateFor
 * @returns {PromiseLike<number>}
 */
function addLayer ({ operationId, mainTag, currentID, name, dateFor } = {}) {
  return post('AddLayer', { operationID: operationId, mainTag, parentID: currentID, name, dateFor })
}

/**
 * Добавление папки
 * @param {number} operationId
 * @param {string} mainTag
 * @param {number} currentID
 * @param {string} name
 * @returns {PromiseLike<number>}
 */
function addFolder ({ operationId, mainTag, currentID, name } = {}) {
  return post('AddFolder', { operationID: operationId, mainTag, parentID: currentID, name })
}

/**
 * Удаление файла/папки
 * @param {Array<number>} id
 * @returns {PromiseLike<null>}
 */
function removeItem (id = []) {
  return post('RemoveItem', id)
}

/**
 * Загрузка файла, автоматом делает загрузку
 * @param {number} id
 * @deprecated
 */
function downloadFile (id) {
  getFileBlob('file', id)
    .then((outputBlob) => {
      const fileURL = window.URL.createObjectURL(outputBlob)
      const link = document.createElement('a')
      link.href = fileURL
      link.download = 'file'
      // eslint-disable-next-line no-undef
      link.dispatchEvent(new MouseEvent('click'))
    })
}

/**
 * Список контактов
 * @returns {PromiseLike<Array<server.Contact>>}
 */
function getContacts () {
  return post('Contacts')
}

/**
 * Список всех контактов
 * @returns {PromiseLike<Array<server.ContactInfo>>}
 */
function getAllContacts () {
  return post('GetAllContacts')
}

/**
 * Начать процесс погодження/подписания
 * @param {number} documentID
 * @param {string} comment
 * @param {Date} datePlan
 * @param {Array<client.ApprovalItem>} approveList
 * @returns {PromiseLike<any>}
 */
function startApprovalProcess ({ documentID, comment, datePlan, approveList } = {}) {
  return post('StartApprovalProcess', { documentID, comment, datePlan, approveList })
}

/**
 * Погодити документ
 * @param {number} documentID
 * @param {string} note
 * @param isApproved
 * @returns {PromiseLike<boolean>}
 */
function approveItem ({ documentID, note, isApproved } = {}) {
  return post('ApproveItem', { documentID, note, isApproved })
}

/**
 * Затвердити документ
 * @param {number} documentID
 * @param {string} note
 * @param isApproved
 * @returns {PromiseLike<boolean>}
 */
function confirmItem ({ documentID, note, isApproved } = {}) {
  return post('SignItem', { documentID, note, isApproved })
}

/**
 * Стан погодження/подписания
 * @param {number} documentID
 * @returns {PromiseLike<server.DocflowState>}
 */
function getDocflowState (documentID) {
  return post('GetDocflowState', { documentID, note: '' })
}

/**
 * Отправлить документ контакту
 * @param {number} documentID
 * @param {Array<number>} contacts
 * @returns {PromiseLike<boolean>}
 */
function sendItem ({ documentID, contactID, regNum } = {}) {
  return post('SendItem', { documentID, contacts: contactID, regNum })
}

/**
 * Информация о сотоянии доставки
 * @param documentID
 * @returns {PromiseLike<Array<server.DeliveryState>>}
 */
function getDeliveryState (documentID) {
  return post('GetDeliveryState', { documentID: documentID, note: '' })
}

/**
 *
 * @param {client.IEditItem} param
 * @returns {PromiseLike<boolean>}
 */
function doEditItem (param) {
  return post('EditItem', param)
}

/**
 *
 * @param {string} action
 * @param {client.IActionFrom} from
 * @param {client.IActionTo} to
 * @returns {PromiseLike<boolean>}
 */
function doItemAction ({ action, from, to } = {}) {
  return post('doItemAction', { action, from, to })
}
