import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from 'antd'
import { IButton, IconNames } from '@C4/CommonComponents'
import { ButtonTypes, ColorTypes } from '@C4/CommonComponents/src/constants'
import './style.css'
import { MOUSE_ENTER_DELAY } from '../../../constants/tooltip'

export default class TabsPanel extends React.Component {
  state = {
    selectedIndex: -1,
    isMounted: null,
  }

  componentDidMount () {
    this.setState({ isMounted: true })
    this.props.onToggle(-1)
  }

  componentDidUpdate (prevProps) {
    const { tabs } = this.props
    const { selectedIndex } = this.state
    if (prevProps.tabs.length !== tabs.length && !tabs[selectedIndex]) {
      this.selectHandler(-1)
    } else if (selectedIndex >= 0 && tabs[selectedIndex].displayName !== prevProps.tabs[selectedIndex].displayName) {
      this.selectHandler(tabs.findIndex((it) => it.displayName === prevProps.tabs[selectedIndex].displayName))
    }
  }

  selectHandler = (selectedIndex) => () => {
    if (selectedIndex === this.state.selectedIndex) {
      selectedIndex = -1
    }
    this.props.onToggle(selectedIndex)
    this.setState({ selectedIndex })
  }

  render () {
    const { tabs } = this.props
    const { selectedIndex } = this.state

    return (
      <div className="tabs-panel">
        <div className="tabs-panel-headers">{
          this.state.isMounted && tabs.map(({ title, icon }, index) => (
            <div
              key={index}>
              <Tooltip title={title} mouseEnterDelay={MOUSE_ENTER_DELAY} placement='left'>
                <IButton
                  colorType={ColorTypes.WHITE}
                  type={ButtonTypes.WITH_BG}
                  active={index === selectedIndex}
                  icon={icon || IconNames.ORG_STRUCTURE}
                  onClick={this.selectHandler(index)}
                />
              </Tooltip>
            </div>
          ))
        }</div>
        <div className="tabs-panel-content">{
          this.state.isMounted && tabs.map(({ Component }, index) => (
            <div
              key={index}
              className='tabs-panel-container'
              style={{ display: index === selectedIndex ? '' : 'none' }}
            >
              <Component />
            </div>
          ))
        }</div>
      </div>
    )
  }
}

TabsPanel.propTypes = {
  tabs: PropTypes.array,
}
