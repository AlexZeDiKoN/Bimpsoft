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
    const { onDoubleClick, data } = this.props
    onDoubleClick(data.id)
  }

  clickHandler = () => {
    const { onClick, data } = this.props
    onClick && onClick(data.id)
  }

  dragStartHandler = (e) => {
    const { data } = this.props
    e.dataTransfer.setData('text', JSON.stringify({ type: 'unit', id: data.id }))
  }

  render () {
    const { tree, textFilter, data, scrollRef, selectedId, canEdit } = this.props
    const { shortName, app6Code = null, fullName, id } = data
    const icon = tree.canExpand &&
      (<Icon type={tree.expanded ? 'caret-down' : 'caret-right'} onClick={tree.onExpand} />)
    const isSelected = id === selectedId
    const classes = [ 'org-structure-item' ]
    isSelected && classes.push('org-structure-item-selected')
    tree.canExpand && classes.push('org-structure-item-can-expand')
    return (
      <Tooltip
        title={(<HighlightedText text={fullName} textFilter={textFilter} />)}
        placement="topLeft"
        mouseEnterDelay={0.8}
      >
        <div ref={isSelected ? scrollRef : null} className={classes.join(' ')} >
          {icon}
          <div
            onDoubleClick={this.doubleClickHandler}
            onClick={this.clickHandler}
            onDragStart={canEdit ? this.dragStartHandler : null}
            draggable={canEdit}
            className="org-structure-item-content"
          >
            {(app6Code !== null) && (<MilSymbol code={app6Code} />)}
            <div
              className="org-structure-item-text"
            >
              <HighlightedText text={shortName} textFilter={textFilter} />
            </div>
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
  canEdit: PropTypes.bool,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  scrollRef: PropTypes.any,
}
