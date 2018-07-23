import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import viewModes from './viewModes'
import webMap from './webMap'
import maps from './maps'
import layers from './layers'
import notifications from './notifications'
import orgStructures from './orgStructures'

export default combineReducers({
  viewModes,
  maps,
  layers,
  routing,
  notifications,
  orgStructures,
  webMap,
})
