/**
 * Created by pavlo.cherevko (melight@ex.ua) on 7/15/2019
 */
import { ovtPost } from './implementation/utils.rest'

const namespace = '/explorer/v2/ovt'

export default {
  getOvtList: () => ovtPost(namespace, '/OvtInfo', 'List'),
}
