import { connect } from 'react-redux'
import WrappedMarch from '../components/common/March'
import { march } from '../store/actions'
import { catchErrors } from '../store/actions/asyncAction'

const mapStateToProps = ({ march: {
  indicators,
  segments,
  integrity,
  dataMarch,
  pointType,
  totalMarchTime,
  totalMarchDistance } }) => ({
  indicators,
  segmentList: segments,
  integrity,
  dataMarch,
  pointType,
  totalMarchTime,
  totalMarchDistance,
})

const mapDispatchToProps = catchErrors({
  setMarchParams: march.setMarchParams,
  setIntegrity: march.setIntegrity,
  editFormField: march.editFormField,
  addSegment: march.addSegment,
  deleteSegment: march.deleteSegment,
  addChild: march.addChild,
  deleteChild: march.deleteChild,
  setCoordMode: march.setCoordMode,
  setRefPointOnMap: march.setRefPointOnMap,
})

const MarchContainer = connect(
  mapStateToProps,
  catchErrors(mapDispatchToProps),
)(WrappedMarch)

export default MarchContainer
