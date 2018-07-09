import React from 'react'
import { Icon } from 'antd'
import PropTypes from 'prop-types'
import { FilterTreeSelect, HighlightedText } from '../../../../common'
import MilSymbol from '../../MilSymbol'
import './style.css'

export default class Item extends React.Component {
  onChange = () => {
    this.props.filterTreeSelect.onChange(this.props.data.ID)
  }

  onExpand = (e) => {
    e.stopPropagation()
    this.props.tree.onExpand()
  }

  render () {
    const { tree, filterTreeSelect, data } = this.props
    const iconName = tree.expanded ? 'up-square' : 'down-square'
    const { ID: id, Name: title } = data
    const itemCode = '10011500521200000800'
    const isSelected = (id === filterTreeSelect.id)
    const className = 'orgstruct-value ' + (isSelected ? 'orgstruct-value-selected' : '')
    return (
      <div
        ref={isSelected ? filterTreeSelect.scrollRef : null}
        key={id}
        className={className}
        onClick={this.onChange}
        onMouseEnter={this.onPreviewStart}
        onMouseLeave={this.onPreviewEnd}
      >
        <MilSymbol code={itemCode} size={24}/>
        <span className="orgstruct-value-text">
          <HighlightedText text={title} textFilter={filterTreeSelect.textFilter}/>
        </span>
        {tree.canExpand ? (
          <Icon className="orgstruct-value-expand" type={iconName} onClick={this.onExpand}/>
        ) : null}
      </div>
    )
  }
}

Item.propTypes = {
  ...FilterTreeSelect.itemPropTypes,
  data: PropTypes.shape({
    ID: PropTypes.string,
    Name: PropTypes.string,
  }),
}
