import { printToFile } from '../actions'

const initialState = {
  printFiles: {},
}

export default function (state = initialState, action) {
  const { type, payload } = action
  switch (type) {
    case printToFile.PRINT_FILE_SET: {
      return { ...state, printFiles: { ...state.printFiles, [payload.id]: payload } }
    }
    case printToFile.PRINT_FILE_REMOVE: {
      const printFiles = { ...state.printFiles }
      delete printFiles[payload]
      return { ...state, printFiles }
    }
    default:
      return state
  }
}
