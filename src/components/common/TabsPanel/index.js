import React from 'react'
import PropTypes from 'prop-types'
import * as ReactDom from 'react-dom'
import './style.css'

export default class TabsPanel extends React.Component {
  state = {
    selectedIndex: 0,
  }

  selectHandler = (selectedIndex) => () => this.setState({ selectedIndex })

  containersRef = React.createRef()

  render () {
    const { tabs } = this.props
    const { selectedIndex } = this.state
    return (
      <div className="tabs-panel">
        <div className="tabs-panel-headers">{
          tabs.map((Panel, index) => {
            return <Panel
              key={index}
              wrapper={({ children, title }) => {
                if (this.containersRef.current) {
                  const selected = selectedIndex === index
                  return [
                    <div
                      key={index}
                      className={'tabs-panel-header ' + (selected ? 'tabs-panel-header-selected' : '')}
                      onClick={this.selectHandler(index)}
                    >{title}</div>,
                    ReactDom.createPortal(
                      children,
                      this.containersRef.current.children[index],
                    ),
                  ]
                }
                return null
              }}
            />
          })
        }</div>
        <div className="tabs-panel-content" ref={this.containersRef}>{
          tabs.map((_, index) => {
            const selected = selectedIndex === index
            return <div
              key={index}
              className='tabs-panel-container'
              style={{ display: selected ? '' : 'none' }}
            />
          })
        }</div>
      </div>
    )
  }
}

TabsPanel.propTypes = {
  tabs: PropTypes.array,
}
