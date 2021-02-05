import React from 'react'
import PropTypes from 'prop-types'
import memoizeOne from 'memoize-one'
import { components, data } from '@C4/CommonComponents'
import Item from '../ObjectCatalogItem'
import { InputButton } from '../common'
import './style.css'
import { blockHotKey } from '../common/HotKeys'
import { shortcuts } from '../../constants'

const { TextFilter } = data
const { common: { TreeComponent: { TreeComponentUncontrolled } } } = components

const getFilteredIds = TextFilter.getFilteredIdsFunc(
  (item) => item.name,
  (item) => item.id,
  (item) => item.parent,
)

function scrollParentToChild (parent, child) {
  const parentRect = parent.getBoundingClientRect()
  const childRect = child.getBoundingClientRect()

  const isViewable = (childRect.top >= parentRect.top) && (childRect.top <= parentRect.top + parent.clientHeight)

  if (!isViewable) {
    parent.scrollTop = (childRect.top + parent.scrollTop) - parentRect.top
  }
}

export default class CatalogsComponent extends React.PureComponent {
  componentDidUpdate (prevProps, prevState, snapshot) {
    if (prevProps.selectedId !== this.props.selectedId) {
      const scrollRef = this.scrollRef && this.scrollRef.current
      scrollRef && scrollParentToChild(this.scrollPanelRef.current, scrollRef)
    }
  }

  scrollRef = React.createRef()

  scrollPanelRef = React.createRef()

  filterTextChangeHandler = (value) => {
    this.props.onFilterTextChange(value.trim())
  }

  getCommonData = memoizeOne((
    textFilter,
    onClick,
    onVisibleChange,
    onDoubleClick,
    selectedId,
    canEdit,
    milSymbolRenderer,
    onFilterClick,
    getFilterStatus,
    filterCount,
  ) => (
    {
      textFilter,
      onClick,
      onVisibleChange,
      onDoubleClick,
      selectedId,
      canEdit,
      scrollRef: this.scrollRef,
      milSymbolRenderer,
      onFilterClick,
      getFilterStatus,
      filterCount,
    }
  ))

  getFilteredIds = memoizeOne(getFilteredIds)

  render () {
    const {
      textFilter = null,
      byIds,
      roots,
      onDoubleClick,
      onClick,
      selectedId = null,
      expandedIds,
      onExpand,
      canEdit,
      milSymbolRenderer,
      onVisibleChange,
      onFilterClick,
      getFilterStatus,
      title,
      filterCount,
    } = this.props
    const filteredIds = this.getFilteredIds(textFilter, byIds)
    const expandedKeys = textFilter ? filteredIds : expandedIds
    const commonData = this.getCommonData(
      textFilter,
      onClick,
      onVisibleChange,
      onDoubleClick,
      selectedId,
      canEdit,
      milSymbolRenderer,
      onFilterClick,
      getFilterStatus,
      filterCount,
    )

    return (
      <div className='catalog-container'>
        <div
          className='catalog-container__header'
          onKeyDown={blockHotKey([ shortcuts.DELETE ])}
        >
          <InputButton
            title={title}
            initValue={textFilter ? textFilter.regExpTest.source : ''}
            onChange={this.filterTextChangeHandler}
          />
        </div>
        <div className="catalog-scroll" ref={this.scrollPanelRef}>
          <TreeComponentUncontrolled
            expandedKeys={expandedKeys}
            onExpand={onExpand}
            filteredIds={filteredIds}
            byIds={byIds}
            roots={roots}
            itemTemplate={Item}
            commonData={commonData}
          />
        </div>
      </div>
    )
  }
}

CatalogsComponent.propTypes = {
  canEdit: PropTypes.bool,
  roots: PropTypes.array.isRequired,
  byIds: PropTypes.object.isRequired,
  textFilter: PropTypes.instanceOf(TextFilter),
  expandedIds: PropTypes.object,
  onExpand: PropTypes.func,
  onFilterTextChange: PropTypes.func,
  selectedId: PropTypes.any,
  onClick: PropTypes.func,
  title: PropTypes.string,
  onDoubleClick: PropTypes.func,
  milSymbolRenderer: PropTypes.func.isRequired,
  onVisibleChange: PropTypes.func,
  onFilterClick: PropTypes.func,
  getFilterStatus: PropTypes.func,
  filterCount: PropTypes.object,
}
