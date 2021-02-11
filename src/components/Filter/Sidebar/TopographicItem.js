import React from 'react'
import PropTypes from 'prop-types'
import { data, components, IButton, IconNames, ButtonTypes, PreloaderCover } from '@C4/CommonComponents'
import { Tooltip } from 'antd'
import i18n from '../../../i18n'
import { MOUSE_ENTER_DELAY } from '../../../constants/tooltip'
import { CountBox } from '../../common/Sidebar'
import { VisibilityButton } from '../../common'
import './style.css'

const { common: { TreeComponent, HighlightedText } } = components
const { TextFilter } = data

const buttonWrap = (node) => <div className="button_layers">{node}</div>

export const Item = ({
  textFilter,
  onFilterClick,
  onVisibleClick,
  data,
  activeFilters = {},
  filterCount = {},
  loadingObjects = {},
}) => {
  const { id, shown, name } = data

  const onClickFilterHandler = () => onFilterClick(data.id)
  const onClickVisibleHandler = (visible) => onVisibleClick(visible, data.id)

  const isLoading = Boolean(loadingObjects[id])
  const isFilterActive = activeFilters[id]
  return <Tooltip
    title={(
      <HighlightedText text={name} textFilter={textFilter}/>
    )}
    placement="left"
    mouseEnterDelay={MOUSE_ENTER_DELAY}
  >
    <div className="sidebar__filter--list-item">
      <PreloaderCover loading={isLoading} />
      <VisibilityButton
        title={shown ? i18n.HIDE_CATALOG : i18n.SHOW_CATALOG}
        visible={shown}
        disabled={!isFilterActive}
        onChange={onClickVisibleHandler}
      />
      {buttonWrap(
        <IButton
          title={i18n.FILTER_CATALOG}
          data-test="button-filter-topo-object"
          icon={IconNames.FILTER}
          type={ButtonTypes.WITH_BG}
          active={isFilterActive}
          onClick={onClickFilterHandler}
        />,
      )}
      <div className="sidebar__filter--list-item--text">
        <HighlightedText text={name} textFilter={textFilter}/>
      </div>
      <CountBox
        isHidden={isLoading || !isFilterActive}
        count={filterCount?.[id]}
      />
    </div>
  </Tooltip>
}

Item.propTypes = {
  ...TreeComponent.itemPropTypes,
  data: PropTypes.shape({
    id: PropTypes.any,
    name: PropTypes.string,
    shown: PropTypes.bool,
  }),
  textFilter: PropTypes.instanceOf(TextFilter),
  onFilterClick: PropTypes.func,
  onVisibleClick: PropTypes.func,
  activeFilters: PropTypes.object,
  filterCount: PropTypes.object,
}
