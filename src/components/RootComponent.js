import { useEffect } from 'react'
import PropTypes from 'prop-types'

const RootComponent = (props) => {
  const {
    loadAllParams,
    printFileList,
    getIndicator,
  } = props
  useEffect(() => {
    loadAllParams()
    printFileList()
    getIndicator()
  }, [ loadAllParams, printFileList, getIndicator ])
  return props.children
}

RootComponent.propTypes = {
  loadAllParams: PropTypes.func.isRequired,
  printFileList: PropTypes.func.isRequired,
  getIndicator: PropTypes.func.isRequired,
}

export default RootComponent
