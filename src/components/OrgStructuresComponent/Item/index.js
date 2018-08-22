import React from 'react'
import './style.css'
import { Icon, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import { data, components } from '@DZVIN/CommonComponents'
import { MilSymbol } from '@DZVIN/MilSymbolEditor'
const { common: { TreeComponent, HighlightedText } } = components
const { TextFilter } = data

export default class Item extends React.Component {

  doubleClickHandler = () => {
    const { onClick, data } = this.props
    onClick(data.id)
  }

  dragStartHandler = (e) => {
    const { data } = this.props
    e.dataTransfer.setData('text', JSON.stringify({ type: 'unit', id: data.id }))
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
          <div
            className="org-structure-item-content"
            onDoubleClick={this.doubleClickHandler}
            onDragStart={this.dragStartHandler}
            draggable={true}
          >
            {(app6Code !== null) && (<MilSymbol code={app6Code} />)}
            <HighlightedText text={shortName} textFilter={textFilter} />
          </div>
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
