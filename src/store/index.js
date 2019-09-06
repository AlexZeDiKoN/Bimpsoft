import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import { batchDispatchMiddleware } from 'redux-batched-actions'
import isPlainObject from 'lodash/isPlainObject'
import thunk from 'redux-thunk'
import { error } from '../utils/devLoggers'
import webmapApi from '../server/api.webmap'
import milOrgApi from '../server/api.server.org'
import indicatorApi from '../server/api.indicator'
import catalogApi from '../server/api.catalog'
import ovtApi from '../server/api.ovt'
import rootReducer from './reducers'
import { initSocketEvents } from './SocketEvents'
import { loadAllParams } from './actions/params'
import initNavigationConnection from './initNavigationConnection'
import { catchError } from './actions/asyncAction'
import { print, march } from './actions'
// import { setVariant } from './actions/maps'

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
    batchDispatchMiddleware,
    thunk.withExtraArgument({
      webmapApi,
      milOrgApi,
      indicatorApi,
      catalogApi,
      ovtApi,
    }),
  ]

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  if (history) {
    middlewares.push(routerMiddleware(history))
  }

  store = createStore(rootReducer, composeEnhancers(applyMiddleware(...middlewares)))
  initNavigationConnection(store, history)

  initSocketEvents(store.dispatch, store.getState)

  /* setTimeout(() => {
    store.dispatch(setVariant('5c110ade6de3ac15a1000002', 555))
  }, 6000) */

  return store
}
