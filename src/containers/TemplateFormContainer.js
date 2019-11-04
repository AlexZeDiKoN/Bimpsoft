import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import TemplateForm from '../components/TemplateForm'
import * as templatesActions from '../store/actions/templates'
import * as notifications from '../store/actions/notifications'
import i18n from '../i18n'

const templateForm = createSelector(
  (state) => state.templates,
  (templates) => {
    const { form, byIds } = templates
    if (form === null) {
      return null
    }
    return form.id !== null && byIds.hasOwnProperty(form.id) ? { ...byIds[form.id], ...form } : form
  }
)

const mapStateToProps = (state) => ({ templateForm: templateForm(state) })

let lastId = 0

const mapDispatchToProps = (dispatch) => ({
  onChange: (data) => {
    if (!data.id) {
      data.id = 'tempId_' + (lastId++)
    }
    dispatch(templatesActions.setTemplate(data))
    dispatch(templatesActions.setForm(null))
    dispatch(notifications.push({
      message: i18n.MSG_TITLE_SIGN_TEMPLATE_CREATED,
      description: i18n.MSG_TEXT_SIGN_TEMPLATE_CREATED(data),
    }))
  },
  onCancel: (code) => {
    dispatch(templatesActions.setForm(null))
  },
})

const SelectionFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TemplateForm)

export default SelectionFormContainer
