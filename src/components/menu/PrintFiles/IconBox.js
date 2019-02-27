import React, { Fragment, Component } from 'react'
import { Icon } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import PropTypes from 'prop-types'
import i18n from '../../../i18n'
import IconButton from '../IconButton'

const iconNames = components.icons.names

export default class IconBox extends Component {
  static propTypes = {
    fileId: PropTypes.string,
    onClose: PropTypes.func,
    onRetry: PropTypes.func,
    message: PropTypes.string,
  }

  handleClose = () => {
    const { fileId, onClose } = this.props
    onClose(fileId)
  }

  handleRetry = () => {
    const { fileId, onRetry } = this.props
    onRetry(fileId)
  }

  render () {
    const { message } = this.props
    return (
      <Fragment>
        {message !== 'error'
          ? message !== 'done'
            ? <Icon className='loader-icon' type="compass" spin/>
            : <IconButton
              title={i18n.OPEN_FILE}
              icon={iconNames.MAP_DEFAULT}
              hoverIcon={iconNames.MAP_HOVER}
            />
          : <IconButton
            title={i18n.RETRY_FILE}
            icon={iconNames.REFRESH_DEFAULT}
            hoverIcon={iconNames.REFRESH_HOVER}
            onClick={this.handleRetry}
          />}
        <IconButton
          title={message === 'done' ? i18n.CLEAN_FILE : i18n.CANCEL_FILE}
          icon={iconNames.CLOSE}
          hoverIcon={iconNames.CLOSE}
          onClick={this.handleClose}
        />
      </Fragment>
    )
  }
}
