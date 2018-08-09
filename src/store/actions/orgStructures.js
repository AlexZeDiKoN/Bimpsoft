import { action } from '../../utils/services'

export const SET_ORG_STRUCTURES = action('SET_ORG_STRUCTURES')

export const set = (data) => ({
  type: SET_ORG_STRUCTURES,
  data,
})
