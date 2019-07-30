import { maps, webMap } from '../store/actions'
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
const ACTION_CLOSE = 'close'
const ACTION_SHOW_UNIT = 'show unit'
const ACTION_GET_UNIT_INDICATORS = 'get unit indicators'
const ACTION_RETURN_UNIT_INDICATORS = 'unit indicators result'
const ACTION_SHOW_CATALOG_OBJECT = 'show catalog object'

export default class ExplorerBridge {
  constructor (store) {
    this.store = store
    this.abandoned = false
  }

  init = () => {
    window.addEventListener('message', this.onMessage)
    window.addEventListener('beforeunload', this.onUnload)
    const isExplorerOpened = window.opener && !window.opener.closed
    if (isExplorerOpened) {
      this.send({ action: ACTION_READY })
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
          break
        }
        case ACTION_CLOSE_VARIANT: {
          const { variantId } = data
          catchError(maps.clearVariant)(variantId, true)(this.store.dispatch)
          break
        }
        default:
      }
    }
  }

  onUnload = () => this.send({ action: ACTION_CLOSE })

  cancelVariant = (variantId = null) => this.send({ action: ACTION_CLOSE_VARIANT, variantId })

  variantResult = (variantId, result) => this.send({ action: ACTION_VARIANT_RESULT, variantId, result })

  showUnitInfo = (unitId) => this.send({ action: ACTION_SHOW_UNIT, unitId }) ||
    window.open(`/explorer/#/_/military-organization/units/unit/${unitId}`, `explorer`, '', true)

  getUnitIndicators = (unitId, formationId) => this.send({ action: ACTION_GET_UNIT_INDICATORS, unitId, formationId })

  showCatalogObject = (catalogId, objectId) => this.send({ action: ACTION_SHOW_CATALOG_OBJECT, catalogId, objectId }) ||
    window.open(`/explorer/#/_/catalogCategory/${catalogId}/${objectId}`, `explorer`, '', true)
}
