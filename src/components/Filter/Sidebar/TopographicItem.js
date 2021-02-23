import React from 'react'
import PropTypes from 'prop-types'
import { data, components, IButton, IconNames, ButtonTypes, PreloaderCover } from '@C4/CommonComponents'
import { Tooltip } from 'antd'
import { latLng } from 'leaflet'
import i18n from '../../../i18n'
import { MOUSE_ENTER_DELAY } from '../../../constants/tooltip'
import { CountBox } from '../../common/Sidebar'
import { VisibilityButton } from '../../common'
import './style.css'
import { TopoObj } from '../../../constants'

const { common: { TreeComponent, HighlightedText } } = components
const { TextFilter } = data

const buttonWrap = (node) => <div className="button_layers">{node}</div>
export const getChildrenName = (data) =>
  data?.properties?.[TopoObj.NAME] ||
  data?.properties?.[TopoObj.UKR_NAME] ||
  data?.properties?.[TopoObj.PROPER_NAME] ||
  data?.properties?.[TopoObj.OBJECT_TYPE]

const centeringWebMapItem = (id) => {
  const layer = window.webMap.findLayerById(id)
  const bounds = layer?.getBounds && layer.getBounds()
  bounds && window.webMap.map.fitBounds(bounds, {
    padding: [ 80, 80 ],
    maxZoom: 12,
  })
}

const getItemLatLng = ({ geometry: { coordinates = [] } = {} }) =>
  latLng(...(Array.isArray(coordinates?.[0]) ? coordinates?.[0] : coordinates))

export const Item = (props) => props?.data?.parentId ? <ItemChildren {...props}/> : <ItemParent {...props}/>

const ItemParent = ({
  textFilter,
  onFilterClick,
  onVisibleClick,
  data,
  activeFilters = {},
  filterCount = {},
  loadingObjects = {},
  tree,
}) => {
  const { id, shown, name } = data
  const { canExpand, expanded, onExpand } = tree

  const onClickFilterHandler = () => onFilterClick(data.id)
  const onClickVisibleHandler = (visible) => onVisibleClick(visible, data.id)
  const onExpandHandler = () => canExpand && onExpand()

  const isLoading = Boolean(loadingObjects[id])
  const isFilterActive = Boolean(activeFilters[id]?.filters)

  return <div className="sidebar__filter--list-item">
    <PreloaderCover loading={isLoading} />
    <VisibilityButton
      title={shown ? i18n.HIDE_CATALOG : i18n.SHOW_CATALOG}
      visible={shown}
      onChange={onClickVisibleHandler}
    />
    <div className={expanded ? 'expand-icon-collapse' : 'expand-icon-expanded'}>
      <IButton
        title={expanded ? i18n.COLLAPSE : i18n.EXPAND}
        icon={IconNames.NEXT}
        onClick={onExpandHandler}
        disabled={!canExpand}
      />
    </div>
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
    <Tooltip
      title={(<HighlightedText text={name} textFilter={textFilter}/>)}
      placement="topLeft"
      className="sidebar__filter--list-item--tooltip"
      mouseEnterDelay={MOUSE_ENTER_DELAY}
    >
      <div className="sidebar__filter--list-item--text" onClick={onExpandHandler}>
        <HighlightedText text={name} textFilter={textFilter}/>
      </div>
      <CountBox
        isHidden={isLoading || (!shown && !isFilterActive)}
        count={filterCount?.[id]}
      />
    </Tooltip>
  </div>
}

const ItemChildren = ({
  textFilter,
  data,
  onPreview,
  onOpenModal,
}) => {
  const name = getChildrenName(data)

  const mouseEnterHandler = () => onPreview(data.id)

  const mouseLeaveHandler = () => onPreview(null, data.id)

  const onClickHandler = () => {
    centeringWebMapItem(data.id)
    onOpenModal({ feature: data, latlng: getItemLatLng(data) })
  }

  return <div
    className="sidebar__filter--list-item"
    style={{ paddingLeft: 30 }}
    onMouseEnter={mouseEnterHandler}
    onMouseLeave={mouseLeaveHandler}
    onClick={onClickHandler}
  >
    <Tooltip
      title={(<HighlightedText text={name} textFilter={textFilter}/>)}
      placement="topLeft"
      className="sidebar__filter--list-item--tooltip"
      mouseEnterDelay={MOUSE_ENTER_DELAY}
    >
      <div className="sidebar__filter--list-item--text">
        <HighlightedText text={name} textFilter={textFilter}/>
      </div>
    </Tooltip>
  </div>
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
  onPreview: PropTypes.func,
  onOpenModal: PropTypes.func,
}
ItemParent.propTypes = Item.propTypes
ItemChildren.propTypes = Item.propTypes
