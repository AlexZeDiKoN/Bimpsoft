import { connect } from 'react-redux'
import { march } from '../../../../../store/actions'
import { catchErrors } from '../../../../../store/actions/asyncAction'
import Point from './Point'

const mapStateToProps = ({ march: { landmarks, params } }) =>
  ({ segmentsLength: params.segments.length, landmarks })

const mapDispatchToProps = {
  deletePoint: march.deletePoint,
  getLandmarks: march.getLandmarks,
}

const PointContainer = connect(
  mapStateToProps,
  catchErrors(mapDispatchToProps),
)(Point)

export default PointContainer
