import { connect } from 'react-redux'
import TemplateFormComponent from '../components/TemplateFormComponent'
import * as templatesActions from '../store/actions/templates'
import * as notifications from '../store/actions/notifications'
import i18n from '../i18n'

const mapStateToProps = (store) => ({ selectedTemplate: store.templates.selectedTemplate })

let lastId = 0

const mapDispatchToProps = (dispatch) => ({
  onChange: (data) => {
    data.id = 'tempId_' + (lastId++)
    dispatch(templatesActions.addTemplate(data))
    dispatch(templatesActions.setSelectedTemplate(null))
    dispatch(notifications.push({
      message: i18n.MSG_TITLE_SIGN_TEMPLATE_CREATED,
      description: i18n.MSG_TEXT_SIGN_TEMPLATE_CREATED(data),
    }))
  },
  onCancel: (code) => {
    dispatch(templatesActions.setSelectedTemplate(null))
  },
})
const SelectionFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TemplateFormComponent)

export default SelectionFormContainer
