import React from 'react'
import { Icon } from 'antd'
import { TreeComponent, HighlightedText } from '../../../../common'
import MilSymbol from '../../MilSymbol'
import './style.css'

export default class Item extends TreeComponent.Item {
  onChange = () => {
    this.props.commonData.onChange(this.props.data.codePart)
  }

  onPreviewStart = () => {
    this.props.commonData.onPreviewStart(this.props.data.codePart)
  }

  onPreviewEnd = () => {
    this.props.commonData.onPreviewEnd()
  }

  onExpand = (e) => {
    e.stopPropagation()
    this.props.onExpand()
  }

  render () {
    const { props } = this
    const iconName = props.expanded ? 'up-square' : 'down-square'
    const { codePart } = props.data
    const itemCode = props.commonData.codeByPart[codePart]
    const isSelected = (codePart === props.commonData.codePart)
    const className = 'symbol-option-value ' + (isSelected ? 'symbol-option-value-selected' : '')
    return (
      <div
        ref={isSelected ? props.commonData.scrollRef : null}
        key={codePart}
        className={className}
        onClick={this.onChange}
        onMouseEnter={this.onPreviewStart}
        onMouseLeave={this.onPreviewEnd}
      >
        <MilSymbol code={itemCode} size={24}/>
        <span className="symbol-option-value-text">
          <HighlightedText text={props.data.title} textFilter={props.commonData.textFilter}/>
        </span>
        {props.canExpand ? (
          <Icon className="symbol-option-value-expand" type={iconName} onClick={this.onExpand}/>
        ) : null}
      </div>
    )
  }
}
