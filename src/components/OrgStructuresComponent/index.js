import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import './style.css'
import { Input, Tooltip } from 'antd'
import { data, components } from '@DZVIN/CommonComponents'
import i18n from '../../i18n'
import Item from './Item'

const { TextFilter } = data
const { common: { TreeComponent } } = components

const getFilteredIds = TextFilter.getFilteredIdsFunc(
  (item) => item.shortName + ' ' + item.fullName,
  (item) => item.id,
  (item) => item.parentUnitID
)

export default class OrgStructuresComponent extends React.Component {
  state = {
    filterText: '',
  }

  inputRef = React.createRef()

  mouseDownHandler = (e) => {
    e.preventDefault()
    this.inputRef.current.focus()
  }

  filterTextChangeHandler = ({ target: { value } }) => {
    this.setState({ filterText: value.trim() })
  }

  render () {
    const { filterText } = this.state
    const { byIds, roots, formation = null, onClick, wrapper: Wrapper = Fragment } = this.props
    if (formation === null) {
      return null
    }

    const textFilter = TextFilter.create(filterText)
    const filteredIds = getFilteredIds(textFilter, byIds)
    const expandedKeys = textFilter ? Object.keys(filteredIds) : null

    return (
      <Wrapper title={(<Tooltip title={formation.fullName}>{formation.shortName}</Tooltip>)}>
        <div className="org-structures">
          <Input.Search
            ref={this.inputRef}
            placeholder={ i18n.FILTER }
            onChange={this.filterTextChangeHandler}
          />
          <TreeComponent
            expandedKeys={expandedKeys}
            filteredIds={filteredIds}
            byIds={byIds}
            roots={roots}
            itemTemplate={Item}
            commonData={{ textFilter, onClick }}
            onMouseDown={this.mouseDownHandler}
          />
        </div>
      </Wrapper>
    )
  }
}

OrgStructuresComponent.propTypes = {
  wrapper: PropTypes.any,
  roots: PropTypes.array.isRequired,
  byIds: PropTypes.object.isRequired,
  formation: PropTypes.object,
  onClick: PropTypes.func,
}
