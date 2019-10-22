import { combineReducers } from 'redux'
import { authReducer } from '@DZVIN/components'
import { routerReducer as routing } from 'react-router-redux'
import viewModes from './viewModes'
import webMap from './webMap'
import webMap3D from './webMap3D'
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
import catalogs from './catalogs'
import ovt from './ovt'
import targeting from './targeting'
import task from './task'
import targetCatalog from './targetCatalog'

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
  catalogs,
  webMap3D,
  ovt,
  targeting,
  task,
  targetCatalog,
  auth: authReducer,
})
