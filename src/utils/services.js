export const getSelectedService = (services, location) =>
  services.find((service) => service.link === location.pathname.split('/')[2]) || {}

export const getServerUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return `${window.location.origin}`
  }
  return process.env.REACT_APP_SERVER_URL || ''
  // return 'http://10.8.26.85'
}

export const getExplorerApi = () =>
  process.env.REACT_APP_EXPLORER_API

export const getMapApi = () =>
  process.env.REACT_APP_MAP_API

export const getBGStateUrl = () =>
  `${getServerUrl()}/BGState`

export const getAdminApi = () =>
  process.env.REACT_APP_ADMIN_API

export const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
