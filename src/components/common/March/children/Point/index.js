import { connect } from 'react-redux'
import { march } from '../../../../../store/actions'
import { catchErrors } from '../../../../../store/actions/asyncAction'
import Point from './Point'

const mapDispatchToProps = {
  deletePoint: march.deletePoint,
}

const PointContainer = connect(
  null,
  catchErrors(mapDispatchToProps),
)(Point)

export default PointContainer
