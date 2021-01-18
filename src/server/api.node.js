import { getDirect } from './implementation/utils.rest'

const node = '/node'
const v2 = '/v2'

export default {
  addMapLayer: (body) => getDirect(`${node}${v2}/shortcuts/map_layer/add`, body),
}
