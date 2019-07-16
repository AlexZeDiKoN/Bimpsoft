/**
 * Created by pavlo.cherevko (melight@ex.ua) on 7/15/2019
 */
import { getDirect } from './implementation/utils.rest'

const namespace = '/explorer/v2/ovt'

export default {
  getOvtList: () => getDirect(`/OvtInfo_List`, {}, namespace),
}
