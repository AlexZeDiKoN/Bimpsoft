import { connect } from 'react-redux'
import TemplatesList from '../components/TemplatesList'
import * as templatesActions from '../store/actions/templates'
import * as ViewModesKeys from '../constants/viewModesKeys'
import * as selectionActions from '../store/actions/selection'
import SelectionTypes from '../constants/SelectionTypes'

const mapStateToProps = (store) => {
  const { template } = store.selection.newShape
  return {
    templates: store.templates,
    visible: store.viewModes[ViewModesKeys.pointSignsList],
    selectedTemplateId: template ? template.id : null,
  }
}

const mapDispatchToProps = (dispatch) => ({
  onAddTemplate: () => {
    dispatch(templatesActions.setForm({}))
  },
  onSelectTemplate: (template) => {
    dispatch(selectionActions.setNewShape({ type: SelectionTypes.POINT, template: template }))
  },
  onEditTemplate: (id) => {
    dispatch(templatesActions.setForm({ id }))
  },
  onRemoveTemplate: (id) => {
    dispatch(templatesActions.remove(id))
  },
})

const TemplatesListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TemplatesList)

export default TemplatesListContainer
