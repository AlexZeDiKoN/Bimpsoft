import React, { Fragment, Component } from 'react'
import { Icon, Tooltip } from 'antd'
import { components, IButton, IconNames } from '@C4/CommonComponents'
import PropTypes from 'prop-types'
import i18n from '../../../i18n'
import { DOC_CLASS_ID } from '../../../constants/Print'
import { MOUSE_ENTER_DELAY } from '../../../constants/tooltip'

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
            : <Tooltip mouseEnterDelay={MOUSE_ENTER_DELAY} title={i18n.OPEN_FILE}>
              <IconButton
                icon={iconNames.MAP_DEFAULT}
                onClick={this.handleTransition}
              />
            </Tooltip>
          : <Tooltip mouseEnterDelay={MOUSE_ENTER_DELAY} title={i18n.OPEN_FILE}>
            <IconButton
              title={i18n.RETRY_FILE}
              icon={iconNames.REFRESH_DEFAULT}
              onClick={this.handleRetry}
            />
          </Tooltip>}
        <IButton
          title={message === 'done' ? i18n.CLEAN_FILE : i18n.DELETE_FILE}
          icon={IconNames.BAR_2_DELETE}
          onClick={this.handleClose}
        />
      </Fragment>
    )
  }
}
