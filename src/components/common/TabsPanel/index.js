import React from 'react'
import PropTypes from 'prop-types'
import * as ReactDom from 'react-dom'
import { Tooltip } from 'antd'
import { IButton, IconNames } from '@DZVIN/CommonComponents'
import { ButtonTypes, ColorTypes } from '@DZVIN/CommonComponents/src/constants'
import './style.css'

export default class TabsPanel extends React.Component {
  state = {
    selectedIndex: 0,
    isMounted: false,
  }

  componentDidMount () {
    this.setState({ isMounted: true })
  }

  componentDidUpdate (prevProps) {
    const { state, props } = this
    const { selectedIndex } = state
    if (prevProps.tabs.length !== props.tabs.length && !props.tabs[selectedIndex]) {
      this.setState({ selectedIndex: props.tabs.length - 1 })
    } else if (props.tabs[selectedIndex].displayName !== prevProps.tabs[selectedIndex].displayName) {
      const newIndex = props.tabs.findIndex((it) => it.displayName === prevProps.tabs[selectedIndex].displayName)
      this.setState({ selectedIndex: newIndex })
    }
  }

  containersRef = React.createRef()

  selectHandler = (selectedIndex) => () => {
    const { setSidebar, sidebar } = this.props
    setSidebar(!sidebar || selectedIndex !== this.state.selectedIndex)
    this.setState({ selectedIndex })
  }

  render () {
    const { tabs, sidebar } = this.props
    const { selectedIndex } = this.state
    return (
      <div className="tabs-panel">
        <div className="tabs-panel-headers">{
          tabs.map((Panel, index) => this.state.isMounted && (
            <Panel
              key={index}
              wrapper={({ children, title, icon }) => {
                const selected = selectedIndex === index
                return [
                  <div
                    key={index}>
                    <Tooltip title={title} placement='left'>
                      <IButton
                        colorType={ColorTypes.WHITE}
                        type={ButtonTypes.WITH_BG}
                        active={sidebar && selected}
                        icon={icon || IconNames.ORG_STRUCTURE}
                        onClick={this.selectHandler(index)}
                      />
                    </Tooltip>
                  </div>,
                  ReactDom.createPortal(
                    <div
                      key={index}
                      className='tabs-panel-container'
                      style={{ display: selected ? '' : 'none' }}
                    >{children}</div>,
                    this.containersRef.current,
                  ),
                ]
              }}
            />
          ),
          )
        }</div>
        <div className="tabs-panel-content" ref={this.containersRef}/>
      </div>
    )
  }
}

TabsPanel.propTypes = {
  tabs: PropTypes.array,
  sidebar: PropTypes.bool,
  setSidebar: PropTypes.func,
}
