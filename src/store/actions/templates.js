export const SET_TEMPLATE = 'SET_TEMPLATE'
export const SET_TEMPLATE_SELECTED_ID = 'SET_TEMPLATE_SELECTED_ID'
export const SET_TEMPLATE_FORM = 'SET_TEMPLATE_FORM'
export const REMOVE_TEMPLATE = 'REMOVE_TEMPLATE'

export const setTemplate = (template) => ({ type: SET_TEMPLATE, template })

export const setSelectedId = (id) => ({ type: SET_TEMPLATE_SELECTED_ID, id })

export const setForm = (data) => ({ type: SET_TEMPLATE_FORM, data })

export const remove = (id) => ({ type: REMOVE_TEMPLATE, id })
