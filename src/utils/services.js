export const production = process.env.NODE_ENV === 'production'
export const development = !production

export const getSelectedService = (services, location) =>
  services.find((service) => service.link === location.pathname.split('/')[2]) || {}

export const getServerUrl = () => production ? `${window.location.origin}` : (process.env.REACT_APP_SERVER_URL || '')

export const getExplorerApi = () => process.env.REACT_APP_EXPLORER_API

export const getMapApi = () => process.env.REACT_APP_MAP_API

export const getWebmapApi = () => `${production ? dropPort(window.origin) : ''}${process.env.REACT_APP_WEBMAP_API}`

export const getBGStateUrl = () => `${getServerUrl()}/BGState`

export const getAdminApi = () => process.env.REACT_APP_ADMIN_API

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
