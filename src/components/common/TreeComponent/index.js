import React from 'react'
import './style.css'
import PropTypes from 'prop-types'

export default class TreeComponent extends React.Component {
  constructor (props) {
    super(props)
    const expandedKeys = {}
    if (props.expandedKeys) {
      for (const key of props.expandedKeys) {
        expandedKeys[key] = true
      }
    }
    this.state = { expandedKeys }
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
    const {
      filteredIds,
      byIds,
      itemTemplate: Item,
      commonData,
    } = this.props
    return (ids === null || ids === undefined) ? null : (
      <div className={`tree-component-ul tree-component-level-${level}`}>
        {ids.map((id) => {
          if (filteredIds !== null && !filteredIds.hasOwnProperty(id)) {
            return null
          }
          const itemData = byIds[id]
          const { expandedKeys } = this.state

          const expanded = expandedKeys.hasOwnProperty(id)
          const canExpand = Array.isArray(itemData.children) && Boolean(itemData.children.length)

          return (
            <div className="tree-component-li" key={id}>
              <Item
                data={itemData}
                tree={{
                  canExpand,
                  expanded,
                  onExpand: () => this.onExpand(id),
                }}
                { ...commonData }
              />
              {expanded && this.renderItems(itemData.children, level + 1)}
            </div>
          )
        })}
      </div>

    )
  }

  render () {
    const {
      roots,
      expandedKeys,
      filteredIds,
      byIds,
      itemTemplate,
      commonData,
      ...otherProps
    } = this.props
    return (
      <div className="tree-component" {...otherProps} >
        {this.renderItems(roots, 0)}
      </div>
    )
  }
}

TreeComponent.propTypes = {
  filteredIds: PropTypes.object,
  roots: PropTypes.array,
  byIds: PropTypes.object,
  itemTemplate: PropTypes.any,
  expandedKeys: PropTypes.array,
  commonData: PropTypes.object,
}

TreeComponent.itemPropTypes = {
  tree: PropTypes.shape({
    expanded: PropTypes.bool,
    canExpand: PropTypes.bool,
    onExpand: PropTypes.func,
  }),
}
