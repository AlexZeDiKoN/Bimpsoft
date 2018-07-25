export const ADD_TEMPLATE = 'ADD_TEMPLATE'
export const SET_SELECTED_TEMPLATE = 'SET_SELECTED_TEMPLATE'

export const addTemplate = (template) => ({ type: ADD_TEMPLATE, template })

export const setSelectedTemplate = (template) => ({ type: SET_SELECTED_TEMPLATE, template })
