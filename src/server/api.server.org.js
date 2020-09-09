import { post, getDirect } from './implementation/utils.rest'
import { requiredParam } from './requiredParam'

const namespace = '/hub/org/v1'
const v2 = '/hub/explorer/v2/mil'

const gfUrl = '/generalformation'

const doList = (url) => (filter) => post(`${namespace}${url}`, filter, 'List')
const doCreate = (url) => (item) => post(`${namespace}${url}`, item, 'Create')
const doUpdate = (url) => (item) => post(`${namespace}${url}`, item, 'Update')
const doDelete = (url) => (id = requiredParam('id')) => post(`${namespace}${url}`, id, 'Delete')
const doUpdateMany = (url) => (item) => post(`${namespace}${url}`, item, 'UpdateMany')
const allDc = () => post(`${namespace}${dcUrl}`, {}, 'All')

const getFormationUnits = (formationID = requiredParam('formationID')) =>
  getDirect(`${v2}/Unit_ListByFormation`, { formationID })

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
  getFormationUnits,
}

export default ServerApiOrg
