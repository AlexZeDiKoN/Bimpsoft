import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import viewModes from './viewModes'

export default combineReducers({
  viewModes,

  routing,
})
