import { march } from '../actions'

const initState = {
  marchEdit: true,
}

export default function reducer (state = initState, action) {
  const { type, payload } = action

  switch (type) {
    default:
      return state
  }
}
