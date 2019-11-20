import { connect } from 'react-redux'
import { march } from '../../../../../store/actions'
import { catchErrors } from '../../../../../store/actions/asyncAction'
import Point from './Point'

const mapStateToProps = ({ march: { params } }) =>
  ({ segmentsLength: params.segments.length })

const mapDispatchToProps = {
  deletePoint: march.deletePoint,
}

const PointContainer = connect(
  mapStateToProps,
  catchErrors(mapDispatchToProps),
)(Point)

export default PointContainer
