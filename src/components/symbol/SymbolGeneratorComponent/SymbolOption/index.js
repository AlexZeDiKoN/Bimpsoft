import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import { FilterTreeSelect } from '../../../common'
import Item from './Item'

const idSelector = (item) => item.codePart
const titleSelector = (item) => item.title
const parentIdSelector = (item) => item.parentId

export default class SymbolOption extends React.PureComponent {
  render () {
    const { values = {}, codePart } = this.props
    const { byIds = {}, roots = [], codeByPart = {} } = values
    return (
      <FilterTreeSelect
        label={this.props.label}
        byIds={byIds}
        roots={roots}
        id={codePart}
        onChange={this.props.onChange}
        idSelector={idSelector}
        titleSelector={titleSelector}
        parentIdSelector={parentIdSelector}
        itemTemplate={Item}
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

SymbolOption.propTypes = {
  label: PropTypes.string,
  values: PropTypes.object,
  codePart: PropTypes.string,
  onChange: PropTypes.func,
  onPreviewStart: PropTypes.func,
  onPreviewEnd: PropTypes.func,
}
