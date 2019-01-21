import { connect } from 'react-redux'
import { flexGridOptions, showFlexGridOptions } from '../store/selectors'
import FlexGridForm from '../components/FlexGridForm'
import { flexGrid } from '../store/actions'

const mapStateToProps = (store) => {
  const { directions, zones } = flexGridOptions(store)
  return {
    directions,
    zones,
    visible: showFlexGridOptions(store),
  }
}

const mapDispatchToProps = ({
  dropFlexGrid: flexGrid.dropFlexGrid,
  setDirections: flexGrid.setFlexGridDirections,
  setZones: flexGrid.setFlexGridZones,
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FlexGridForm)
