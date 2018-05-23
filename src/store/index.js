import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from './reducers'

const middlewares = [
  // Here will be some middlewares
]

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(...middlewares)))

export default store
