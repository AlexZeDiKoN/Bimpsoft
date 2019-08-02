import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Input, Tooltip } from 'antd'
import memoizeOne from 'memoize-one'
import { components, data } from '@DZVIN/CommonComponents'
import i18n from '../../i18n'
import Item from '../ObjectCatalogItem'

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

  inputRef = React.createRef()

  mouseUpHandler = (e) => {
    e.preventDefault()
    this.inputRef.current.focus()
  }

  filterTextChangeHandler = ({ target: { value } }) => {
    this.props.onFilterTextChange(value.trim())
  }

  getCommonData = memoizeOne((textFilter, onClick, onVisibleChange, onDoubleClick, selectedId, canEdit, milSymbolRenderer) => (
    {
      textFilter,
      onClick,
      onVisibleChange,
      onDoubleClick,
      selectedId,
      canEdit,
      scrollRef: this.scrollRef,
      milSymbolRenderer,
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
      wrapper: Wrapper = Fragment,
      selectedId = null,
      expandedIds,
      onExpand,
      canEdit,
      milSymbolRenderer,
      onVisibleChange,
      title,
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
    )

    return (
      <Wrapper title={(<Tooltip title={title}>{title}</Tooltip>)}>
        <div style={{ width: `100%` }}>
          <Input.Search
            ref={this.inputRef}
            placeholder={i18n.FILTER}
            onChange={this.filterTextChangeHandler}
            style={{ padding: '5px' }}
          />
          <div className="catalog-scroll" ref={this.scrollPanelRef}>
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

CatalogsComponent.propTypes = {
  wrapper: PropTypes.any,
  title: PropTypes.string.isRequired,
  canEdit: PropTypes.bool,
  roots: PropTypes.array.isRequired,
  byIds: PropTypes.object.isRequired,
  textFilter: PropTypes.instanceOf(TextFilter),
  expandedIds: PropTypes.object,
  onExpand: PropTypes.func,
  onFilterTextChange: PropTypes.func,
  selectedId: PropTypes.number,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  milSymbolRenderer: PropTypes.func.isRequired,
  onVisibleChange: PropTypes.func,
}
