import { data } from '@C4/CommonComponents'
import { targetCatalog } from '../actions'

const { TextFilter } = data

const initState = {
  textFilter: null,
}

export default function reducer (state = initState, action) {
  const { type } = action
  switch (type) {
    case targetCatalog.TARGET_CATALOG_FILTER_TEXT: {
      const { filterText } = action
      const textFilter = TextFilter.create(filterText)
      return { ...state, textFilter }
    }
    default:
      return state
  }
}
