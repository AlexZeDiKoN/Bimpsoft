const PART_SIZE = 5
const TIMEOUT = 20
export default class UpdateQueue {
  constructor () {
    this.updateQueue = new Set()
    this.intervalId = null
  }

  addToUpdateQueue (obj) {
    this.updateQueue.add(obj)
    if (!this.isPaused && !this.intervalId) {
      console.log('UpdateQueue: start')
      this.intervalId = setInterval(this.processUpdateQueue.bind(this), TIMEOUT)
    }
  }

  checkQueueForStop () {
    if (this.intervalId && !this.updateQueue.size) {
      console.log('UpdateQueue: stop')
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  removeFromUpdateQueue (obj) {
    this.updateQueue.delete(obj)
    this.checkQueueForStop()
  }

  processUpdateQueue () {
    let i = 0
    for (const obj of this.updateQueue) {
      obj.recreateIcon()
      this.updateQueue.delete(obj)
      if (++i > PART_SIZE) {
        break
      }
    }
    this.checkQueueForStop()
  }

  pause () {
    if (this.intervalId) {
      this.isPaused = true
      console.log('UpdateQueue: pause')
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  resume () {
    if (!this.intervalId && this.updateQueue.size) {
      console.log('UpdateQueue: resume')
      this.isPaused = false
      this.intervalId = setInterval(this.processUpdateQueue.bind(this), TIMEOUT)
    }
  }
}
