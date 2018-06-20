import React from 'react'

import './style.css'
import PropTypes from 'prop-types'

export default class TreeComponent extends React.Component {
  state = {
    expandedKeys: {},
  }

  onExpand (key) {
    let { expandedKeys } = this.state
    expandedKeys = { ...expandedKeys }
    if (expandedKeys.hasOwnProperty(key)) {
      delete expandedKeys[key]
    } else {
      expandedKeys[key] = true
    }
    this.setState({ expandedKeys })
  }

  renderItems (ids, level) {
    const Item = this.props.itemTemplate
    return (
      <div className={`tree-component-ul tree-component-level-${level}`}>
        {ids.map((id) => {
          if (this.props.filteredIds !== null && !this.props.filteredIds.hasOwnProperty(id)) {
            return null
          }
          const itemData = this.props.byIds[id]
          const { expandedKeys } = this.state
          const expanded = expandedKeys.hasOwnProperty(id)
          const canExpand = Boolean(itemData.children.length)

          return (
            <div className="tree-component-li" key={id}>
              <Item
                highlightText={this.props.highlightText}
                data={itemData}
                canExpand={canExpand}
                expanded={expanded}
                onExpand={() => this.onExpand(id)}
              />
              {expanded && this.renderItems(itemData.children, level + 1)}
            </div>
          )
        })}
      </div>

    )
  }

  render () {
    return (
      <div className="tree-component" >
        {this.renderItems(this.props.roots, 0)}
      </div>
    )
  }
}

TreeComponent.propTypes = {
  highlightText: PropTypes.string,
  filteredIds: PropTypes.object,
  roots: PropTypes.array,
  byIds: PropTypes.object,
  itemTemplate: PropTypes.any,
}
