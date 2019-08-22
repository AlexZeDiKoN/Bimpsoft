import { post } from './implementation/utils.rest'
import { requiredParam } from './requiredParam'

const namespace = '/org/v1'

const gfUrl = '/generalformation'

const generalFormation = {
  list: doList(gfUrl),
  create: doCreate(gfUrl),
  update: doUpdate(gfUrl),
  delete: doDelete(gfUrl),
}

const muUrl = '/militaryunit'
const militaryUnit = {
  list: doList(muUrl),
  create: doCreate(muUrl),
  update: doUpdate(muUrl),
  delete: doDelete(muUrl),
}

const cpUrl = '/militarycommandpost'
const militaryCommandPost = {
  list: doList(cpUrl),
  create: doCreate(cpUrl),
  update: doUpdate(cpUrl),
  delete: doDelete(cpUrl),
}

const urUrl = '/militaryunitrelation'
const militaryUnitRelation = {
  list: doList(urUrl),
  create: doCreate(urUrl),
  update: doUpdate(urUrl),
  delete: doDelete(urUrl),
  updateMany: doUpdateMany(urUrl),
}

const cpdUrl = '/militarycpdept'
const militaryCommandPostDepartment = {
  list: doList(cpdUrl),
  create: doCreate(cpdUrl),
  update: doUpdate(cpdUrl),
  delete: doDelete(cpdUrl),
}

const cppUrl = '/militarycpposition'
const MilitaryCommandPostPosition = {
  list: doList(cppUrl),
  create: doCreate(cppUrl),
  update: doUpdate(cppUrl),
  delete: doDelete(cppUrl),
}

const dcUrl = '/dc'
// const dc = {
//   affiliationTypes: getDc('AffiliationTypes'),
//   countries: getDc('Countries'),
//   generalMilitaryFormationStates: getDc('GeneralMilitaryFormationStates'),
//   subordinativenessTypes: getDc('SubordinativenessTypes'),
//   natoUnitLevels: getDc('NatoUnitLevels'),
//   militaryForceKinds: getDc('MilitaryForceKinds'),
//   militaryFormTypes: getDc('MilitaryFormTypes'),
// }

const ServerApiOrg = {
  generalFormation,
  militaryUnit,
  militaryCommandPost,
  militaryUnitRelation,
  militaryCommandPostDepartment,
  MilitaryCommandPostPosition,
  allDc,
}

export default ServerApiOrg

function doList (url) {
  return function (filter) {
    return post(`${namespace}${url}List`, filter)
  }
}

function doCreate (url) {
  return function (item) {
    return post(`${namespace}${url}Create`, item)
  }
}

function doUpdate (url) {
  return function (item) {
    return post(`${namespace}${url}Update`, item)
  }
}

function doDelete (url) {
  return function (id = requiredParam('id')) {
    return post(`${namespace}${url}Delete`, id)
  }
}

function doUpdateMany (url) {
  return function (item) {
    return post(`${namespace}${url}UpdateMany`, item)
  }
}

// function getDc (code) {
//   return function () {
//     return post('List', { code }, undefined, namespace + dcUrl)
//   }
// }

function allDc () {
  return post(`${namespace}${dcUrl}All`, {})
}
