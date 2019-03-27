import { connect } from 'react-redux'
import { march } from '../../../../../store/actions'
import { catchErrors } from '../../../../../store/actions/asyncAction'
import Segment from './Segment'

const mapStateToProps = (store) => {
  const {
    march: {
      indicators,
      params: { segments },
    },
  } = store
  return {
    indicators,
    segments,
  }
}

const mapDispatchToProps = {
  setMarchParams: march.setMarchParams,
  addSegment: march.addSegment,
}

const SegmentContainer = connect(
  mapStateToProps,
  catchErrors(mapDispatchToProps),
)(Segment)

export default SegmentContainer
