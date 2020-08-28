import { connect } from 'react-redux'
import PrintFiles from '../components/menu/PrintFiles'
import { print } from '../store/actions'
import { catchErrors } from '../store/actions/asyncAction'

const mapStateToProps = (store) => {
  const {
    print: {
      printFiles,
    },
    viewModes: { sidebarSelectedTabIndex },
  } = store
  return {
    printFiles,
    sidebarSelectedTabIndex,
  }
}

const mapDispatchToProps = {
  printFileCancel: print.printFileCancel,
  printFileRetry: print.printFileRetry,
  printFileList: print.printFileList,
}

const PrintFilesContainer = connect(
  mapStateToProps,
  catchErrors(mapDispatchToProps),
)(PrintFiles)

export default PrintFilesContainer
