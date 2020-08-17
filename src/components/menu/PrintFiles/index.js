import React, { PureComponent } from 'react'
import { Dropdown, Menu, Tooltip } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import PropTypes from 'prop-types'
import i18n from '../../../i18n'
import { Print } from '../../../constants'
import IconBox from './IconBox'
import './style.css'

const { names: iconNames, IconButton } = components.icons

export default class PrintFiles extends PureComponent {
  static propTypes = {
    printFiles: PropTypes.object,
    printFileCancel: PropTypes.func,
    printFileRetry: PropTypes.func,
  }

  state = {
    visible: false,
  }

  handleVisibleChange = (flag) => {
    this.setState({ visible: flag })
  }

  renderFileBox = () => {
    const { printFiles, printFileCancel, printFileRetry } = this.props
    const files = Object.keys(printFiles)
    return (
      <Menu className='fileBox'>
        {files.map((fileId) => {
          const { name, message, documentPath } = printFiles[fileId]
          return (
            <Menu.Item key={fileId} className='fileBox_unit'>
              <Tooltip title={name}>
                <div className='fileBox_mapName'>
                  {name}
                </div>
              </Tooltip>
              <div className='fileBox_status'>
                {Print.PRINT_STEPS_KEYS[message]}
              </div>
              <div className='fileBox_control'>
                <IconBox
                  message={message}
                  fileId={fileId}
                  documentPath={documentPath}
                  mapName={name}
                  onClose={printFileCancel}
                  onRetry={printFileRetry}
                />
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
        placement='bottomLeft'
        onVisibleChange={this.handleVisibleChange}
        visible={this.state.visible}
      >
        <IconButton
          title={i18n.FILES_TO_PRINT}
          icon={iconNames.MENU_PRINT_DEFAULT}
          checked={this.state.visible}
        />
      </Dropdown>
    )
  }
}
