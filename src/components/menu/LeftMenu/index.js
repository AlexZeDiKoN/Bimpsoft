import React from 'react'
import PropTypes from 'prop-types'
import {
  components,
  utils,
  ButtonTypes,
  ColorTypes,
  IButton,
  IconNames,
} from '@DZVIN/CommonComponents'
import './style.css'
import { Input, Tooltip } from 'antd'
import i18n from '../../../i18n'
import SubordinationLevel from '../../../constants/SubordinationLevel'
import ContextMenu from '../ContextMenu'
import ContextMenuItem from '../ContextMenu/ContextMenuItem'
import { getClickOutsideRef } from '../../../utils/clickOutside'
import MenuDivider from '../MenuDivider'
import SearchOptions from '../../../containers/SearchOptionsContainer'

const { names: iconNames } = components.icons

const { Coordinates: Coord } = utils

export default class LeftMenu extends React.Component {
  static propTypes = {
    isMapCOP: PropTypes.bool,
    isEditMode: PropTypes.bool,
    is3DMapMode: PropTypes.bool,
    targetingMode: PropTypes.bool,
    isTaskMode: PropTypes.bool,
    isShowSubordinationLevel: PropTypes.bool,
    isMeasureOn: PropTypes.bool,
    createButtonsComponent: PropTypes.any,
    mapSourceSelectComponent: PropTypes.any,
    selectionButtonsComponent: PropTypes.any,
    flexGridButtonsComponent: PropTypes.any,
    subordinationLevel: PropTypes.number,
    subordinationAuto: PropTypes.bool,
    layerName: PropTypes.string,
    marker: PropTypes.bool,
    topographicObjects: PropTypes.bool,

    onChangeEditMode: PropTypes.func,
    onClickPointSign: PropTypes.func,
    onClickSubordinationLevel: PropTypes.func,
    onSubordinationLevelChange: PropTypes.func,
    onSubordinationLevelClose: PropTypes.func,
    onSetSubordinationLevelAuto: PropTypes.func,
    onMeasureChange: PropTypes.func,
    onMarkerChange: PropTypes.func,
    onTopographicObjectsChange: PropTypes.func,
    onChangeTargetingMode: PropTypes.func,
    onChangeTaskMode: PropTypes.func,
    onClick3D: PropTypes.func,
    searchFailed: PropTypes.bool,
    onSearch: PropTypes.func,
    onCoordinates: PropTypes.func,
    onManyCoords: PropTypes.func,
    onClearSearchError: PropTypes.func,
    onCloseSearch: PropTypes.func,
  }

  clickOutsideSubordinationLevelRef = getClickOutsideRef(() => this.props.onSubordinationLevelClose())

  clickEditModeHandler = () => {
    const { isEditMode, onChangeEditMode } = this.props
    onChangeEditMode(!isEditMode)
  }

  clickTaskModeHandler = () => {
    const { isTaskMode, onChangeTaskMode } = this.props
    onChangeTaskMode(!isTaskMode)
  }

  clickTargetingModeHandler = () => {
    const { targetingMode, onChangeTargetingMode } = this.props
    onChangeTargetingMode && onChangeTargetingMode(!targetingMode)
  }

  clickMap3D = () => {
    const { onClick3D, is3DMapMode, isMeasureOn, onMeasureChange, marker, onMarkerChange, topographicObjects,
      onTopographicObjectsChange } = this.props
    if (!is3DMapMode) {
      isMeasureOn && onMeasureChange()
      marker && onMarkerChange()
      topographicObjects && onTopographicObjectsChange()
    }
    onClick3D()
  }

  search = (sample) => {
    const { onSearch, onCoordinates, onManyCoords } = this.props
    const query = sample.toUpperCase().trim()
    if (query.length) {
      const parsed = Coord.parse(query)
      if (parsed && (parsed.length > 1 || (parsed.lng !== undefined && parsed.lat !== undefined))) {
        if (parsed.length > 1) {
          onManyCoords(parsed.map(({ lng, lat, type }) => ({
            point: { lng, lat },
            text: `${query} (${Coord.names[type]})`,
          })))
        } else {
          onCoordinates(query, parsed)
        }
      } else {
        onSearch(query)
      }
    }
  }

  searchClearError = () => {
    const { searchFailed, onClearSearchError } = this.props
    if (searchFailed) {
      onClearSearchError()
    }
  }

  searchBlur = () => {
    const { onCloseSearch } = this.props
    onCloseSearch && setTimeout(() => onCloseSearch(), 333)
  }

