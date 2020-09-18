import { action } from '../../utils/services'
import { changeTypes } from './webMap'
import { layersById } from '../selectors'

const contacts = {}

export const actionNames = {
  LOG_CHANGE: action('LOG_CHANGE'),
}

const contactName = async (userId, getContactName) => {
  let userName = contacts[userId]
  if (!userName) {
    const data = await getContactName(userId)
    if (data) {
      const { contactName } = data
      userName = contactName
      contacts[userId] = contactName
    } else {
      userName = `#${userId}`
    }
  }
  return userName
}

export const logDeleteList = (ids) => async (dispatch, getState, { webmapApi: { getContactName, objRefreshFull } }) => {
  const one = ids && ids[0]
  if (one) {
    const updated = await objRefreshFull(one)
    const mapId = layersById(getState())[updated.layer]?.mapId
    const userId = updated.deleted_by_id
    if (mapId) {
      dispatch({
        type: actionNames.LOG_CHANGE,
        payload: {
          mapId,
          layerId: updated.layer,
          objectId: ids.length > 1 ? ids : one,
          changeType: ids.length > 1 ? changeTypes.DELETE_LIST : changeTypes.DELETE_OBJECT,
          changeDate: updated.deleted,
          userId,
          userName: await contactName(userId, getContactName),
        },
      })
    }
  }
}

export const logRefreshList = (ids) => async (dispatch, getState, { webmapApi: { getContactName, objRefreshFull } }) => {
  const one = ids && ids[0]
  if (one) {
    const updated = await objRefreshFull(one)
    const mapId = layersById(getState())[updated.layer]?.mapId
    const userId = updated.updated_by_id || updated.inserted_by_id
    if (mapId) {
      dispatch({
        type: actionNames.LOG_CHANGE,
        payload: {
          mapId,
          layerId: updated.layer,
          objectId: ids.length > 1 ? ids : one,
          changeType: ids.length > 1 ? 'INSERT_LIST' : changeTypes.INSERT_OBJECT,
          changeDate: updated.updated || updated.inserted,
          userId,
          userName: await contactName(userId, getContactName),
        },
      })
    }
  }
}

export const logChange = (object) => async (dispatch, getState, { webmapApi: { getContactName } }) => {
  const {
    id: objectId, layer: layerId,
    inserted, updated, deleted,
    inserted_by_id: insertedBy, updated_by_id: updatedBy, deleted_by_id: deletedBy,
  } = object

  let changeDate, changeType, userId

  if (deleted) {
    changeDate = deleted
    changeType = changeTypes.DELETE_OBJECT
    userId = deletedBy
  } else if (updated) {
    changeDate = updated
    changeType = changeTypes.UPDATE_OBJECT
    userId = updatedBy
  } else if (inserted) {
    changeDate = inserted
    changeType = changeTypes.INSERT_OBJECT
    userId = insertedBy
  }

  if (userId) {
    const state = getState()
    const mapId = layersById(state)[layerId]?.mapId

    if (mapId) {
      dispatch({
        type: actionNames.LOG_CHANGE,
        payload: {
          mapId,
          layerId,
          objectId,
          changeType,
          changeDate,
          userId,
          userName: await contactName(userId, getContactName),
        },
      })
    }
  }
}
