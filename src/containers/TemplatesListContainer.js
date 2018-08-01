import { connect } from 'react-redux'
import TemplatesList from '../components/TemplatesList'
import * as templatesActions from '../store/actions/templates'

const mapStateToProps = (store) => ({
  templates: store.templates,
  visible: store.viewModes.pointSignsList,
})

const mapDispatchToProps = (dispatch) => ({
  onAddTemplate: () => {
    dispatch(templatesActions.setForm({}))
  },
  onSelectTemplate: (id) => {
    dispatch(templatesActions.setSelectedId(id))
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
