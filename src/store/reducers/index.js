import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import webMap from './webMap'

export default combineReducers({
  webMap,

  routing,
})
