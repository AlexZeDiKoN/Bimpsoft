import { connect } from 'react-redux'
import { catchErrors } from '../store/actions/asyncAction'
import { loadAllParams } from '../store/actions/params'
import { march, print } from '../store/actions'
import RootComponent from '../components/RootComponent'

const mapDispatchToProps = {
  loadAllParams,
  printFileList: print.printFileList,
  getIndicator: march.getIndicator,
}

export default connect(
  null,
  catchErrors(mapDispatchToProps),
)(RootComponent)
