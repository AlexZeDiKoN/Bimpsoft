import React from 'react'
import { Icon } from 'antd'
import PropTypes from 'prop-types'
import './style.css'

export default class VisibilityButton extends React.Component {
  render () {
    const icon = this.props.visible ? 'eye' : 'eye-o'
    const onClick = this.props.onChange ? (e) => {
      e.stopPropagation()
      this.props.onChange(!this.props.visible)
    } : null
    return (
      <div className="visibility-button" onClick={onClick}>
        <Icon type={icon}/>
      </div>
    )
  }
}

VisibilityButton.propTypes = {
  visible: PropTypes.bool,
  onChange: PropTypes.func,
}
