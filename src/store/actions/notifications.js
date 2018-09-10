import { action } from '../../utils/services'

export const PUSH_NOTIFICATION = action('PUSH_NOTIFICATION')
export const POP_NOTIFICATION = action('POP_NOTIFICATION')

export const push = (data) => ({
  type: PUSH_NOTIFICATION,
  data,
})

export const pop = (id) => ({
  type: POP_NOTIFICATION,
  id,
})
