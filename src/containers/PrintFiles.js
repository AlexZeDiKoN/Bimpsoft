import { connect } from 'react-redux'
import PrintFiles from '../components/menu/PrintFiles'
import { print } from '../store/actions'
import { catchErrors } from '../store/actions/asyncAction'

const mapStateToProps = (store) => {
  const {
    print: {
      printFiles,
    },
  } = store
  return {
    printFiles,
  }
}

const mapDispatchToProps = {
  printFileCancel: print.printFileCancel,
  printFileRetry: print.printFileRetry,
}

const PrintFilesContainer = connect(
  mapStateToProps,
  catchErrors(mapDispatchToProps)
)(PrintFiles)

export default PrintFilesContainer
