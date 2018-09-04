import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { notification } from 'antd'
import SelectionForm from '../components/SelectionForm'
import * as selectionActions from '../store/actions/selection'
import * as templatesActions from '../store/actions/templates'
import * as viewModesKeys from '../constants/viewModesKeys'
import i18n from '../i18n'

const updateActions = {
  edit: selectionActions.updateSelection,
  create: selectionActions.updateNewShape,
}

const mapStateToProps = (store) => {
  const { selection, orgStructures, viewModes: { [viewModesKeys.edit]: canEdit } } = store
  const { byIds, roots, formation } = orgStructures
  const { showForm } = selection
  let data = null
  if (showForm === 'create') {
    data = selection.newShape
  } else if (showForm === 'edit') {
    data = selection.data
  }
  return { canEdit, showForm, data, orgStructures: { byIds, roots, formation } }
}

const mapDispatchToProps = (dispatch) => {
  const actions = bindActionCreators({
    onChange: (formType, data) => updateActions[formType](data),
    onAddToTemplates: templatesActions.setForm,
    onCancel: () => selectionActions.hideForm,
  }, dispatch)

  actions.onError = (errors) => {
    const message = i18n.ERROR
    const description = errors.join(',/r/n')
    notification.error({ message, description })
  }

  return actions
}

const SelectionFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectionForm)

export default SelectionFormContainer
