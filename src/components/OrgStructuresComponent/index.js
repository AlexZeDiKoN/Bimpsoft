import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import './style.css'
import { Input, Tooltip } from 'antd'
import { data, components } from '@DZVIN/CommonComponents'
import memoizeOne from 'memoize-one'
import i18n from '../../i18n'
import Item from './Item'

const { TextFilter } = data
// const { common: { TreeComponent: { TreeComponentUncontrolled } } } = components

class TreeComponentUncontrolled extends React.Component {
  static propTypes = {
    filteredIds: PropTypes.object,
    roots: PropTypes.array,
    byIds: PropTypes.object,
    itemTemplate: PropTypes.any,
    expandedKeys: PropTypes.object,
    onExpand: PropTypes.func,
    commonData: PropTypes.object,
  }

  renderItems (ids, level) {
    const {
      filteredIds = null,
      byIds,
      itemTemplate: Item,
      commonData,
      expandedKeys,
      onExpand,
    } = this.props
    return (ids === null || ids === undefined) ? null : (
      <div className={`tree-component-ul tree-component-level-${level}`}>
        {ids.map((id) => {
          if (filteredIds !== null && !filteredIds.hasOwnProperty(id)) {
            return null
          }
          const itemData = byIds[id]

          const expanded = expandedKeys.hasOwnProperty(id)
          const canExpand = Array.isArray(itemData.children) && Boolean(itemData.children.length)

          return (
            <div className="tree-component-li" key={id}>
              <Item
                data={itemData}
                tree={{
                  canExpand,
                  expanded,
                  onExpand: () => onExpand(id),
                }}
                { ...commonData }
              />
              {expanded && this.renderItems(itemData.children, level + 1)}
            </div>
          )
        })}
      </div>

    )
  }

  render () {
    const { roots, expandedKeys, filteredIds, byIds, itemTemplate, commonData, onExpand, ...otherProps } = this.props
    return (
      <div className="tree-component" {...otherProps} >
        {this.renderItems(roots, 0)}
      </div>
    )
  }
}

const getFilteredIds = TextFilter.getFilteredIdsFunc(
  (item) => item.shortName + ' ' + item.fullName,
  (item) => item.id,
  (item) => item.parentUnitID
)

function scrollParentToChild (parent, child) {
  const parentRect = parent.getBoundingClientRect()
  const childRect = child.getBoundingClientRect()

  const isViewable = (childRect.top >= parentRect.top) && (childRect.top <= parentRect.top + parent.clientHeight)

  if (!isViewable) {
    parent.scrollTop = (childRect.top + parent.scrollTop) - parentRect.top
  }
}

export default class OrgStructuresComponent extends React.PureComponent {
  componentDidUpdate (prevProps, prevState, snapshot) {
    if (prevProps.selectedId !== this.props.selectedId) {
      const scrollRef = this.scrollRef && this.scrollRef.current
      scrollRef && scrollParentToChild(this.scrollPanelRef.current, scrollRef)
    }
  }

  scrollRef = React.createRef()

  scrollPanelRef = React.createRef()

  inputRef = React.createRef()

  mouseUpHandler = (e) => {
    e.preventDefault()
    this.inputRef.current.focus()
  }

  filterTextChangeHandler = ({ target: { value } }) => {
    this.props.onFilterTextChange(value.trim())
  }

  getCommonData = memoizeOne((textFilter, onClick, onDoubleClick, selectedId, canEdit) => (
    { textFilter, onClick, onDoubleClick, selectedId, canEdit, scrollRef: this.scrollRef }
  ))

  getFilteredIds = memoizeOne(getFilteredIds)

  render () {
    const {
      textFilter = null,
      byIds,
      roots,
      formation = null,
      onDoubleClick,
      onClick,
      wrapper: Wrapper = Fragment,
      selectedId = null,
      expandedIds,
      onExpand,
      canEdit,
    } = this.props

    if (formation === null) {
      return null
    }

    const filteredIds = this.getFilteredIds(textFilter, byIds)
    const expandedKeys = textFilter ? filteredIds : expandedIds

    const commonData = this.getCommonData(textFilter, onClick, onDoubleClick, selectedId, canEdit)

    return (
      <Wrapper title={(<Tooltip title={formation.fullName}>{formation.shortName}</Tooltip>)}>
        <div className="org-structures">
          <Input.Search
            ref={this.inputRef}
            placeholder={ i18n.FILTER }
            onChange={this.filterTextChangeHandler}
          />
          <div className="org-structures-scroll" ref={this.scrollPanelRef} >
            <TreeComponentUncontrolled
              expandedKeys={expandedKeys}
              onExpand={onExpand}
              filteredIds={filteredIds}
              byIds={byIds}
              roots={roots}
              itemTemplate={Item}
              commonData={commonData}
              onMouseUp={this.mouseUpHandler}
            />
          </div>
        </div>
      </Wrapper>
    )
  }
}

OrgStructuresComponent.propTypes = {
  wrapper: PropTypes.any,
  canEdit: PropTypes.bool,
  roots: PropTypes.array.isRequired,
  byIds: PropTypes.object.isRequired,
  formation: PropTypes.object,
  textFilter: PropTypes.instanceOf(TextFilter),
  expandedIds: PropTypes.object,
  onExpand: PropTypes.func,
  onFilterTextChange: PropTypes.func,
  selectedId: PropTypes.number,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
}
