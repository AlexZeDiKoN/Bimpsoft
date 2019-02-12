import React, { PureComponent } from 'react'
import { components } from '@DZVIN/CommonComponents'
import PropTypes from 'prop-types'
import IconButton from '../IconButton'
import i18n from '../../../i18n'

const iconNames = components.icons.names

export default class PrintFiles extends PureComponent {
  static propTypes = {}

  constructor (props) {
    super(props)
    this.state = {
      active: false,
      visible: false,
    }
  }

  onHoverOn = () => {
    if (!this.state.active) {
      this.setState({ visible: true })
    }
  }

  onHoverOff = () => {
    if (!this.state.active) {
      this.setState({ visible: false })
    }
  }

  onClickHandler = () => {
    this.setState((prevState) => ({
      active: !prevState.active,
      visible: !prevState.active,
    }))
  }

  render () {
    return (
      <div onMouseEnter={this.onHoverOn} onMouseLeave={this.onHoverOff}>
        <IconButton
          title={i18n.FILES_TO_PRINT}
          icon={this.state.visible ? iconNames.SAVE_ACTIVE : iconNames.SAVE_DEFAULT}
          hoverIcon={iconNames.SAVE_HOVER}
          onClick={this.onClickHandler}
        />
        {this.state.visible && <div style={{ position: 'absolute', color: 'red' }}>
          qwerqwerqwer
        </div>}
      </div>
    )
  }
}
