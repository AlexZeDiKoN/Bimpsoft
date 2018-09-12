import React from 'react'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import './style.css'

const { icons: { IconHovered, names: iconNames } } = components

export default class VisibilityButton extends React.Component {
  clickHandler = (e) => {
    const { onChange, visible } = this.props
    e.stopPropagation()
    onChange && onChange(!visible)
  }

  render () {
    const { visible } = this.props

    return (
      <IconHovered
        className="visibility-button"
        onClick={this.clickHandler}
        icon={visible ? iconNames.EYE_ON_ACTIVE : iconNames.EYE_OFF_ACTIVE }
        hoverIcon={visible ? iconNames.EYE_ON_HOVER : iconNames.EYE_OFF_HOVER }
      />
    )
  }
}

VisibilityButton.propTypes = {
  visible: PropTypes.bool,
  onChange: PropTypes.func,
}
