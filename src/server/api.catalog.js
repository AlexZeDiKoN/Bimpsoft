import { getDirect } from './implementation/utils.rest'

const catalogUrl = '/catalog'

export default {
  getTree: () =>
    getDirect(`${catalogUrl}/catalogCategory`, false),
  getList: (catalogId) =>
    getDirect(`${catalogUrl}/catalogCategoryObjects/?catalogId=${catalogId}`, false),
  getCatalogItem: (itemId) => getDirect(`${catalogUrl}/catalogCategoryObjects/${itemId}`, false),
}
