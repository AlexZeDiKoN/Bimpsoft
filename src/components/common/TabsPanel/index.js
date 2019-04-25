import React from 'react'
import * as ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import './style.css'
import memoizeOne from 'memoize-one'

const TabPortalHOC = (containersRef, titlesRef, id, selectedId, onSelect) => {
  class TabsPortal extends React.Component {
    static propTypes = {
      children: PropTypes.any,
      title: PropTypes.any,
    }

    componentDidMount () {
      const selected = id === selectedId

      this.containerEl.className = 'tabs-panel-container'
      this.containerEl.style.display = selected ? '' : 'none'
      containersRef.current && containersRef.current.appendChild(this.containerEl)

      this.titleEl.className = 'tabs-panel-header ' + (selected ? 'tabs-panel-header-selected' : '')
      this.titleEl.addEventListener('click', this.titleClickHandler)
      titlesRef.current && titlesRef.current.appendChild(this.titleEl)
    }

    componentWillUnmount () {
      containersRef.current && containersRef.current.removeChild(this.containerEl)
      titlesRef.current && titlesRef.current.removeChild(this.titleEl)
      this.titleEl.removeEventListener('click', this.titleClickHandler)
    }

    titleClickHandler = () => onSelect(id)

    containerEl = document.createElement('div')

    titleEl = document.createElement('div')

    render () {
      const { children, title } = this.props
      return [
        ReactDom.createPortal(children, this.containerEl),
        ReactDom.createPortal(title, this.titleEl),
      ]
    }
  }
  return TabsPortal
}

export default class TabsPanel extends React.Component {
  state = {
    selectedId: 0,
  }

  containersRef = React.createRef()

  titlesRef = React.createRef()

  selectHandler = (selectedId) => this.setState({ selectedId })

  TabPortalHOC = memoizeOne(TabPortalHOC)

  render () {
    const { tabs } = this.props
    const { selectedId } = this.state

    return (
      <div className="tabs-panel">
        <div className="tabs-panel-headers" ref={this.titlesRef} />
        <div className="tabs-panel-content" ref={this.containersRef} />
        {tabs.map((Panel, index) => {
          const TabPortal = this.TabPortalHOC(
            this.containersRef,
            this.titlesRef,
            index,
            selectedId,
            this.selectHandler
          )
          return (
            <Panel
              key={index}
              wrapper={TabPortal}
            />
          )
        })}
      </div>
    )
  }
}

TabsPanel.propTypes = {
  tabs: PropTypes.array,
}
