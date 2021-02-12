import { maps, webMap, task, march } from '../store/actions'
import { getExplorerOrigin } from '../utils/services'
import { catchError } from '../store/actions/asyncAction'

/**
 * @description
 *   Ці константи мають співпадати з одноіменними з проекту Explorer (./src/utils/MapOpener.js)
 *   Зміни внисити синхронно!
 */
const ACTION_READY = 'ready'
const ACTION_INIT = 'init'
const ACTION_OPEN = 'open'
const ACTION_OPEN_VARIANT = 'open variant'
const ACTION_CLOSE_VARIANT = 'close variant'
const ACTION_VARIANT_RESULT = 'variant result'
const SHOW_TASK_MODAL_REQUEST = 'show task modal request'
const SHOW_TASK_MODAL_RESPONSE = 'show task modal response'
const SAVE_TASK = 'save task'
const SAVE_TASK_RESPONSE = 'save task response'
const SEND_TASK = 'send task'
const SEND_TASK_RESPONSE = 'send task response'
const ACTION_CLOSE = 'close'
const ACTION_SHOW_UNIT = 'show unit'
const ACTION_GET_UNIT_INDICATORS = 'get unit indicators'
const ACTION_RETURN_UNIT_INDICATORS = 'unit indicators result'
const ACTION_OPEN_COORDINATE = 'open coordinate'
const ACTION_OPEN_MILSYMBOL = 'open milsymbol'
const OPEN_MARCH = 'open march'
const SAVE_MARSH = 'save march'

export default class ExplorerBridge {
  constructor (store) {
    this.store = store
    this.abandoned = false
    this.openedVariantMapId = null
  }

  init = (authorized = false) => {
    if (!authorized) {
      window.addEventListener('message', this.onMessage)
      window.addEventListener('beforeunload', this.onUnload)
    } else {
      const isExplorerOpened = window.opener && !window.opener.closed
      if (isExplorerOpened) {
        this.send({ action: ACTION_READY })
      }
    }
  }

  send = (obj) => {
    if (!window.opener) {
      console.warn(`Message not sent (no opener)`)
    } else if (this.abandoned) {
      console.warn('Message not sent (abandoned)')
    } else if (window.opener.closed) {
      console.warn('Message not sent (closed)')
    } else {
      const msg = JSON.stringify({ ...obj, sender: 'WebMap' })
      window.opener.postMessage(msg, getExplorerOrigin())
      console.info(`Message sent`, msg)
      return true
    }
  }

  onMessage = (e) => {
    const data = (typeof e.data === 'object') ? e.data : JSON.parse(e.data)
    const { action, sender } = data
    if (sender === 'Explorer') {
      delete data.sender
      console.info('Message from Explorer >> ', JSON.stringify(data, null, 2))
      switch (action) {
        case ACTION_INIT: {
          this.abandoned = false
          this.send({ action: ACTION_READY })
          break
        }
        case ACTION_OPEN: {
          const { mapId, layerId } = data
          catchError(maps.openMapFolder)(mapId, layerId)(this.store.dispatch)
          break
        }
        case ACTION_RETURN_UNIT_INDICATORS: {
          const { indicatorsData, unitId } = data
          catchError(webMap.updateUnitObjectWithIndicators)({ indicatorsData, unitId })(this.store.dispatch)
          break
        }
        case ACTION_CLOSE: {
          this.abandoned = true
          catchError(maps.clearVariant)(null, true)(this.store.dispatch)
          break
        }
        case ACTION_OPEN_VARIANT: {
          const { mapId, variantId } = data
          catchError(maps.openMapFolderVariant)(mapId, variantId)(this.store.dispatch)
          this.openedVariantMapId = mapId
          break
        }
        case ACTION_CLOSE_VARIANT: {
          const { variantId } = data
          catchError(maps.clearVariant)(variantId, true)(this.store.dispatch)
          break
        }
        case SHOW_TASK_MODAL_RESPONSE: {
          catchError(task.showModalResponse)(data.modalData, data.context, data.errors)(this.store.dispatch)
          break
        }
        case SAVE_TASK_RESPONSE: {
          catchError(task.saveResponse)(data.errors, data.id, data.context)(this.store.dispatch)
          break
        }
        case SEND_TASK_RESPONSE: {
          catchError(task.sendResponse)(data.errors, data.id, data.context)(this.store.dispatch)
          break
        }
        case ACTION_OPEN_COORDINATE: {
          const { mapId, coordinate } = data
          catchError(maps.openMapByCoord)(mapId, coordinate)(this.store.dispatch)
          break
        }
        case ACTION_OPEN_MILSYMBOL: {
          const { mapId, milSymbol: object } = data
          catchError(maps.openMapByObject)(mapId, object)(this.store.dispatch)
          break
        }
        case OPEN_MARCH: {
          catchError(march.openMarch)(data.payload)(this.store.dispatch)
          break
        }
        default:
      }
    }
  }

  onUnload = () => this.send({ action: ACTION_CLOSE })

  cancelVariant = (variantId = null) => this.send({ action: ACTION_CLOSE_VARIANT, variantId })

  variantResult = (variantId, result) => this.send({ action: ACTION_VARIANT_RESULT, variantId, result })

  showTaskModalRequest = (payload, context) => this.send({ action: SHOW_TASK_MODAL_REQUEST, payload, context })

  saveTask = (payload, context) => this.send({ action: SAVE_TASK, payload, context })

  sendTask = (payload, context) => this.send({ action: SEND_TASK, payload, context })

  showUnitInfo = (type, unitId) => this.send({ action: ACTION_SHOW_UNIT, type, unitId })

  getUnitIndicators = (unitId, formationId) => this.send({ action: ACTION_GET_UNIT_INDICATORS, unitId, formationId })

  saveMarch = (data = {}) => this.send({ action: SAVE_MARSH, payload: data })
}
