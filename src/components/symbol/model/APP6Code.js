function replace (code, key, index, length) {
  code = format(code, 20)
  key = format(key, length)
  return code.substr(0, index) + key + code.substr(index + length)
}

function format (key, length) {
  return String(key).substr(0, length).padStart(length, '0')
}

function part (code, index, length) {
  return format(code.substr(index, length))
}
function getBit (code, index, mask) {
  return Boolean(parseInt(code[index], 10) & mask)
}
function setBit (code, flag, index, mask) {
  let value = parseInt(code[index], 10)
  value = flag ? (value | mask) : value & (~mask)
  return replace(code, value, index, 1)
}

export const setVersion = (code, key) => replace(code, key, 0, 2)
export const setIdentity = (code, key) => replace(code, key, 2, 2)
export const setIdentity1 = (code, key) => replace(code, key, 2, 1)
export const setIdentity2 = (code, key) => replace(code, key, 3, 1)
export const setSymbol = (code, key) => replace(code, key, 4, 2)
export const setStatus = (code, key) => replace(code, key, 6, 1)
export const setHQ = (code, isHQ) => setBit(code, isHQ, 7, 0b010)
export const setTaskForce = (code, isTaskForce) => setBit(code, isTaskForce, 7, 0b100)
export const setDummy = (code, isDummy) => setBit(code, isDummy, 7, 0b001)
export const setAmplifier = (code, key) => replace(code, key, 8, 2)
export const setIcon = (code, key) => replace(code, key, 10, 6)
export const setModifier1 = (code, key) => replace(code, key, 16, 2)
export const setModifier2 = (code, key) => replace(code, key, 18, 2)

export const getVersion = (code) => part(code, 0, 2)
export const getIdentity = (code) => part(code, 2, 2)
export const getIdentity1 = (code) => part(code, 2, 1)
export const getIdentity2 = (code) => part(code, 3, 1)
export const getSymbol = (code) => part(code, 4, 2)
export const getStatus = (code) => part(code, 6, 1)
export const isHQ = (code) => getBit(code, 7, 0b010)
export const isTaskForce = (code) => getBit(code, 7, 0b100)
export const isDummy = (code) => getBit(code, 7, 0b001)
export const getAmplifier = (code) => part(code, 8, 2)
export const getIcon = (code, key) => part(code, 10, 6)
export const getModifier1 = (code, key) => part(code, 16, 2)
export const getModifier2 = (code, key) => part(code, 18, 2)
