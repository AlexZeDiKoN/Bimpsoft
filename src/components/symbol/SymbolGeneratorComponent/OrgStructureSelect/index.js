import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import { FilterTreeSelect } from '../../../common'
import Item from './Item'

const idSelector = (item) => item.ID
const titleSelector = (item) => item.Name
const parentIdSelector = (item) => item.ParentID

export default class OrgStructureSelect extends React.PureComponent {
  render () {
    const { values = {}, id } = this.props
    const { byIds = {}, roots = [], codeByPart = {} } = values
    return (
      <FilterTreeSelect
        className="filter-tree-select-default"
        label={this.props.label}
        byIds={byIds}
        roots={roots}
        id={id}
        onChange={this.props.onChange}
        idSelector={idSelector}
        titleSelector={titleSelector}
        parentIdSelector={parentIdSelector}
        itemTemplate={Item}
        expandedKeys={roots}
        commonData={{
          symbol: {
            codeByPart,
            onPreviewStart: this.props.onPreviewStart,
            onPreviewEnd: this.props.onPreviewEnd,
          },
        }}
      />
    )
  }
}

OrgStructureSelect.propTypes = {
  label: PropTypes.string,
  values: PropTypes.object,
  id: PropTypes.number,
  onChange: PropTypes.func,
  onPreviewStart: PropTypes.func,
  onPreviewEnd: PropTypes.func,
}
