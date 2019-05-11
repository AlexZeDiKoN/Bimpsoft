import { connect } from 'react-redux'
import { eternalPoint } from '../constants/viewModesKeys'
import { viewModeDisable } from '../store/actions/viewModes'
import { updateObjPartially } from '../store/actions/webMap'
import EternalDescriptionForm from '../components/EternalDescriptionForm'
import { flexGridAttributes, flexGridData } from '../store/selectors'
import { buildFlexGridGeometry } from '../components/WebMap'

// @TODO: проверить идущие пропсы
const getNewData = (init, position, val) => {
  const temp = init.get(position[0])
  const line = temp ? [ ...temp ] : []
  line[position[1]] = val
  return init.set(position[0], line)
}

const mapStateToProps = (store) => {
  const { position, coordinates } = store.flexGrid.selectedEternal
  return ({
    visible: store.viewModes[eternalPoint],
    attributes: flexGridAttributes(store),
    flexGrid: flexGridData(store),
    coordinates,
    position,
  })
}

const mapDispatchToProps = {
  hideModal: viewModeDisable,
  updateObjPartially,
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { hideModal, updateObjPartially } = dispatchProps
  const { position, coordinates = {}, attributes, flexGrid, ...restState } = stateProps
  const { eternalDescriptions } = attributes || {}
  const { directionSegments, zoneSegments, eternals, id } = flexGrid
  const descriptionLine = position && eternalDescriptions && eternalDescriptions.get(position[0])
  const description = (descriptionLine && descriptionLine[position[1]]) || ''
  return {
    coordinates,
    description,
    ...ownProps,
    ...restState,
    onSubmit: (coords, desc) => {
      let geom = {}
      let attrs = null
      if (!coordinates.equals(coords)) {
        const newEternals = getNewData(eternals, position, coords)
        geom = buildFlexGridGeometry(newEternals.toArray(), directionSegments.toArray(), zoneSegments.toArray())
      }
      if (!(!desc === !description)) {
        const newEternalDesc = getNewData(eternalDescriptions, position, desc)
        attrs = { ...attributes, eternalDescriptions: newEternalDesc }
      }
      updateObjPartially(id, attrs, geom)
      hideModal(eternalPoint)
    },
    onClose: () => {
      hideModal(eternalPoint)
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(EternalDescriptionForm)
