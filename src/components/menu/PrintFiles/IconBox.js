import React, { Fragment, Component } from 'react'
import { Icon } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import PropTypes from 'prop-types'
import i18n from '../../../i18n'
import { DOC_CLASS_ID } from '../../../constants/Print'

const { names: iconNames, IconButton } = components.icons

export default class IconBox extends Component {
  static propTypes = {
    fileId: PropTypes.string,
    mapName: PropTypes.string,
    onClose: PropTypes.func,
    onRetry: PropTypes.func,
    message: PropTypes.string,
    documentPath: PropTypes.string,
  }

  handleClose = () => {
    const { fileId, onClose } = this.props
    onClose(fileId)
  }

  handleRetry = () => {
    const { fileId, mapName, onRetry } = this.props
    onRetry(fileId, mapName)
  }

  handleTransition = () => {
    window.open(this.props.documentPath)
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
              onClick={this.handleTransition}
            />
          : <IconButton
            title={i18n.RETRY_FILE}
            icon={iconNames.REFRESH_DEFAULT}
            onClick={this.handleRetry}
          />}
        <IconButton
          title={message === 'done' ? i18n.CLEAN_FILE : i18n.CANCEL_FILE}
          icon={iconNames.CLOSE}
          onClick={this.handleClose}
        />
      </Fragment>
    )
  }
}