  render () {
    const {
      isMapCOP,
      isEditMode,
      targetingMode,
      isTaskMode,
      isShowSubordinationLevel,
      isMeasureOn,
      is3DMapMode,
      subordinationLevel = SubordinationLevel.TEAM_CREW,
      subordinationAuto,
      marker,
      topographicObjects,
      onClickSubordinationLevel,
      onSubordinationLevelChange,
      onSetSubordinationLevelAuto,
      onMeasureChange,
      onMarkerChange,
      onTopographicObjectsChange,
      createButtonsComponent: CreateButtonsComponent,
      mapSourceSelectComponent: MapSourceSelectComponent,
      selectionButtonsComponent: SelectionButtonsComponent,
      flexGridButtonsComponent: FlexGridButtonsComponent,
      layerName,
      searchFailed,
    } = this.props

    const subordinationLevelViewData =
      SubordinationLevel.list.find((item) => item.value === subordinationLevel) || SubordinationLevel.list[0]

    return (
      <div className='left-menu' >
        <Tooltip title={i18n.EDIT_MODE} placement='bottomLeft'>
          <IButton
            icon={IconNames.MENU_EDIT}
            type={ButtonTypes.WITH_BG}
            colorType={ColorTypes.BLACK_DARK_GREEN}
            active={isEditMode}
            onClick={this.clickEditModeHandler}
            disabled={is3DMapMode}
          />
        </Tooltip>
        <Tooltip title={i18n.TARGETING} placement='bottomLeft'>
          <IButton
            type={ButtonTypes.WITH_BG}
            colorType={ColorTypes.BLACK_DARK_GREEN}
            icon={IconNames.AIM}
            active={targetingMode}
            onClick={this.clickTargetingModeHandler}
          />
        </Tooltip>
        {isMapCOP && <>
          <Tooltip title={i18n.CREATE_TASK} placement='bottomLeft'>
            <IButton
              icon={IconNames.TASK}
              type={ButtonTypes.WITH_BG}
              colorType={ColorTypes.BLACK_DARK_GREEN}
              active={isTaskMode}
              onClick={this.clickTaskModeHandler}
            />
          </Tooltip>
        </>}
        <CreateButtonsComponent />
        <MenuDivider />
        <Tooltip title={i18n.VOLUME_VIEW} placement='bottomRight'>
          <IButton
            icon={IconNames.MAP_3D}
            type={ButtonTypes.WITH_BG}
            colorType={ColorTypes.BLACK_DARK_GREEN}
            active={is3DMapMode}
            onClick={this.clickMap3D}
          />
        </Tooltip>
        <MapSourceSelectComponent />
        <div>
          <Tooltip title={i18n.SITUATION_DETAILS({ level: subordinationLevelViewData.title })} placement='bottomLeft'>
            <IButton
              icon={subordinationLevelViewData.icon2}
              type={ButtonTypes.WITH_BG}
              colorType={ColorTypes.BLACK_DARK_GREEN}
              active={isShowSubordinationLevel || !subordinationAuto}
              onClick={onClickSubordinationLevel}
            />
          </Tooltip>
          {isShowSubordinationLevel && (
            <ContextMenu ref={this.clickOutsideSubordinationLevelRef}>
              <ContextMenuItem
                icon={iconNames.UNIT_15_ACTIVE}
                text={i18n.AUTO}
                checked={subordinationAuto}
                hoverIcon={iconNames.UNIT_15_ACTIVE}
                onClick={onSetSubordinationLevelAuto}
              />
              {SubordinationLevel.list.map(({ title, value, icon, iconActive }) => (
                <ContextMenuItem
                  key={value}
                  value={value}
                  icon={icon}
                  text={title}
                  checked={!subordinationAuto && value === subordinationLevel}
                  hoverIcon={iconActive}
                  onClick={onSubordinationLevelChange}
                />
              ))}
            </ContextMenu>
          )}
        </div>
        <MenuDivider />
        <Tooltip title={i18n.MEASURE} placement='topLeft'>
          <IButton
            icon={IconNames.MENU_RULER}
            active={isMeasureOn}
            type={ButtonTypes.WITH_BG}
            colorType={ColorTypes.BLACK_DARK_GREEN}
            onClick={onMeasureChange}
            disabled={is3DMapMode}
          />
        </Tooltip>
        <Tooltip title={i18n.MARKER} placement='bottomLeft'>
          <IButton
            icon={IconNames.MENU_MARKER}
            active={marker}
            type={ButtonTypes.WITH_BG}
            colorType={ColorTypes.BLACK_DARK_GREEN}
            onClick={onMarkerChange}
            disabled={is3DMapMode}
          />
        </Tooltip>
        <Tooltip title={i18n.TOPOGRAPHIC_OBJECTS} placement='bottomLeft'>
          <IButton
            icon={IconNames.MENU_TOPOGRAPHY_1}
            type={ButtonTypes.WITH_BG}
            colorType={ColorTypes.BLACK_DARK_GREEN}
            active={topographicObjects}
            onClick={onTopographicObjectsChange}
            disabled={is3DMapMode}
          />
        </Tooltip>
        <SelectionButtonsComponent />
        <FlexGridButtonsComponent />
        <MenuDivider />
        <div className='search-options-container'>
          <Input.Search
            placeholder={i18n.SEARCH}
            onBlur={this.searchBlur}
            onSearch={this.search}
            onChange={this.searchClearError}
            className={searchFailed ? 'search-failed' : ''}
            disabled={is3DMapMode}
          />
          <div className={`search-options-sub-panel ${isEditMode ? 'search-options-sub-panel-right' : 'search-options-sub-panel-left'}`}>
            <SearchOptions />
          </div>
        </div>
        <MenuDivider />
        <Tooltip
          title={layerName}
          mouseEnterDelay={1.5}
          placement='bottom'
          className="menu-layer-name"
        >
          {layerName}
        </Tooltip>
      </div>
    )
  }
}
