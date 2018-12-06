import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { notification } from 'antd'
import SelectionForm from '../components/SelectionForm'
import * as selectionActions from '../store/actions/selection'
import * as templatesActions from '../store/actions/templates'
import i18n from '../i18n'
import { canEditSelector } from '../store/selectors'
import { FormTypes } from '../constants'
import { toSelection } from '../utils/mapObjConvertor'

const updateActions = {
  [FormTypes.EDIT]: selectionActions.updateSelection,
  [FormTypes.CREATE]: selectionActions.finishNewShape,
}

const mapStateToProps = (store) => {
  const { selection, orgStructures, webMap: { objects } } = store
  const canEdit = canEditSelector(store)
  const { byIds, roots, formation } = orgStructures
  const { showForm } = selection
  let data = null
  if (showForm === FormTypes.CREATE) {
    data = selection.newShape
  } else if (showForm === FormTypes.EDIT) {
    if (selection.list.length === 1) {
      const object = objects.get(selection.list[0])
      data = object ? toSelection(object) : null
    }
  }
  return { canEdit, showForm, data, orgStructures: { byIds, roots, formation } }
}

const mapDispatchToProps = (dispatch) => {
  const actions = bindActionCreators({
    onChange: (formType, data) => updateActions[formType](data),
    onAddToTemplates: templatesActions.setForm,
    onCancel: selectionActions.hideForm,
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
