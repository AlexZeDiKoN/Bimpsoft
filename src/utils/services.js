export const production = process.env.NODE_ENV === 'production'
export const development = !production

export const getServerUrl = () => production ? `${window.location.origin}` : (process.env.REACT_APP_SERVER_URL || '')

export const getExplorerApi = () => process.env.REACT_APP_EXPLORER_API

export const getCatalogURL = () => `${production ? dropPort(window.origin) : ''}${process.env.REACT_APP_CATALOGS_API}`

export const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const getExplorerOrigin = () => process.env.REACT_APP_EXPLORER_ORIGIN

export const action = (actionName) => production ? Symbol(actionName) : actionName

function dropPort (origin) {
  const parts = origin.split(':')
  if (parts.length > 2) {
    parts.splice(-1, 1)
  }
  return parts.join(':')
}
