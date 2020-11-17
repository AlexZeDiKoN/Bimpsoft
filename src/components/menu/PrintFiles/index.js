import React, { PureComponent } from 'react'
import { Menu, Tooltip } from 'antd'
import { MovablePanel, IButton, IconNames, ButtonTypes, ColorTypes } from '@C4/CommonComponents'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import i18n from '../../../i18n'
import { Print } from '../../../constants'
import IconBox from './IconBox'
import './style.css'
import { MOUSE_ENTER_DELAY } from '../../../constants/tooltip'

const sidebarWidth = 285

const clientWidth = document?.documentElement?.clientWidth

const calc = clientWidth - 400 - 40

export default class PrintFiles extends PureComponent {
  static propTypes = {
    printFiles: PropTypes.object,
    printFileCancel: PropTypes.func,
    printFileRetry: PropTypes.func,
    printFileList: PropTypes.func,
    sidebarSelectedTabIndex: PropTypes.number,
  }

  state = {
    visible: false,
  }

  handleVisibleChange = () => {
    const { visible } = this.state
    this.setState((prev) => ({ visible: !prev.visible }))
    if (visible) {
      return this.props.printFileList()
    }
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
              <Tooltip title={name} mouseEnterDelay={MOUSE_ENTER_DELAY} className='fileBox_mapName'>
                {name}
              </Tooltip>
              <Tooltip title={Print.PRINT_STEPS_KEYS[message]} mouseEnterDelay={MOUSE_ENTER_DELAY} className='fileBox_status'>
                {Print.PRINT_STEPS_KEYS[message]}
              </Tooltip>
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
    const { visible } = this.state
    const { sidebarSelectedTabIndex } = this.props
    return (
      <>
        <Tooltip
          title={i18n.FILES_TO_PRINT}
          mouseEnterDelay={MOUSE_ENTER_DELAY}>
          <IButton
            type={ButtonTypes.WITH_BG}
            colorType={ColorTypes.MAP_HEADER_GREEN}
            icon={IconNames.PRINT_QUEUE}
            onClick={this.handleVisibleChange}
            active={visible}
          />
        </Tooltip>
        {visible && ReactDOM.createPortal(
          <MovablePanel
            minWidth={400}
            maxWidth={400}
            title={i18n.FILES_TO_PRINT}
            onClose={() => this.setState({ visible: false })}
            defaultPosition={ sidebarSelectedTabIndex >= 0 ? { x: calc - sidebarWidth, y: 40 } : { x: calc, y: 40 } }
            maxHeight={'calc(80vh + 35px)'}>
            {this.renderFileBox()}
          </MovablePanel>,
          document.getElementById('main'),
        )}
      </>
    )
  }
}
