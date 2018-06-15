import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import viewModes from './viewModes'
import maps from './maps'
import layers from './layers'

export default combineReducers({
  viewModes,
  maps,
  layers,
  routing,
})
