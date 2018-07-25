import * as actions from '../actions/templates'

const initState = {
  byIds: {},
  selectedTemplate: null,
}

export default function reducer (state = initState, action) {
  const { type, template } = action
  switch (type) {
    case actions.ADD_TEMPLATE: {
      return { ...state, byIds: { ...state.byIds, [template.id]: template } }
    }
    case actions.SET_SELECTED_TEMPLATE: {
      return { ...state, selectedTemplate: template }
    }
    default:
      return state
  }
}
