import { action } from '../../utils/services'
import { asyncAction } from './index'

export const CATALOG_SET_TREE = action('CATALOG_SET_TREE')

export const setTree = (payload) => ({
  type: CATALOG_SET_TREE,
  payload,
})

export const getTree = () =>
  asyncAction.withNotification(async (dispatch, _, { catalogApi }) => dispatch(setTree(await catalogApi.getTree())))
