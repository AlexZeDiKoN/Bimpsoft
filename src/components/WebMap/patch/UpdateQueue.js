import debounce from 'debounce'

const PART_SIZE = 5
const SLOW_TIMEOUT = 1000
const QUICK_TIMEOUT = 20

export default class UpdateQueue {
  constructor (map) {
    this.map = map
    this.map.on('layeradd', this.layerAddHandler)
    this.map.on('layerremove', this.layerRemoveHandler)
    this.timeout = null
    this.intervalId = null
    this.layers = []
  }

  layerAddHandler = ({ layer }) => {
    this.layers.unshift(layer)
    this.setTimeout(QUICK_TIMEOUT)
  }

  layerRemoveHandler = ({ layer }) => {
    this.layers = this.layers.filter((item) => item !== layer)
  }

  pauseUpdater = () => {
    this.resumeUpdater.clear()
    this.pause()
  }

  resumeUpdater = debounce(() => {
    this.resume()
  }, 1000)

  processUpdateQueue () {
    const layers = this.layers
    const n = layers.length
    let nProcessed = 0
    for (let layerI = 0; layerI < n; layerI++) {
      const layer = layers[layerI]
      const isProcessed = layer.optimize && layer.optimize()
      if (isProcessed) {
        nProcessed++
        if (nProcessed >= PART_SIZE) {
          this.setTimeout(QUICK_TIMEOUT)
          return
        }
      }
    }
    this.setTimeout(SLOW_TIMEOUT)
  }

  setTimeout (timeout) {
    if (this.timeout !== timeout) {
      // console.log(`UpdateQueue: setTimeout ${timeout}`)
      this.timeout = timeout
      if (!this.isPaused) {
        if (this.intervalId) {
          clearInterval(this.intervalId)
        }
        this.intervalId = setInterval(this.processUpdateQueue.bind(this), this.timeout)
      }
    }
  }

  pause () {
    this.isPaused = true
    // console.log('UpdateQueue: pause')
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  resume () {
    // console.log('UpdateQueue: resume')
    this.isPaused = false
    if (!this.intervalId) {
      this.intervalId = setInterval(this.processUpdateQueue.bind(this), this.timeout)
    }
  }
}
