import { maps } from '../store/actions'
import { getExplorerOrigin } from '../utils/services'

const ACTION_READY = 'ready'
const ACTION_INIT = 'init'
const ACTION_OPEN = 'open'
const ACTION_CLOSE = 'close'

export default class ExplorerBridge {
  constructor (store) {
    this.store = store
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
    const msg = JSON.stringify(obj)
    this.postMessage(msg)
  }

  postMessage = (msg) => {
    window.opener.postMessage(msg, getExplorerOrigin())
    console.info(`Message sent`, msg)
  }

  onMessage = (e) => {
    const data = (typeof e.data === 'object') ? e.data : JSON.parse(e.data)
    const { action } = data
    switch (action) {
      case ACTION_INIT: {
        console.info('action', ACTION_INIT)
        this.send({ action: ACTION_READY })
        break
      }
      case ACTION_OPEN: {
        console.info('action', ACTION_OPEN)
        const { mapId, layerId } = data
        this.store.dispatch(maps.openMapFolder(mapId, layerId))
        break
      }
      default:
    }
  }

  onUnload = () => {
    this.send({ action: ACTION_CLOSE })
  }
}
