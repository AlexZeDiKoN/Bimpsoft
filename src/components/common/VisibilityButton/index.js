import React from 'react'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import './style.css'

const { icons: { IconHovered, names: iconNames } } = components

const getIcon = (isDark, visible) =>
  isDark
    ? (visible ? iconNames.DARK_EYE_ON_ACTIVE : iconNames.DARK_EYE_OFF_ACTIVE)
    : (visible ? iconNames.EYE_ON_ACTIVE : iconNames.EYE_OFF_ACTIVE)

const getHoverIcon = (isDark, visible) =>
  isDark
    ? (visible ? iconNames.DARK_EYE_ON_HOVER : iconNames.DARK_EYE_OFF_HOVER)
    : (visible ? iconNames.EYE_ON_HOVER : iconNames.EYE_OFF_HOVER)

export default class VisibilityButton extends React.Component {
  clickHandler = (e) => {
    const { onChange, visible } = this.props
    e.stopPropagation()
    onChange && onChange(!visible)
  }

  render () {
    const { visible, title, isDark } = this.props
    return (
      <IconHovered
        title={title}
        className="visibility-button"
        onClick={this.clickHandler}
        icon={getIcon(isDark, visible)}
        hoverIcon={getHoverIcon(isDark, visible)}
      />
    )
  }
}

VisibilityButton.propTypes = {
  title: PropTypes.string,
  visible: PropTypes.bool,
  isDark: PropTypes.bool,
  onChange: PropTypes.func,
}
