import React from 'react'
import './style.css'
import { Icon } from 'antd'
import { TreeComponent, HighlightedText } from '../../common'

export default class Item extends TreeComponent.Item {
  render () {
    const { commonData, data } = this.props
    const { Name: name } = data
    const { textFilter } = commonData
    const icon = this.props.canExpand &&
      (<Icon type={this.props.expanded ? 'minus' : 'plus'} onClick={this.props.onExpand} />)

    return (
      <div className="org-structure-item">
        {icon}
        <HighlightedText text={name} textFilter={textFilter}/>
      </div>
    )
  }
}
