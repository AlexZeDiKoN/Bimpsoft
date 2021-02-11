import React from 'react'
import PropTypes from 'prop-types'
import { ColorTypes, Scrollbar, data, components } from '@C4/CommonComponents'
import memo from 'memoize-one'
import { SidebarWrap } from '../../common/Sidebar'
import i18n from '../../../i18n'
import VisibilityButton from '../../common/VisibilityButton'
import { Item } from './TopographicItem'
import './style.css'

const { TextFilter } = data
const { common: { TreeComponent: { TreeComponentUncontrolled } } } = components

const testName = (textFilter, name) => textFilter ? textFilter.test(name) : true
const getTextFilter = memo((search) => TextFilter.create(search))

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
  }), [ activeFilters, filterCount, onChangeVisible, onFilterClick, textFilter, loadingObjects ])

  const filteredIds = React.useMemo(() => {
    const filtered = items.map(({ id, name }) => [ id, testName(textFilter, name) ])
    return Object.fromEntries(filtered)
  }, [ items, textFilter ])

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
        byIds={byIds}
        roots={roots}
        itemTemplate={Item}
        filteredIds={filteredIds}
      />
    </Scrollbar>
  </SidebarWrap>
}

TopographicObjectsFilterComponent.propTypes = {
  roots: PropTypes.array,
  byIds: PropTypes.object,
  loadingObjects: PropTypes.object,
  search: PropTypes.string,
  onSearch: PropTypes.func,
  onChangeVisible: PropTypes.func,
  filterCount: PropTypes.object,
  activeFilters: PropTypes.object,
  onFilterClick: PropTypes.func,
  preloadFields: PropTypes.func,
}
