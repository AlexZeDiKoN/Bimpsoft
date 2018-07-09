import React from 'react'
import { Icon } from 'antd'
import PropTypes from 'prop-types'
import { FilterTreeSelect, HighlightedText } from '../../../../common'
import MilSymbol from '../../MilSymbol'
import './style.css'

export default class Item extends React.Component {
  onChange = () => {
    this.props.filterTreeSelect.onChange(this.props.data.codePart)
  }

  onPreviewStart = () => {
    this.props.symbol.onPreviewStart(this.props.data.codePart)
  }

  onPreviewEnd = () => {
    this.props.symbol.onPreviewEnd()
  }

  onExpand = (e) => {
    e.stopPropagation()
    this.props.tree.onExpand()
  }

  render () {
    const { symbol, tree, filterTreeSelect, data } = this.props
    const iconName = tree.expanded ? 'up-square' : 'down-square'
    const { codePart, title } = data
    const itemCode = symbol.codeByPart[codePart]
    const isSelected = (codePart === filterTreeSelect.id)
    const className = 'symbol-option-value ' + (isSelected ? 'symbol-option-value-selected' : '')
    return (
      <div
        ref={isSelected ? filterTreeSelect.scrollRef : null}
        key={codePart}
        className={className}
        onClick={this.onChange}
        onMouseEnter={this.onPreviewStart}
        onMouseLeave={this.onPreviewEnd}
      >
        <MilSymbol code={itemCode} size={24}/>
        <span className="symbol-option-value-text">
          <HighlightedText text={title} textFilter={filterTreeSelect.textFilter}/>
        </span>
        {tree.canExpand ? (
          <Icon className="symbol-option-value-expand" type={iconName} onClick={this.onExpand}/>
        ) : null}
      </div>
    )
  }
}

Item.propTypes = {
  ...FilterTreeSelect.itemPropTypes,
  data: PropTypes.shape({
    codePart: PropTypes.string,
    title: PropTypes.string,
  }),
  symbol: PropTypes.shape({
    onPreviewStart: PropTypes.func,
    onPreviewEnd: PropTypes.func,
    codeByPart: PropTypes.object,
  }),
}
