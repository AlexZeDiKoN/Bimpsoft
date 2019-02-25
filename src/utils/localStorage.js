export const LS = {
  set: (group, key, data) => (
    typeof data === 'string'
      ? window.localStorage.setItem(`${group}::${key}`, data)
      : window.localStorage.setItem(`${group}::${key}`, JSON.stringify(data))
  ),
  get: (group, key) => {
    const data = window.localStorage.getItem(`${group}::${key}`)
    let parsedData
    try {
      parsedData = JSON.parse(data)
    } catch (e) {
      return data
    }
    return parsedData
  },
  clear: window.localStorage.clear(),
}
