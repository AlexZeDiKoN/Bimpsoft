import { createSelector } from 'reselect'
import { changeTypes } from '../actions/webMap'
import entityKind from '../../components/WebMap/entityKind'
import i18n from '../../i18n'

const LIMIT_LOG_ITEMS = 200

const getChangeTypeKeyByEvent = (event) => {
  for (const key in changeTypes) {
    if (changeTypes.hasOwnProperty(key)) {
      if (event === changeTypes[key]) {
        return key
      }
    }
  }
  return null
}

const getObjectKeyByKind = (objectKind) => {
  for (const key in entityKind) {
    if (entityKind.hasOwnProperty(key)) {
      if (objectKind === entityKind[key]) {
        return `LOG_${key}`
      }
    }
  }
  return null
}

const undoRecords = ({ webMap: { undoRecords } }) => undoRecords
const objects = ({ webMap: { objects } }) => objects
const undoPosition = ({ webMap: { undoPosition } }) => undoPosition
const unitsById = ({ orgStructures: { unitsById } }) => unitsById

export const userEvents = createSelector(
  undoRecords,
  objects,
  undoPosition,
  unitsById,
  (undoRecords, objects, undoPosition, unitsById) => {
    const existingRecords = undoRecords.filter((_, index) => index < undoPosition)

    return existingRecords.slice(-LIMIT_LOG_ITEMS).map(({ changeType, id, timestamp }) => {
      const objectById = objects.get(id)
      let objFullName = ''
      if (objectById) {
        const objectTypeKey = getObjectKeyByKind(objectById.type)

        objFullName = `${i18n[objectTypeKey]}`

        if (unitsById) {
          const unitId = objectById.get('unit')
          const unit = unitsById[unitId]
          objFullName = unit ? `${objFullName} (${unit.fullName})` : objFullName
        }
      }

      const eventNameKey = getChangeTypeKeyByEvent(changeType)
      const event = `${i18n[eventNameKey]} ${objFullName}`

      return {
        event,
        timestamp,
        id,
      }
    }).reverse()
  })
