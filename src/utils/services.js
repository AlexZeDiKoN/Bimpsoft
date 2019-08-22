export const production = process.env.NODE_ENV === 'production'
export const development = !production

export const getServerUrl = () => production ? `${window.location.origin}` : (process.env.REACT_APP_SERVER_URL || '')

export const getExplorerApi = () => process.env.REACT_APP_EXPLORER_API

export const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const getExplorerOrigin = () => process.env.REACT_APP_EXPLORER_ORIGIN

export const action = (actionName) => production ? Symbol(actionName) : actionName
