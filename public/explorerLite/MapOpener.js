const ACTION_READY = 'ready'
const ACTION_INIT = 'init'
const ACTION_OPEN = 'open'

export default class MapOpener {
  constructor (mapUrl) {
    this.mapUrl = mapUrl
    this.wnd = null
    this.ready = false
    this.queue = []
  }

  init () {
    window.addEventListener('message', (e) => this.onMessage(e))
  }

  send (obj) {
    const msg = JSON.stringify(obj)
    if (this.wnd === null) {
      this.queue.push(msg)
      this.ready = false
      this.wnd = window.open('', 'map', '', true)
      if (this.wnd.location.href === 'about:blank') {
        this.wnd.location.href = this.mapUrl
      } else {
        const initMsg = JSON.stringify({ action: ACTION_INIT })
        this.postMessage(initMsg)
      }
    } else if (this.wnd.closed) {
      this.ready = false
      this.queue.push(msg)
      this.wnd = window.open(this.mapUrl, 'map', '', true)
    } else if (!this.ready) {
      this.queue.push(msg)
    } else {
      this.postMessage(msg)
    }
  }

  open (operationId, folderId) {
    this.send({ action: ACTION_OPEN, operationId, folderId })
  }

  postMessage (msg) {
    console.log('postMessage', msg)
    this.wnd.postMessage(msg, '*')
  }

  onMessage (e) {
    const data = (typeof e.data === 'object') ? e.data : JSON.parse(e.data)
    console.log(data)
    const { action } = data
    switch (action) {
      case ACTION_READY: {
        this.ready = true
        this.queue.forEach((msg) => this.postMessage(msg))
        this.queue = []
        break
      }
    }
  }
}
