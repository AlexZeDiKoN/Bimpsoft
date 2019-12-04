import { connect } from 'react-redux'
import { march } from '../../../../../store/actions'
import { catchErrors } from '../../../../../store/actions/asyncAction'
import Line from './Line'

const mapStateToProps = (store) => {
  const {
    march: {
      indicators,
      existingSegmentsById,
      params: { marchType, segments },
    },
  } = store
  return {
    indicators,
    marchType,
    segments,
    existingSegmentsById,
  }
}

const mapDispatchToProps = {
  addPoint: march.addPoint,
  deleteSegment: march.deleteSegment,
  getExistingSegments: march.getExistingSegments,
}

const LineContainer = connect(
  mapStateToProps,
  catchErrors(mapDispatchToProps),
)(Line)

export default LineContainer
