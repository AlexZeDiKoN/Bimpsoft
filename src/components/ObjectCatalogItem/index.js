import React from 'react'
import './style.css'
import { Tooltip } from 'antd'
import PropTypes from 'prop-types'
import { data, components } from '@DZVIN/CommonComponents'
import { VisibilityButton } from '../common'
import i18n from '../../i18n'

// export const catalogLevel = () => SubordinationLevel.COMMAND

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

  clickItem = () => {
    const {
      data: { id, shown },
      onVisibleChange,
    } = this.props
    onVisibleChange(id, shown)
  }

  render () {
    const { tree, textFilter, data, scrollRef, selectedId, canEdit, milSymbolRenderer, onVisibleChange } = this.props
    const { name, id, shown } = data
    const iclasses = [ 'catalog-arrows-right' ]
    if (tree.expanded) {
      iclasses.push('catalog-arrows-bottom')
    }
    const indicator = onVisibleChange ? (
      <VisibilityButton
        title={shown ? i18n.HIDE_CATALOG : i18n.SHOW_CATALOG}
        visible={shown}
        className="layer-item-component-control"
        onChange={this.clickItem}
      />
    ) : null
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
    shown && classes.push('catalog-item-shown')
    tree.canExpand && classes.push('catalog-item-can-expand')
    return (
      <Tooltip
        title={(
          <HighlightedText text={name} textFilter={textFilter}/>
        )}
        placement="left"
        mouseEnterDelay={1.2}
      >
        <div ref={isSelected ? scrollRef : null} className={classes.join(' ')}>
          {indicator}
          {icon}
          <div
            onDoubleClick={this.doubleClickHandler}
            onClick={this.clickHandler}
            onDragStart={canEdit ? this.dragStartHandler : null}
            draggable={canEdit}
            className="catalog-item-content"
          >
            {milSymbolRenderer(data)}
            <div className="catalog-item-text">
              <HighlightedText text={name} textFilter={textFilter}/>
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
    id: PropTypes.any,
    name: PropTypes.string,
  }),
  textFilter: PropTypes.instanceOf(TextFilter),
  canEdit: PropTypes.bool,
  onClick: PropTypes.func,
  onVisibleChange: PropTypes.func,
  onDoubleClick: PropTypes.func,
  scrollRef: PropTypes.any,
}
