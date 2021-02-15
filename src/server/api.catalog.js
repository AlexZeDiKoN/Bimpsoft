import { getDirect } from './implementation/utils.rest'

const catalogUrl = '/catalog'

export default {
  getTree: () =>
    getDirect(`${catalogUrl}/catalogCategory`, false),
  getList: (catalogId) =>
    getDirect(`${catalogUrl}/catalogCategoryObjects/?catalogId=${catalogId}`, false),
  getCatalogItem: (itemId) => getDirect(`${catalogUrl}/catalogCategoryObjects/${itemId}`, false),
  getCatalogItemInfo: (itemId) => getDirect(`${catalogUrl}/catalogCategory/${itemId}`, false),
  getTopographicObjectFields: (codes) => getDirect(`${catalogUrl}/topographicObjects/getFields`, { codes }),
  getTopographicObjects: ({ zoom, points, filters, topocode }) =>
    getDirect(`${catalogUrl}/topographicObjects/get`, { zoom, points, filters, topocode }),

}
