import { connect } from 'react-redux'
import { eternalPoint } from '../constants/viewModesKeys'
import { viewModeDisable } from '../store/actions/viewModes'
import { updateObjectAttributes } from '../store/actions/webMap'
import EternalDescriptionForm from '../components/EternalDescriptionForm'

// @TODO: проверить идущие пропсы
const mapStateToProps = (store) => {
  const { position, coordinates } = store.flexGrid.selectedEternal
  const descriptions = store.flexGrid.flexGrid.eternalsDescription
  return ({
    visible: store.viewModes[eternalPoint],
    description: position ? descriptions.getIn(position) : '',
    coordinates,
  })
}
const mapDispatchToProps = {
  hideModal: viewModeDisable,
  updateObjectAttributes,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EternalDescriptionForm)
