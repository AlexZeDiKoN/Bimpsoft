import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { SEGMENT_ARC, SEGMENT_DIRECT } from '../components/SelectionForm/ShapeForm'
import SelectionForm from '../components/SelectionForm'
import * as selectionActions from '../store/actions/selection'
import * as templatesActions from '../store/actions/templates'
import * as viewModesKeys from '../constants/viewModesKeys'
import SelectionTypes from '../constants/SelectionTypes'

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
  if (data) {
    switch (data.type) {
      case SelectionTypes.AREA:
      case SelectionTypes.CURVE:
        data.segment = SEGMENT_ARC
        break
      case SelectionTypes.POLYGON:
      case SelectionTypes.POLYLINE:
        data.segment = SEGMENT_DIRECT
        break
      default:
        break
    }
  }
  return { canEdit, showForm, data, orgStructures: { byIds, roots, formation } }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  onChange: (data) => (_, getState) => {
    const { selection: { showForm } } = getState()
    switch (showForm) {
      case 'edit':
        console.log('Update shape: ', data)
        return dispatch(selectionActions.updateSelection(data))
      case 'create':
        console.log('Create shape: ', data)
        return dispatch(selectionActions.updateNewShape(data))
      default:
        break
    }
  },
  onAddToTemplates: templatesActions.setForm,
  onCancel: () => selectionActions.hideForm,
}, dispatch)

const SelectionFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectionForm)

export default SelectionFormContainer
