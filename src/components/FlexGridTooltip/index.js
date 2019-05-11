import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { debounce } from 'lodash/function'
import { ETERNAL, ZONE } from '../../constants/FormTypes'
import i18n from '../../i18n'

import './flexGridTooltip.css'

const getZoneDescription = ({ zone, name }) => `${Math.abs(zone)} ${zone > 0 ? i18n.FRIENDLY : i18n.HOSTILE} ${i18n.ZONE_OF_DIRECTION} ${name}`
const getTT = (type, info) => {
  switch (type) {
    case ETERNAL:
      return info.description
    case ZONE:
      return getZoneDescription(info)
    default:
      return ''
  }
}
class FlexGridToolTip extends Component {
  constructor (props) {
    super(props)
    this.state = {
      type: null,
      x: null,
      y: null,
      visible: false,
    }
    this.additional = {}
  }

  componentDidMount () {
    const { startLooking } = this.props
    startLooking && startLooking(this.getCursorInfo)
    document.addEventListener('mousedown', this.hide)
    document.addEventListener('mouseout', this.stopGetCursorInfo)
  }

  componentWillUnmount () {
    const { stopLooking } = this.props
    this.stopGetCursorInfo()
    document.removeEventListener('mousedown', this.hide)
    document.removeEventListener('mouseout', this.stopGetCursorInfo)
    stopLooking && stopLooking(this.getCursorInfo)
  }

  hide = () => this.state.visible && this.setState({ visible: false })

  getCursorInfo = debounce((e) => {
    const { getCurrentCell } = this.props
    const current = getCurrentCell(e)
    if (current) {
      const { type, ...rest } = current
      const { containerPoint } = e
      this.additional = rest
      return this.setState({ visible: true, type, ...containerPoint })
    }
    return this.hide()
  }, 1000)

  stopGetCursorInfo = () => {
    this.getCursorInfo.cancel()
    this.hide()
  }

  render () {
    const { className } = this.props
    const { y, x, visible, type } = this.state
    const content = visible && getTT(type, this.additional)
    if (content) {
      const style = {
        position: 'fixed',
        left: `${x}px`,
        top: `${y}px`,
      }

      return (
        <div className={`flexgrid-tooltip ${className}`} style={style}>
          {content}
        </div>
      )
    }
    return null
  }
}

FlexGridToolTip.propTypes = {
  getCurrentCell: PropTypes.func.isRequired,
  startLooking: PropTypes.func.isRequired,
  stopLooking: PropTypes.func.isRequired,
  className: PropTypes.string,
  names: PropTypes.object,
}

export default FlexGridToolTip
