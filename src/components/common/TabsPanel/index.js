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
    const { selectedIndex } = this.state
    if (selectedIndex < 0) {
      return
    }
    const { tabs } = this.props
    const { tabs: prevTabs } = prevProps
    const prevDisplayName = prevTabs[selectedIndex]?.Component.displayName

    if (prevTabs.length !== tabs.length || tabs[selectedIndex]?.Component.displayName !== prevDisplayName) {
      // изменились пункты панели
      // ранее на панели был выбран пункт
      // попытаться найти предыдущий выбранный пункт
      const index = tabs.findIndex((it) => it.Component.displayName === prevDisplayName)
      if (index !== selectedIndex) {
        // пункт меню не найден или изменился индекс пункта
        this.selectHandler(index)
      }
    } else if (tabs[selectedIndex].enabled !== prevTabs[selectedIndex].enabled) {
      // изменилось разрешение на отображение данного пункта панели
      this.selectHandler(selectedIndex, true)
    }
  }

  selectHandler = (selectedIndex, toggleVisibility = false) => {
    if (selectedIndex === this.state.selectedIndex && !toggleVisibility) {
      selectedIndex = -1
    }
    const { tabs } = this.props
    this.props.onToggle((selectedIndex >= 0 && tabs[selectedIndex]?.enabled) ? selectedIndex : -1)
    this.setState({ selectedIndex })
  }

  render () {
    const { tabs } = this.props
    const { selectedIndex } = this.state

    return (
      <div className="tabs-panel">
        <div className="tabs-panel-headers">{
          this.state.isMounted && tabs.map(({ title, icon, enabled }, index) => (
            enabled
              ? <div
                key={index}>
                <Tooltip title={title} mouseEnterDelay={MOUSE_ENTER_DELAY} placement='left'>
                  <IButton
                    colorType={ColorTypes.WHITE}
                    type={ButtonTypes.WITH_BG}
                    active={index === selectedIndex}
                    icon={icon || IconNames.ORG_STRUCTURE}
                    onClick={() => this.selectHandler(index)}
                  />
                </Tooltip>
              </div>
              : <></>
          ))
        }</div>
        <div className="tabs-panel-content">{
          this.state.isMounted && tabs.map(({ Component, enabled }, index) => (
            <div
              key={index}
              className='tabs-panel-container'
              style={{ display: (index === selectedIndex && enabled) ? '' : 'none' }}
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
  onToggle: PropTypes.func,
}
