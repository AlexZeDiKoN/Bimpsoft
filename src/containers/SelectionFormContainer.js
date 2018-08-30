import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { SEGMENT_ARC, SEGMENT_DIRECT } from '../components/SelectionForm/ShapeForm'
import SelectionForm from '../components/SelectionForm'
import * as selectionActions from '../store/actions/selection'
import * as templatesActions from '../store/actions/templates'
import * as viewModesKeys from '../constants/viewModesKeys'
import SelectionTypes from '../constants/SelectionTypes'

const updateActions = {
  edit: selectionActions.updateSelection,
  create: selectionActions.updateNewShape,
}

const updateTypeBySegment = (data) => {
  switch (data.segment) {
    case SEGMENT_DIRECT:
      switch (data.type) {
        case SelectionTypes.AREA:
          data.type = SelectionTypes.POLYGON
          break
        case SelectionTypes.CURVE:
          data.type = SelectionTypes.POLYLINE
          break
        default:
          break
      }
      break
    case SEGMENT_ARC:
      switch (data.type) {
        case SelectionTypes.POLYGON:
          data.type = SelectionTypes.AREA
          break
        case SelectionTypes.POLYLINE:
          data.type = SelectionTypes.CURVE
          break
        default:
          break
      }
      break
    default:
      break
  }
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
    updateTypeBySegment(data)
    return dispatch(updateActions[showForm](data))
  },
  onAddToTemplates: templatesActions.setForm,
  onCancel: () => selectionActions.hideForm,
}, dispatch)

const SelectionFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectionForm)

export default SelectionFormContainer
