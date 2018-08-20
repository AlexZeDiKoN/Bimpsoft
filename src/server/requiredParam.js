/**
 * Используется для индикации обязательных параметров
 * проставляется как дефолтное значение и автоматом при отсутствии выкинет ошибку
 * @param {string} param название параметра что пропущен
 * @returns {any} для удобства указан возвращаемый параметр
 */
export function requiredParam (param) {
  const requiredParamError = new Error(
    `Required parameter, "${param}" is missing.`,
  )
  // preserve original stack trace
  if (typeof Error.captureStackTrace === 'function') {
    Error.captureStackTrace(
      requiredParamError,
      requiredParam,
    )
  }
  throw requiredParamError
}
