import { connect } from 'react-redux'
import WrappedMarch from '../components/common/March'
import { march } from '../store/actions'
import { catchErrors } from '../store/actions/asyncAction'

const mapStateToProps = ({ march: {
  indicators,
  segments,
  integrity,
  pointsTypes,
  time,
  distance } }) => ({
  indicators,
  segmentList: segments,
  integrity,
  pointsTypes,
  time,
  distance,
})

const mapDispatchToProps = {
  setMarchParams: march.setMarchParams,
  setIntegrity: march.setIntegrity,
  editFormField: march.editFormField,
  addSegment: march.addSegment,
  deleteSegment: march.deleteSegment,
  addChild: march.addChild,
  deleteChild: march.deleteChild,
  setCoordMode: march.setCoordMode,
  setRefPointOnMap: march.setRefPointOnMap,
  openMarch: march.openMarch,
  sendMarchToExplorer: march.sendMarchToExplorer,
  closeMarch: march.closeMarch,
}

const MarchContainer = connect(
  mapStateToProps,
  catchErrors(mapDispatchToProps),
)(WrappedMarch)

export default MarchContainer
