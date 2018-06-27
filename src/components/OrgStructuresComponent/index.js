import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import { Input } from 'antd'
import { TreeComponent, TextFilter } from '../common'
import i18n from '../../i18n'
import Item from './Item'

export default class OrgStructuresComponent extends React.Component {
  state = {
    filterText: '',
  }

  getFilteredIds = TextFilter.getFilteredIdsFunc('Name', 'ID', 'ParentID')

  render () {
    const { filterText } = this.state
    const { byIds, roots } = this.props
    const textFilter = TextFilter.create(filterText)
    const filteredIds = this.getFilteredIds(textFilter, byIds)

    return (
      <div className="org-structures">
        <Input.Search
          placeholder={ i18n.FILTER }
          onChange={(e) => this.setState({ filterText: e.target.value.trim() })}
        />
        <TreeComponent
          filteredIds={filteredIds}
          byIds={byIds}
          roots={roots}
          itemTemplate={Item}
          commonData={{ textFilter }}
        />
      </div>
    )
  }
}

OrgStructuresComponent.propTypes = {
  roots: PropTypes.array.isRequired,
  byIds: PropTypes.object.isRequired,
}
