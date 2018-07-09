import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import { Input } from 'antd'
import { TreeComponent, TextFilter } from '../common'
import i18n from '../../i18n'
import Item from './Item'

const getFilteredIds = TextFilter.getFilteredIdsFunc((item) => item.Name, (item) => item.ID, (item) => item.ParentID)

export default class OrgStructuresComponent extends React.Component {
  state = {
    filterText: '',
  }

  inputRef = React.createRef()

  mouseDownHandler = (e) => {
    e.preventDefault()
    this.inputRef.current.focus()
  }

  render () {
    const { filterText } = this.state
    const { byIds, roots } = this.props.orgStructures
    const textFilter = TextFilter.create(filterText)
    const filteredIds = getFilteredIds(textFilter, byIds)

    return (
      <div className="org-structures">
        <Input.Search
          ref={this.inputRef}
          placeholder={ i18n.FILTER }
          onChange={(e) => this.setState({ filterText: e.target.value.trim() })}
        />
        <TreeComponent
          filteredIds={filteredIds}
          byIds={byIds}
          roots={roots}
          itemTemplate={Item}
          commonData={{ textFilter }}
          onMouseDown={this.mouseDownHandler}
        />
      </div>
    )
  }
}

OrgStructuresComponent.propTypes = {
  orgStructures: PropTypes.shape({
    roots: PropTypes.array.isRequired,
    byIds: PropTypes.object.isRequired,
  }),
}
