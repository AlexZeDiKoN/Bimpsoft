export const production = process.env.NODE_ENV === 'production'
export const development = !production

export const getExplorerOrigin = () => process.env.REACT_APP_EXPLORER_ORIGIN

export const action = (actionName) => production ? Symbol(actionName) : actionName
