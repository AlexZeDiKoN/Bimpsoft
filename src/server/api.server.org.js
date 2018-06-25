import { post } from './implementation/utils.rest'

const ServerApiOrg = {
  getCalculatedValues,
  getBaseParams,
  saveBaseParams,
}

export default ServerApiOrg

/**
 * Список расчитаных парамтров по "Станом НА"
 * @param {Date} dateFor Станом На
 * @return {PromiseLike<server.CalculatedParam[]>}
 */
function getCalculatedValues ({ dateFor } = {}) {
  return post('ListCalculated', { dateFor }, '/org')
}

/**
 * Список базовых параметров по юниту, по подгруппе параметров, Станом На
 * Всегда вернет полный список, в случае отсутствия данных заполненый 0-ми
 * @param {Date} dateFor Станом На
 * @param {number} unitID Идентификатор юнита
 * @param {string} groupCode Подгруппа параметров
 * @return {PromiseLike<server.BaseParam[]>}
 */
function getBaseParams ({ dateFor, unitID, groupCode } = {}) {
  return post('ListBaseParams', { dateFor, unitID, groupCode }, '/org')
}

/**
 * Сохранение результатов редактирования параметров
 * @param {number} unitID Идентификатор юнита
 * @param {Date?} dateFor Станом На
 * @param {server.BaseParam[]} params список параметров (формат как из метода getBaseParams)
 * @returns {Promise<boolean>}
 */
function saveBaseParams ({ unitID, dateFor, params }) {
  return post('SaveBaseParams', { dateFor, unitID, params }, '/org')
}
