import React from 'react'
import './style.css'
import { Tooltip } from 'antd'
import PropTypes from 'prop-types'
import { data, components } from '@DZVIN/CommonComponents'
import { MilSymbol } from '@DZVIN/MilSymbolEditor'
import { signCodes } from '../../../constants/catalogs'

const commonPointApp6Code = '10032500001301000000'

const { common: { TreeComponent, HighlightedText } } = components
const { Icon, IconButton } = components.icons
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
    const { data: { id }, onChange } = this.props
    onChange && onChange(id)
  }

  render () {
    const { tree, textFilter, data, scrollRef, selectedId, canEdit } = this.props
    const { name, id } = data
    let app6Code = commonPointApp6Code
    let amplifiers = {}
    const signCode = signCodes[id]
    if (signCode) {
      if (typeof signCode === 'object') {
        const { code, ...rest } = signCode
        app6Code = code || app6Code
        amplifiers = { ...amplifiers, ...rest }
      } else {
        app6Code = signCode || app6Code
      }
    }
    const iclasses = [ 'catalog-arrows-right' ]
    if (tree.expanded) {
      iclasses.push('catalog-arrows-bottom')
    }
    const indicator = (
      <IconButton
        icon={Icon.names.EYE_OFF_ACTIVE}
        onClick={this.clickItem}
      />
    )
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
        title={(
          <HighlightedText text={name} textFilter={textFilter} />
        )}
        placement="topLeft"
        mouseEnterDelay={0.8}
      >
        <div ref={isSelected ? scrollRef : null} className={classes.join(' ')} >
          {indicator}
          {icon}
          <div
            onDoubleClick={this.doubleClickHandler}
            onClick={this.clickHandler}
            onDragStart={canEdit ? this.dragStartHandler : null}
            draggable={canEdit}
            className="catalog-item-content"
          >
            {app6Code !== null && (
              <MilSymbol
                code={app6Code}
                amplifiers={amplifiers}
              />
            )}
            <div className="catalog-item-text">
              <HighlightedText text={name} textFilter={textFilter} />
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
  onChange: PropTypes.func,
  onDoubleClick: PropTypes.func,
  scrollRef: PropTypes.any,
}
