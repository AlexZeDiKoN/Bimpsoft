import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import { Input } from 'antd'
import { data, components } from '@C4/CommonComponents'
import memoizeOne from 'memoize-one'
import i18n from '../../i18n'
import { InputButton } from '../common'
import Item from './children/Item'
import OrgStructureMenu from './children/OrgStructureMenu'

const { TextFilter } = data

const {
  common: { TreeComponent: { TreeComponentUncontrolled } },
} = components

const getFilteredIds = TextFilter.getFilteredIdsFunc(
  (item) => `${item.shortName} ${item.fullName}`,
  (item) => item.id,
  (item) => (
    item.itemType === 'CommandPost'
      ? item.militaryUnitID
      : item.parentUnitID
  ),
)

const notSameProps = (obj1, obj2, props) => {
  for (const prop of props) {
    if (obj1[prop] !== obj2[prop]) {
      return true
    }
  }
}

function scrollParentToChild (parent, child) {
  const parentRect = parent.getBoundingClientRect()
  const childRect = child.getBoundingClientRect()

  const isViewable = (childRect.top >= parentRect.top) && (childRect.top <= parentRect.top + parent.clientHeight)

  if (!isViewable) {
    parent.scrollTop = (childRect.top + parent.scrollTop) - parentRect.top
  }
}

export default class OrgStructuresComponent extends React.PureComponent {
  static displayName = 'OrgStructuresComponent'

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (notSameProps(prevProps, this.props,
      [ 'selectedId', 'textFilter', 'byIds', 'roots', 'formation', 'expandedIds' ])
    ) {
      const scrollRef = this.scrollRef && this.scrollRef.current
      scrollRef && scrollParentToChild(this.scrollPanelRef.current, scrollRef)
    }
  }

  scrollRef = React.createRef()

  scrollPanelRef = React.createRef()

  inputRef = React.createRef()

  filterTextChangeHandler = (value) => {
    this.props.onFilterTextChange(value.trim())
  }

  getCommonData = memoizeOne((
    textFilter,
    onClick,
    onDoubleClick,
    selectedId,
    canEdit,
    selectedLayer,
    onMapObjects,
    onLayersById,
  ) => ({
    textFilter,
    onClick,
    onDoubleClick,
    selectedId,
    canEdit,
    selectedLayer,
    onMapObjects,
    onLayersById,
    scrollRef: this.scrollRef,
  }))

  getFilteredIds = memoizeOne(getFilteredIds)

  render () {
    const {
      textFilter = null,
      byIds,
      roots,
      formation = null,
      onDoubleClick,
      onClick,
      selectedId = null,
      expandedIds,
      onExpand,
      canEdit,
      selectedLayer,
      onMapObjects,
      onLayersById,
      selectList,
    } = this.props

    if (formation === null) {
      return (
        <div className="org-structures">
          <div className='org-structures-searchBlock'>
            <Input.Search
              ref={this.inputRef}
              placeholder={i18n.FILTER}
              disabled
            />
          </div>
          <b>{i18n.NO_ORG_STRUCTURE}</b>
        </div>
      )
    }

    const filteredIds = this.getFilteredIds(textFilter, byIds)
    const expandedKeys = textFilter ? filteredIds : expandedIds

    const commonData = this.getCommonData(
      textFilter,
      onClick,
      onDoubleClick,
      selectedId,
      canEdit,
      selectedLayer,
      onMapObjects,
      onLayersById,
    )

    return (
      <div className="org-structures">
        <div className='org-structures-searchBlock'>
          <InputButton
            title={i18n.ORG_STRUCTURE_SHORT}
            onChange={this.filterTextChangeHandler}
          />
          <OrgStructureMenu
            onMapObjects={onMapObjects}
            onLayersById={onLayersById}
            selectList={selectList}
          />
        </div>
        <div className="org-structures-scroll" ref={this.scrollPanelRef}>
          <div className='org-structures-title'>{formation.fullName}</div>
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
  selectedLayer: PropTypes.string,
  onMapObjects: PropTypes.object,
  onLayersById: PropTypes.object,
  selectList: PropTypes.func,
}
