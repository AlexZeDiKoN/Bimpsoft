import { getDirect } from './implementation/utils.rest'
import { requiredParam } from './requiredParam'

const namespace = '/hub/explorer/v2'
const namespace2 = '/hub/explorer/v2'

export default {
  getTypeKinds: (typeCode = requiredParam('typeCode')) =>
    getDirect(`${namespace}/map/GetTypeKinds`, { typeCode }),
  getMarchMetric: (param1, param2) => {
    const res = getDirect(`${namespace2}/getMarchMetric`, { param1, param2 })

    console.log('---', res)

    return res
  },
  // TODO: fetch segments from server
  getSegments: (startCoord, possibleTypes) => new Promise((resolve) => {
    const march = localStorage.getItem('march:storage')
    const timeout = setTimeout(() => {
      clearTimeout(timeout)
      resolve(JSON.parse(march).segments || [])
    }, 300)
  }),
  // TODO: fetch landmarks from server
  getLandmarks: (coords) => new Promise((resolve) => {
    const landmarks = localStorage.getItem('march:landmarks')
    const timeout = setTimeout(() => {
      clearTimeout(timeout)
      resolve(JSON.parse(landmarks) || [])
    }, 300)
  }),
}
