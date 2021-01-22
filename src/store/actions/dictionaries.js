import { action } from '../../utils/services'
import { asyncAction } from './index'

export const GET_DICTIONARIES = action('GET_DICTIONARIES')
export const CLEAR_DICTIONARIES = action('CLEAR_DICTIONARIES')

const setDictionaries = (payload) => ({
  type: GET_DICTIONARIES,
  payload,
})

const clearDictionaries = () => ({ type: CLEAR_DICTIONARIES })

export const getDictionaries = () => asyncAction.withNotification(async (dispatch, _, { dictionariesApi }) => {
  const response = await dictionariesApi.getDictionaries()
  if (response.success) {
    dispatch(setDictionaries(response.payload))
  } else {
    dispatch(clearDictionaries())
  }
})
