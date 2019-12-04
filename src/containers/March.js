import { connect } from 'react-redux'
import WrappedMarch from '../components/common/March'
import { march } from '../store/actions'
import { catchErrors } from '../store/actions/asyncAction'

const mapStateToProps = (store) => {
  const {
    march: {
      indicators,
      params,
      integrity,
    },
  } = store
  return {
    indicators,
    params,
    integrity,
  }
}

const mapDispatchToProps = {
  setMarchParams: march.setMarchParams,
  setIntegrity: march.setIntegrity,
}

const MarchContainer = connect(
  mapStateToProps,
  catchErrors(mapDispatchToProps),
)(WrappedMarch)

export default MarchContainer
