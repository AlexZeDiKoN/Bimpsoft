import { connect } from 'react-redux'
import WrappedMarch from '../components/common/March'
import { march } from '../store/actions'
import { catchErrors } from '../store/actions/asyncAction'

const mapStateToProps = ({ march: { indicators, segments, integrity, dataMarch } }) => ({
  indicators,
  segments: segments.toArray(),
  integrity,
  dataMarch,
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
}

const MarchContainer = connect(
  mapStateToProps,
  catchErrors(mapDispatchToProps),
)(WrappedMarch)

export default MarchContainer
