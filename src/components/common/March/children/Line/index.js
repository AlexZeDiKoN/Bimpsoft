import { connect } from 'react-redux'
import { march } from '../../../../../store/actions'
import { catchErrors } from '../../../../../store/actions/asyncAction'
import Line from './Line'

const mapStateToProps = (store) => {
  const {
    march: {
      indicators,
      params: { marchType },
    },
  } = store
  return {
    indicators,
    marchType,
  }
}

const mapDispatchToProps = {
  addPoint: march.addPoint,
  deleteSegment: march.deleteSegment,
}

const LineContainer = connect(
  mapStateToProps,
  catchErrors(mapDispatchToProps),
)(Line)

export default LineContainer
