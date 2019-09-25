import { useEffect } from 'react'
import PropTypes from 'prop-types'

const RootComponent = (props) => {
  useEffect(() => {
    props.loadAllParams()
    props.printFileList()
    props.getIndicator()
  }, [])
  return props.children
}

RootComponent.propTypes = {
  loadAllParams: PropTypes.func.isRequired,
  printFileList: PropTypes.func.isRequired,
  getIndicator: PropTypes.func.isRequired,
}

export default RootComponent
