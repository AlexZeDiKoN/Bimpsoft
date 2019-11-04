export const LS = {
  clear: () => window.localStorage.clear(),

  set: (group, key, data) => {
    const type = typeof data
    window.localStorage.setItem(`${group}::${key}::type`, type)
    switch (type) {
      case 'object': {
        data = JSON.stringify(data)
        break
      }
      default:
    }
    window.localStorage.setItem(`${group}::${key}::data`, data)
  },

  get: (group, key) => {
    const type = window.localStorage.getItem(`${group}::${key}::type`)
    const data = window.localStorage.getItem(`${group}::${key}::data`)
    switch (type) {
      case 'object': {
        return JSON.parse(data)
      }
      case 'boolean':
        return data === 'true'
      default:
        return data
    }
  },
}
