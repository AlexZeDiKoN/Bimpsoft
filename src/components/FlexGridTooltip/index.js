import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { debounce } from 'lodash/function'
import i18n from '../../i18n'

import './flexGridTooltip.css'

const getTitle = (zone, dir, list) => `${Math.abs(zone)} ${zone > 0 ? i18n.FRIENDLY : i18n.HOSTILE} ${i18n.ZONE_OF_DIRECTION} "${list.get(dir - 1) || `№ ${dir}`}"`

class FlexGridToolTip extends Component {
  state = {
    zone: null,
    direction: null,
    x: null,
    y: null,
    visible: false,
  }

  componentDidMount () {
    const { startLooking } = this.props
    startLooking && startLooking(this.getCursorInfo)
    document.addEventListener('mousedown', this.hide)
    document.addEventListener('mouseout', this.stopGetCursorInfo)
  }

  componentWillUnmount () {
    const { stopLooking } = this.props
    this.stopLookAfterCursor()
    document.removeEventListener('mousedown', this.hide)
    document.removeEventListener('mouseout', this.stopGetCursorInfo)
    stopLooking && stopLooking(this.getCursorInfo)
  }

  hide = () => this.state.visible && this.setState({ visible: false })

  getCursorInfo = debounce((e) => {
    const { getCurrentCell } = this.props
    const { containerPoint } = e
    const current = getCurrentCell(e)
    current ? this.setState({ visible: true, ...current, ...containerPoint }) : this.hide()
  }, 1000)

  stopGetCursorInfo = () => {
    this.getCursorInfo.cancel()
    this.hide()
  }

  render () {
    const { className, names } = this.props
    const { y, x, visible, zone, direction } = this.state
    if (visible) {
      const content = getTitle(zone, direction, names)
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
