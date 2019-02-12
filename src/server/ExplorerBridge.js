import { maps } from '../store/actions'
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

    setTimeout(() => {
      catchError(maps.openMapFolderVariant)('5c0e38556a16f415a1000001', 555)(this.store.dispatch)
    }, 7000)
  }

  send = (obj) => {
    if (!window.opener) {
      console.warn(`Message not sent (no opener)`)
    } else if (this.abandoned) {
      console.warn('Message not sent (abandoned)')
    } else if (window.opener.closed) {
      console.warn('Message not sent (closed)')
    } else {
      const msg = JSON.stringify(obj)
      window.opener.postMessage(msg, getExplorerOrigin())
      console.info(`Message sent`, msg)
    }
  }

  onMessage = (e) => {
    const data = (typeof e.data === 'object') ? e.data : JSON.parse(e.data)
    const { action } = data
    if (action) {
      console.info('Message from Explorer >> ', JSON.stringify(data, null, 2))
    }
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

  onUnload = () => {
    this.send({ action: ACTION_CLOSE })
  }

  cancelVariant = (variantId = null) => {
    this.send({ action: ACTION_CLOSE_VARIANT, variantId })
  }

  variantResult = (variantId, result) => {
    this.send({ action: ACTION_VARIANT_RESULT, variantId, result })
  }
}
