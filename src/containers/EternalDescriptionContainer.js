import { connect } from 'react-redux'
import { batchActions } from 'redux-batched-actions'
import { eternalPoint } from '../constants/viewModesKeys'
import { viewModeDisable } from '../store/actions/viewModes'
import { updateObjPartially } from '../store/actions/webMap'
import { selectEternal, changeEternal } from '../store/actions/flexGrid'
import EternalDescriptionForm from '../components/EternalDescriptionForm'
import { flexGridAttributes, flexGridData } from '../store/selectors'
import { buildFlexGridGeometry } from '../components/WebMap'

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
  onClose: () => batchActions([
    viewModeDisable(eternalPoint),
    selectEternal(),
  ]),
  updateObjPartially,
  changeEternal,
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { onClose, updateObjPartially, changeEternal } = dispatchProps
  const { position, coordinates = {}, attributes, flexGrid, ...restState } = stateProps
  const { directionSegments, zoneSegments, eternals, id } = flexGrid

  const { eternalDescriptions } = attributes || {}
  const descriptionLine = position && eternalDescriptions && eternalDescriptions.get(position[0])
  const description = (descriptionLine && descriptionLine[position[1]]) || ''

  return {
    coordinates,
    description,
    onClose,
    ...ownProps,
    ...restState,
    onSubmit: async (coords, desc) => {
      let geom, attrs
      if (!coordinates.equals(coords)) {
        const newEternals = getNewData(eternals, position, coords)
        geom = buildFlexGridGeometry(newEternals.toArray(), directionSegments.toArray(), zoneSegments.toArray())
      }
      if (desc !== description) {
        const newEternalDesc = getNewData(eternalDescriptions, position, desc)
        attrs = { ...attributes, eternalDescriptions: newEternalDesc }
      }
      (geom || attrs) && await updateObjPartially(id, attrs, geom)
      geom && await changeEternal(position, coords)
      onClose()
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(EternalDescriptionForm)
