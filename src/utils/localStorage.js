export const LS = {
  set: (group, key, data) => {
    const type = typeof data
    window.localStorage.setItem(`${group}::${key}::type`, type)
    switch (type) {
      case 'object': {
        window.localStorage.setItem(`${group}::${key}::data`, JSON.stringify(data))
        break
      }
      default:
        window.localStorage.setItem(`${group}::${key}::data`, data)
    }
  },
  get: (group, key) => {
    const type = window.localStorage.getItem(`${group}::${key}::type`)
    switch (type) {
      case 'object': {
        return JSON.parse(window.localStorage.getItem(`${group}::${key}::data`))
      }
      default:
        return window.localStorage.getItem(`${group}::${key}::data`)
    }
  },
  clear: () => window.localStorage.clear(),
}
