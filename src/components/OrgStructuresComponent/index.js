import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import './style.css'
import { Input, Tooltip } from 'antd'
import { data, components } from '@DZVIN/CommonComponents'
import memoizeOne from 'memoize-one'
import i18n from '../../i18n'
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

  mouseUpHandler = (e) => {
    e.preventDefault()
    this.inputRef.current.focus()
  }

  filterTextChangeHandler = ({ target: { value } }) => {
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
      wrapper: Wrapper = Fragment,
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
      return <Wrapper title={(<Tooltip title={i18n.NO_ORG_STRUCTURE}>{i18n.ORG_STRUCTURE_SHORT}</Tooltip>)}>
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
      </Wrapper>
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
      <Wrapper title={(<Tooltip title={formation.fullName}>{i18n.ORG_STRUCTURE_SHORT}</Tooltip>)}>
        <div className="org-structures">
          <div className='org-structures-searchBlock'>
            <Input.Search
              ref={this.inputRef}
              placeholder={i18n.FILTER}
              onChange={this.filterTextChangeHandler}
            />
            <OrgStructureMenu
              onMapObjects={onMapObjects}
              onLayersById={onLayersById}
              selectList={selectList}
            />
          </div>
          <div className="org-structures-scroll" ref={this.scrollPanelRef}>
            <div>
              <b>{formation.fullName}</b>
            </div>
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
  selectedLayer: PropTypes.string,
  onMapObjects: PropTypes.object,
  onLayersById: PropTypes.object,
  selectList: PropTypes.func,
}
