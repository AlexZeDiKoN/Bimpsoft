import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import isPlainObject from 'lodash/isPlainObject'
import thunk from 'redux-thunk'
import { error } from '../utils/devLoggers'
import explorerApi from '../server/api.node'
import webmapApi from '../server/api.webmap'
import milOrgApi from '../server/api.server.org'
import rootReducer from './reducers'
import { initSocketEvents } from './SocketEvents'
import { loadAllParams } from './actions/params'
import initNavigationConnection from './initNavigationConnection'

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
      explorerApi,
      webmapApi,
      milOrgApi,
    }),
  ]

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  if (history) {
    middlewares.push(routerMiddleware(history))
  }

  store = createStore(rootReducer, composeEnhancers(applyMiddleware(...middlewares)))
  initNavigationConnection(store, history)

  initSocketEvents(store.dispatch, store.getState)
  store.dispatch(loadAllParams())

  return store
}
