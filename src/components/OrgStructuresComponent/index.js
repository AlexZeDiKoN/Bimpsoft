import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import { Input } from 'antd'
import TreeComponent from '../common/TreeComponent'
import Item from './Item'

export default class OrgStructuresComponent extends React.Component {
  state = {
    filterText: '',
  }

  getFilteredIds () {
    let { filterText } = this.state
    const { byIds } = this.props

    if (!filterText.length) {
      return null
    }
    filterText = filterText.toLowerCase()
    const filteredIds = {}
    const items = Object.values(byIds)
    for (let itemData of items) {
      if (itemData.Name.toLowerCase().includes(filterText)) {
        do {
          filteredIds[itemData.ID] = true
          itemData = byIds[itemData.ParentID]
        } while (itemData && !filteredIds.hasOwnProperty(itemData.ID))
      }
    }
    return filteredIds
  }

  render () {
    const { filterText } = this.state
    const filteredIds = this.getFilteredIds()

    return (
      <div className="org-structures">
        <Input.Search
          placeholder="Фільтрувати"
          onChange={(e) => this.setState({ filterText: e.target.value.trim() })}
        />
        <TreeComponent
          highlightText={filterText}
          filteredIds={filteredIds}
          byIds={this.props.byIds}
          roots={this.props.roots}
          itemTemplate={Item}
        />
      </div>
    )
  }
}

OrgStructuresComponent.propTypes = {
  roots: PropTypes.array.isRequired,
  byIds: PropTypes.object.isRequired,
}
