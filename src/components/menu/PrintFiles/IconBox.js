import React, { Fragment, Component } from 'react'
import { Icon } from 'antd'
import { components, IButton, IconNames } from '@DZVIN/CommonComponents'
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
    const url = this.props.documentPath
      ? `${window.location.origin}/explorer/#/_/${this.props.documentPath}`
      : `${window.location.origin}/explorer/#/_/documents/${DOC_CLASS_ID}`
    window.open(url)
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
        <IButton
          title={message === 'done' ? i18n.CLEAN_FILE : i18n.DELETE_FILE}
          icon={IconNames.BAR_2_DELETE}
          onClick={this.handleClose}
        />
      </Fragment>
    )
  }
}
