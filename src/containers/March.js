import { connect } from 'react-redux'
import WrappedMarch from '../components/common/March'

const mapStateToProps = (store) => {
  const {
    march: {
      indicators,
    },
  } = store
  return {
    indicators,
  }
}

const MarchContainer = connect(
  mapStateToProps,
)(WrappedMarch)

export default MarchContainer
