import { print } from '../actions'

const initState = {
  printStatus: false,
  printScale: 100000,
}

export default function reducer (state = initState, action) {
  const { type, payload } = action
  switch (type) {
    case print.PRINT: {
      const printStatus = !state.printStatus
      return { ...state, printStatus }
    }
    case print.PRINT_SCALE: {
      const printScale = +payload
      return { ...state, printScale }
    }
    default:
      return state
  }
}
