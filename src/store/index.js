import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import isPlainObject from 'lodash/isPlainObject'
import thunk from 'redux-thunk'
import { error } from '../utils/devLoggers'
import ServerApi from '../server/api.server'
import WebmapApi from '../server/api.webmap'
import ServerApiMilOrg from '../server/api.server.org'
import rootReducer from './reducers'
import { initSocketEvents } from './SocketEvents'

let store = null

export default function initStore (options = {}) {
  if (store) {
    return store
  }

  if (!isPlainObject(options)) {
    error(`Failed to set options of 'initStore' function. First argument expected to be a plain object, but got ${typeof options}`)
  }

  const {
    history,
  } = options

  const middlewares = [
    thunk.withExtraArgument({
      api: ServerApi,
      webmapApi: WebmapApi,
      milOrg: ServerApiMilOrg,
    }),
  ]

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  if (history) {
    middlewares.push(routerMiddleware(history))
  }

  store = createStore(rootReducer, composeEnhancers(applyMiddleware(...middlewares)))

  initSocketEvents(store.dispatch)

  return store
}
