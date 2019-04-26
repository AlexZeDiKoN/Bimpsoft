import { getCatalogURL } from '../utils/services'
import { getDirect } from './implementation/utils.rest'

const catalogUrl = getCatalogURL()

export default {
  getTree: () =>
    getDirect(`${catalogUrl}/catalogCategory`, false),
}