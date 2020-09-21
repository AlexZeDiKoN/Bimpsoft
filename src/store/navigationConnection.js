const toURI = (obj) => Object.entries(obj)
  .map(([ key, value ]) => `${key}=${value}`)
  .join('&')

const fromURI = (url) => url
  .split('&')
  .filter(Boolean)
  .reduce((result, param) => {
    const [ key, value ] = param.split('=')
    if (key) {
      result[key] = value
    }
    return result
  }, {})

export default (mapStateToProps, onHistoryChange) => (store, history) => {
  let uri = ''
  let push = ''
  let authenticated = false

  const stateChangeHandler = () => {
    const state = store.getState()
    if (!authenticated) {
      if (state.auth.authenticated) {
        authenticated = true
        locationChangeHandler()
      }
      return
    }

    const { pushProps, replaceProps } = mapStateToProps(state)
    const pushUri = toURI(pushProps)
    const replaceUri = toURI(replaceProps)
    const fullUri = [ pushUri, replaceUri ].filter((item) => item.length).join('&')
    const newUri = `#/?${fullUri}`
    if (push !== pushUri) {
      push = pushUri
      history.push(newUri)
    } else if (uri !== fullUri) {
      history.replace(newUri)
    }
    uri = fullUri
  }

  const locationChangeHandler = () => {
    const nextUri = history.location.hash.slice(3)
    onHistoryChange(fromURI(uri), fromURI(nextUri), store.dispatch)
    uri = nextUri
  }

  store.subscribe(stateChangeHandler)
  history.listen(async (location, action) => action === 'POP' && locationChangeHandler())
}
