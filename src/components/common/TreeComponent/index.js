import React from 'react'
import './style.css'
import PropTypes from 'prop-types'

export default class TreeComponent extends React.Component {
  static getDerivedStateFromProps (props) {
    if (props.expandedKeys) {
      const expandedKeys = {}
      for (const key of props.expandedKeys) {
        expandedKeys[key] = true
      }
      return { expandedKeys }
    }
    return null
  }

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
          const canExpand = Array.isArray(itemData.children) && Boolean(itemData.children.length)

          return (
            <div className="tree-component-li" key={id}>
              <Item
                data={itemData}
                commonData={this.props.commonData}
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
  filteredIds: PropTypes.object,
  roots: PropTypes.array,
  byIds: PropTypes.object,
  itemTemplate: PropTypes.any,
  commonData: PropTypes.object,
  expandedKeys: PropTypes.array,
}

class TreeComponentItem extends React.Component {
}
TreeComponentItem.PropTypes = {
  expanded: PropTypes.bool,
  canExpand: PropTypes.bool,
  onExpand: PropTypes.func,
  data: PropTypes.object,
  commonData: PropTypes.object,
}

TreeComponent.Item = TreeComponentItem
