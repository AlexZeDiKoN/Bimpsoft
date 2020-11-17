import React from 'react'
import './style.css'
import { Tooltip } from 'antd'
import PropTypes from 'prop-types'
import { data, components } from '@C4/CommonComponents'
import { MilSymbol } from '@C4/MilSymbolEditor'
import { Symbol } from '@C4/milsymbol'
import { MOUSE_ENTER_DELAY } from '../../../../constants/tooltip'
const { common: { TreeComponent, HighlightedText } } = components
const { Icon } = components.icons
const { TextFilter } = data

export default class Item extends React.Component {
  componentDidMount () {
    this.generateDragImage(this.props?.data?.app6Code) // генерации иконки перетягиваемого объекта
  }

  componentDidUpdate (prevProps) {
    if (prevProps?.data?.app6Code !== this.props?.data?.app6Code) {
      this.generateDragImage(this.props?.data?.app6Code)
    }
  }

  doubleClickHandler = () => {
    const { onDoubleClick, data } = this.props
    onDoubleClick(data.id)
  }

  clickHandler = () => {
    const { onClick, data } = this.props
    onClick && onClick(data.id)
  }

  imgDrag = new Image()

  dragAnchor = { x: 0, y: 0 }

  // генерации иконки перетягиваемого объекта
  generateDragImage = (app6Code) => {
    const size = 25
    const symbol = new Symbol(app6Code, { size })
    if (symbol.isValid()) {
      this.dragXY = symbol.symbolAnchor
      this.dragAnchor = symbol.symbolAnchor
      this.imgDrag.src = symbol.toDataURL()
    } else {
      this.imgDrag.removeAttribute('src')
    }
  }

  dragStartHandler = (e) => {
    const { data } = this.props
    e.dataTransfer.setData && e.dataTransfer.setData('text', JSON.stringify({ type: 'unit', id: data.id }))
    if (e.dataTransfer) {
      if (this.imgDrag.src) { // Создания нового аватара переносимого объекта
        e.dataTransfer.setDragImage && e.dataTransfer.setDragImage(this.imgDrag, this.dragAnchor.x, this.dragAnchor.y)
      } else {
      // Для не имеющих иконки. Перенос только точки привязки переносимого объекта
        const xy = parseInt(getComputedStyle(e.target).height) / 2
        e.dataTransfer.setDragImage && e.dataTransfer.setDragImage(e.target, xy, xy)
      }
    }
  }

  count = (selectedLayer, onMapObjects, id) =>
    onMapObjects.toArray().filter((item) => selectedLayer === item.layer && id === item.unit).length

  render () {
    const { tree, textFilter, data, scrollRef, selectedId, canEdit, selectedLayer, onMapObjects } = this.props
    const { shortName, app6Code = null, fullName, id } = data
    const icon = tree.canExpand &&
      (<Icon icon={Icon.names.DROP_RIGHT_DEFAULT}
        className={
          tree.expanded
            ? 'org-structure-arrows-bottom org-structure-arrows-right'
            : 'org-structure-arrows-right'
        }
        onClick={tree.onExpand}
      />)
    const isSelected = id === selectedId
    const classes = [ 'org-structure-item' ]
    isSelected && classes.push('org-structure-item-selected')
    tree.canExpand && classes.push('org-structure-item-can-expand')
    data.itemType && classes.push('commandPost')
    const onMapCount = (selectedLayer && onMapObjects) ? this.count(selectedLayer, onMapObjects, data.id) : 0
    return (
      <Tooltip
        title={(<HighlightedText text={fullName} textFilter={textFilter} />)}
        placement="left"
        mouseEnterDelay={MOUSE_ENTER_DELAY}
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
            {app6Code ? <MilSymbol code={app6Code} /> : null}
            <div
              className="org-structure-item-text"
            >
              <HighlightedText text={shortName} textFilter={textFilter} />
            </div>
            {onMapCount !== 0 && (
              <div className="org-structure-item-count">
                {onMapCount}
              </div>
            )}
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
