import { getDirect } from './implementation/utils.rest'
import { requiredParam } from './requiredParam'

const namespace = '/hub/explorer/v2'

export default {
  getTypeKinds: (typeCode = requiredParam('typeCode')) =>
    getDirect(`${namespace}/map/GetTypeKinds`, { typeCode }),
  // TODO: fetch segments from server
  getSegments: (startCoord, possibleTypes) => new Promise((resolve) => {
    const segments = localStorage.getItem('march:segments')
    const timeout = setTimeout(() => {
      clearTimeout(timeout)
      resolve(JSON.parse(segments))
    }, 300)
  }),
}
