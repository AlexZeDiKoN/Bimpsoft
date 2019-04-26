import React from 'react'
import './style.css'
import { Tooltip } from 'antd'
import PropTypes from 'prop-types'
import { data, components } from '@DZVIN/CommonComponents'
import { MilSymbol } from '@DZVIN/MilSymbolEditor'

const { common: { TreeComponent, HighlightedText } } = components
const { Icon } = components.icons
const { TextFilter } = data

export default class Item extends React.Component {
  doubleClickHandler = () => {
    const { onDoubleClick, data } = this.props
    onDoubleClick && onDoubleClick(data.id)
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
    const iclasses = [ 'catalog-arrows-right' ]
    if (tree.expanded) {
      iclasses.push('catalog-arrows-bottom')
    }
    const icon = tree.canExpand && (
      <Icon
        icon={Icon.names.DROP_RIGHT_DEFAULT}
        className={iclasses.join(' ')}
        onClick={tree.onExpand}
      />
    )
    const isSelected = id === selectedId
    const classes = [ 'catalog-item' ]
    isSelected && classes.push('catalog-item-selected')
    tree.canExpand && classes.push('catalog-item-can-expand')
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
            className="catalog-item-content"
          >
            {app6Code !== null && <MilSymbol code={app6Code} />}
            <div className="catalog-item-text">
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
