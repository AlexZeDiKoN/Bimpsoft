import React, { PureComponent, Fragment } from 'react'
import { Dropdown, Icon, Menu } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import PropTypes from 'prop-types'
import IconButton from '../IconButton'
import i18n from '../../../i18n'
import { Print } from '../../../constants'
import './style.css'

const iconNames = components.icons.names

export default class PrintFiles extends PureComponent {
  static propTypes = {
    printFiles: PropTypes.object,
    printFileCancel: PropTypes.func,
  }

  state = {
    visible: false,
  }

  handleVisibleChange = (flag) => {
    this.setState({ visible: flag })
  }

  renderIconBox = (message, fileId) => {
    const { printFileCancel } = this.props
    return (
      <Fragment>
        {message !== 'error'
          ? message !== 'done'
            ? <Icon type="compass" spin />
            : <IconButton
              title={i18n.OPEN_FILE}
              icon={iconNames.MAP_DEFAULT}
              hoverIcon={iconNames.MAP_HOVER}
            />
          : <Icon type="reload"/>}
        <IconButton
          title={i18n.CANCEL_FILE}
          icon={iconNames.CLOSE}
          hoverIcon={iconNames.CLOSE}
          onClick={() => printFileCancel(fileId)}
        />
      </Fragment>
    )
  }

  renderFileBox = () => {
    const { printFiles } = this.props
    const files = Object.keys(printFiles)
    return (
      <Menu className='fileBox'>
        {files.map((fileId) => {
          const { name, message } = printFiles[fileId]
          return (
            <Menu.Item key={fileId} className='fileBox_unit'>
              <div className='fileBox_mapName'>
                {name}
              </div>
              <div className='fileBox_status'>
                {Print.PRINT_STEPS_KEYS[message]}
              </div>
              <div className='fileBox_control'>
                { this.renderIconBox(message, fileId) }
              </div>
            </Menu.Item>
          )
        })}
      </Menu>
    )
  }

  render () {
    return (
      <Dropdown
        overlay={this.renderFileBox()}
        trigger={[ 'click' ]}
        placement='bottomCenter'
        onVisibleChange={this.handleVisibleChange}
        visible={this.state.visible}
      >
        <IconButton
          title={i18n.FILES_TO_PRINT}
          icon={this.state.visible ? iconNames.SAVE_ACTIVE : iconNames.SAVE_DEFAULT}
          hoverIcon={iconNames.SAVE_HOVER}
        />
      </Dropdown>
    )
  }
}
