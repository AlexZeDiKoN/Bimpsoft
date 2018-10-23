const toURI = (obj) => Object.entries(obj)
  .map(([ key, value ]) => `${key}=${encodeURIComponent(JSON.stringify(value))}`)
  .join('&')

const fromURI = (url) => url
  .split('&')
  .filter(Boolean)
  .reduce((result, param) => {
    const [ key, value ] = param.split('=')
    return {
      ...result,
      [key]: JSON.parse(decodeURIComponent(value)),
    }
  }, {})

export default (mapStateToProps, onHistoryChange) => (store, history) => {
  let uri = ''
  let push = ''

  const stateChangeHandler = () => {
    const { pushProps, replaceProps } = mapStateToProps(store.getState())
    const pushUri = toURI(pushProps)
    const replaceUri = toURI(replaceProps)
    const fullUri = [ pushUri, replaceUri ].filter((item) => item.length).join('&')
    const newUri = `/#/?${fullUri}`
    if (push !== pushUri) {
      push = pushUri
      // console.log(`history.push: "${fullUri}"`)
      history.push(newUri)
    } else {
      // console.log(`history.replace: "${fullUri}"`)
      history.replace(newUri)
    }
    uri = fullUri
  }

  const locationChangeHandler = () => {
    const nextUri = history.location.hash.slice(3)
    // console.log(`switch: "${nextUri}"`)
    onHistoryChange(fromURI(uri), fromURI(nextUri), store.dispatch)
    uri = nextUri
  }

  locationChangeHandler()

  store.subscribe(stateChangeHandler)
  history.listen(async (location, action) => action === 'POP' && locationChangeHandler())
}
