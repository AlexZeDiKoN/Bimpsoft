import React from 'react'
import PropTypes from 'prop-types'
import * as ReactDom from 'react-dom'
import './style.css'

export default class TabsPanel extends React.Component {
  state = {
    selectedIndex: 0,
    isMounted: false,
  }

  componentDidMount () {
    this.setState({ isMounted: true })
  }

  containersRef = React.createRef()

  selectHandler = (selectedIndex) => () => this.setState({ selectedIndex })

  render () {
    const { tabs } = this.props
    const { selectedIndex } = this.state
    return (
      <div className="tabs-panel">
        <div className="tabs-panel-headers">{
          tabs.map((Panel, index) => this.state.isMounted && (
            <Panel
              key={index}
              wrapper={({ children, title }) => {
                const selected = selectedIndex === index
                return [
                  <div
                    key={index}
                    className={'tabs-panel-header ' + (selected ? 'tabs-panel-header-selected' : '')}
                    onClick={this.selectHandler(index)}
                  >{title}</div>,
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
}
