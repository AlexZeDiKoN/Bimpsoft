
export const PUSH_NOTIFICATION = 'PUSH_NOTIFICATION'
export const POP_NOTIFICATION = 'POP_NOTIFICATION'

export const push = (data) => ({
  type: PUSH_NOTIFICATION,
  data,
})
export const pop = (id) => ({
  type: POP_NOTIFICATION,
  id,
})
