import React from 'react'
import './style.css'
import {Icon, Tooltip} from 'antd'
import PropTypes from 'prop-types'
import { data, components } from '@DZVIN/CommonComponents'
import { MilSymbol } from '@DZVIN/MilSymbolEditor'
const { common: { TreeComponent, HighlightedText } } = components
const { TextFilter } = data

export default class Item extends React.Component {

  doubleClickHandler = () => {
    const { onClick, data } = this.props
    const { app6Code, id } = data
    onClick(app6Code, id)
  }

  render () {
    const { tree, textFilter, data } = this.props
    const { shortName, app6Code = null, fullName } = data
    const icon = tree.canExpand &&
      (<Icon type={tree.expanded ? 'minus' : 'plus'} onClick={tree.onExpand} />)

    return (
      <Tooltip
        title={(<HighlightedText text={fullName} textFilter={textFilter} />)}
        placement="topLeft"
      >
        <div className="org-structure-item">
          {icon}
          {(app6Code !== null) && (<MilSymbol code={app6Code} onDoubleClick={this.doubleClickHandler} />)}
          <HighlightedText text={shortName} textFilter={textFilter} onDoubleClick={this.doubleClickHandler} />
        </div>
      </Tooltip>
    )
  }
}

Item.propTypes = {
  ...TreeComponent.itemPropTypes,
  data: PropTypes.shape({
    shortName: PropTypes.string,
  }),
  textFilter: PropTypes.instanceOf(TextFilter),
  onClick: PropTypes.func,
}
