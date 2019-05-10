import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Input, Tooltip } from 'antd'
import memoizeOne from 'memoize-one'
import { components, data } from '@DZVIN/CommonComponents'
import i18n from '../../i18n'
import Item from './Item'

const { TextFilter } = data
const { common: { TreeComponent: { TreeComponentUncontrolled } } } = components

const getFilteredIds = TextFilter.getFilteredIdsFunc(
  (item) => item.name,
  (item) => item.id,
  (item) => item.parent
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
  componentDidMount () {
    const { preloadCatalogList } = this.props
    preloadCatalogList && preloadCatalogList()
  }

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

  getCommonData = memoizeOne((textFilter, onClick, onChange, onDoubleClick, selectedId, canEdit) => (
    { textFilter, onClick, onChange, onDoubleClick, selectedId, canEdit, scrollRef: this.scrollRef }
  ))

  getFilteredIds = memoizeOne(getFilteredIds)

  render () {
    const {
      textFilter = null,
      byIds,
      shownIds,
      roots,
      onDoubleClick,
      onClick,
      onShow,
      wrapper: Wrapper = Fragment,
      selectedId = null,
      expandedIds,
      onExpand,
      canEdit,
    } = this.props

    Object.entries(byIds).forEach(([ key, value ]) => (value.shown = shownIds.hasOwnProperty(key)))
    const filteredIds = this.getFilteredIds(textFilter, byIds)
    const expandedKeys = textFilter ? filteredIds : expandedIds

    const commonData = this.getCommonData(textFilter, onClick, onShow, onDoubleClick, selectedId, canEdit)

    return (
      <Wrapper title={(<Tooltip title={i18n.CATALOGS}>{i18n.CATALOGS}</Tooltip>)}>
        <div style={{ width: `100%` }}>
          <Input.Search
            ref={this.inputRef}
            placeholder={i18n.FILTER}
            onChange={this.filterTextChangeHandler}
            style={{ padding: '5px' }}
          />
          <div className="catalog-scroll" style={{ overflowY: 'scroll', height: '89%', paddingBottom: 10 }} ref={this.scrollPanelRef} >
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
  canEdit: PropTypes.bool,
  roots: PropTypes.array.isRequired,
  byIds: PropTypes.object.isRequired,
  shownIds: PropTypes.object.isRequired,
  textFilter: PropTypes.instanceOf(TextFilter),
  expandedIds: PropTypes.object,
  onExpand: PropTypes.func,
  onShow: PropTypes.func,
  onFilterTextChange: PropTypes.func,
  selectedId: PropTypes.number,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  preloadCatalogList: PropTypes.func,
}
