import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import viewModes from './viewModes'
import webMap from './webMap'
import maps from './maps'
import layers from './layers'
import notifications from './notifications'
import orgStructures from './orgStructures'
import templates from './templates'
import selection from './selection'
import params from './params'
import print from './print'
import flexGrid from './flexGrid'
import march from './march'

export default combineReducers({
  viewModes,
  maps,
  layers,
  routing,
  notifications,
  orgStructures,
  webMap,
  templates,
  selection,
  params,
  print,
  flexGrid,
  march,
})
