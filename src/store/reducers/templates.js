import * as actions from '../actions/templates'

const initState = {
  byIds: {},
  selectedId: null,
  form: null,
}

export default function reducer (state = initState, action) {
  const { type } = action
  switch (type) {
    case actions.SET_TEMPLATE: {
      const { template } = action
      return { ...state, byIds: { ...state.byIds, [template.id]: template } }
    }
    case actions.SET_TEMPLATE_SELECTED_ID: {
      return { ...state, selectedId: action.id }
    }
    case actions.SET_TEMPLATE_FORM: {
      return { ...state, form: action.data }
    }
    case actions.REMOVE_TEMPLATE: {
      const { id } = action
      let { byIds, selectedId, form } = state
      byIds = { ...byIds }
      delete byIds[id]
      if (selectedId === id) {
        selectedId = null
      }
      return { byIds, selectedId, form }
    }
    default:
      return state
  }
}
