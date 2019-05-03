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

  count = ({ selectedLayer, onMapObjects }, id) =>
    onMapObjects.toArray().filter((item) => selectedLayer === item.layer && id === item.unit).length

  render () {
    const { tree, textFilter, data, scrollRef, selectedId, canEdit, extraData } = this.props
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
    const onMapCount = extraData ? this.count(extraData, data.id) : 0
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
              {onMapCount !== 0 && <div className="org-structure-item-count">
                {onMapCount}
              </div>}
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
