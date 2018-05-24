function devLogger (logMethod, ...args) {
  if (process.env.NODE_ENV === 'development') {
    window.console[logMethod](...args)
  }
}

export const log = devLogger.bind(null, 'log')
export const warn = devLogger.bind(null, 'warn')
export const error = devLogger.bind(null, 'error')
export const dir = devLogger.bind(null, 'dir')
