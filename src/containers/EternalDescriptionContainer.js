import { connect } from 'react-redux'
import { eternalPoint } from '../constants/viewModesKeys'
import { viewModeDisable } from '../store/actions/viewModes'
import { updateObjPartially, updateObjectAttributes, updateObjectGeometry } from '../store/actions/webMap'
import EternalDescriptionForm from '../components/EternalDescriptionForm'
import {flexGridAttributes, flexGridData} from '../store/selectors'
import { buildFlexGridGeometry } from '../components/WebMap'

// @TODO: проверить идущие пропсы
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
  const description = position && eternalDescriptions ? eternalDescriptions.getIn(position) : ''
  return {
    coordinates,
    description,
    ...ownProps,
    ...restState,
    onSubmit: (coords, desc) => {
      let geometry = null
      let attrs = null
      if (!coordinates.equals(coords)) {
        console.log('position', position)
        console.log('old coordinates', coordinates)
        console.log('new coordinates', coords)
        console.log('______________')
        console.log('eternals', eternals)
        const eternalLine = [ ...eternals.get(position[0]) ]
        eternalLine.splice(position[1], 1, coords)
        const newEternals = eternals.set(position[0], eternalLine)
        console.log('newEternals', newEternals)
        geometry = buildFlexGridGeometry(newEternals.toArray(), directionSegments.toArray(), zoneSegments.toArray())
        console.log('geometry', geometry)
      }
      if (!(!desc === !description)) {
        console.log('old description', description)
        console.log('new description', desc)
        const descriptionLine = [ ...eternalDescriptions.get(position[0]) ]
        descriptionLine.splice(position[1], 1, desc)
        // @TODO: придмать, как хранить список поясниловок для точек. Заоплнять и отправлять на БЭ. Менять координаты по изменении в окошечке
        const newEternalDesc = eternalDescriptions.set(position[0], descriptionLine)
        console.log('eternalDescriptions', eternalDescriptions)
        console.log('newEternalDesc', newEternalDesc)
        attributes.eternalDescriptions = newEternalDesc
      }
      // const geometryProps = buildFlexGridGeometry(newEternals, newDirectionSegments, newZoneSegments)
      console.log('____SUBMITTED____', id)
      // updateObjPartially()
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
