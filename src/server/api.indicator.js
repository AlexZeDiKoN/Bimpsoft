import { getDirect } from './implementation/utils.rest'
import { requiredParam } from './requiredParam'

const namespace = '/explorer/explorer/v2'

export default {
  getTypeKinds: (typeCode = requiredParam('typeCode')) =>
    getDirect(`${namespace}/map/GetTypeKinds`, { typeCode }),
}
