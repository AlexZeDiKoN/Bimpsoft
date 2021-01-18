import { getDirect } from './implementation/utils.rest'

const namespace = '/hub/explorer/v2/cmn'

export default {
  getDictionaries: () => getDirect(`${namespace}/Dictionaries_All`, {}),
}
