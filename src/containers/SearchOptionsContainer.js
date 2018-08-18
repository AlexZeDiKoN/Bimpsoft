import { connect } from 'react-redux'
import * as viewModesKeys from '../constants/viewModesKeys'
import SearchOptionsComponent from '../components/SearchOptions'
import * as viewModesActions from '../store/actions/viewModes'

const mapStateToProps = (store) => ({
  options: store.viewModes[viewModesKeys.searchOptions],
})

const mapDispatchToProps = (dispatch) => ({
  onSelect: (index) => dispatch(viewModesActions.searchSelectOption(index)),
  onClose: () => dispatch(viewModesActions.searchSelectOption(-1)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchOptionsComponent)
