import React from 'react'
import PropTypes from 'prop-types'
import { ColorTypes, Scrollbar, data, components } from '@C4/CommonComponents'
import memo from 'memoize-one'
import { SidebarWrap } from '../../common/Sidebar'
import i18n from '../../../i18n'
import VisibilityButton from '../../common/VisibilityButton'
import { selectors } from '../../../utils'
import { getChildrenName, Item } from './TopographicItem'
import './style.css'

const { TextFilter } = data
const { common: { TreeComponent: { TreeComponentUncontrolled } } } = components

const getTextFilter = memo((search) => TextFilter.create(search))
const renderChildren = (items) => items.map(({ item }) => item)
const getValue = (item) => getChildrenName(item) || item.name
const getFilteredIds = TextFilter.getFilteredIdsFunc(getValue, selectors.getId, selectors.getParentId)

export const TopographicObjectsFilterComponent = ({
  roots,
  byIds,
  search,
  onSearch,
  onChangeVisible,
  filterCount,
  activeFilters,
  onFilterClick,
  preloadFields,
  loadingObjects,
  expandedKeys,
  onExpand,
  onPreview,
  onOpenModal,
}) => {
  React.useEffect(() => {
    async function load () { await preloadFields() }
    load()
  }, [ preloadFields ])

  const items = React.useMemo(() => Object.values(byIds), [ byIds ])
  const textFilter = getTextFilter(search)
  const isAllItemsHidden = items.every(({ shown }) => !shown)

  const onChangeAllVisible = () => onChangeVisible(false)

  const commonData = React.useMemo(() => ({
    activeFilters,
    filterCount,
    textFilter,
    onFilterClick,
    onVisibleClick: onChangeVisible,
    loadingObjects,
    onPreview,
    onOpenModal,
  }), [
    activeFilters,
    filterCount,
    textFilter,
    onFilterClick,
    onChangeVisible,
    loadingObjects,
    onPreview,
    onOpenModal,
  ])

  const filteredIds = React.useMemo(() => getFilteredIds(textFilter, byIds), [ byIds, textFilter ])

  return <SidebarWrap
    title={i18n.TOPOGRAPHIC_OBJECTS}
    onChangeSearch={onSearch}
    rightButtons={
      <VisibilityButton
        title={!isAllItemsHidden ? i18n.HIDE_ALL_CATALOG : i18n.SHOW_ALL_CATALOG}
        disabled={isAllItemsHidden}
        tooltipPlacement="bottomRight"
        onChange={onChangeAllVisible}
        colorType={ColorTypes.WHITE}
      />
    }
  >
    <Scrollbar>
      <TreeComponentUncontrolled
        commonData={commonData}
        expandedKeys={expandedKeys}
        onExpand={onExpand}
        byIds={byIds}
        roots={roots}
        itemTemplate={Item}
        filteredIds={filteredIds}
      >{renderChildren}</TreeComponentUncontrolled>
    </Scrollbar>
  </SidebarWrap>
}

TopographicObjectsFilterComponent.propTypes = {
  roots: PropTypes.array,
  byIds: PropTypes.object,
  expandedKeys: PropTypes.object,
  loadingObjects: PropTypes.object,
  search: PropTypes.string,
  onSearch: PropTypes.func,
  onChangeVisible: PropTypes.func,
  filterCount: PropTypes.object,
  activeFilters: PropTypes.object,
  onFilterClick: PropTypes.func,
  preloadFields: PropTypes.func,
  onExpand: PropTypes.func,
  onPreview: PropTypes.func,
  onOpenModal: PropTypes.func,
}
