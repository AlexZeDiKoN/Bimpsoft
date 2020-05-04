import React from 'react'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import './style.css'
import i18n from '../../../i18n'
import SubordinationLevel from '../../../constants/SubordinationLevel'
import ContextMenu from '../ContextMenu'
import ContextMenuItem from '../ContextMenu/ContextMenuItem'
import { getClickOutsideRef } from '../../../utils/clickOutside'
import MenuDivider from '../MenuDivider'

const { names: iconNames, IconButton } = components.icons

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
    } = this.props

    const subordinationLevelViewData =
      SubordinationLevel.list.find((item) => item.value === subordinationLevel) || SubordinationLevel.list[0]

    return (
      <div className='left-menu' >
        <IconButton
          placement={'bottomLeft'}
          title={i18n.EDIT_MODE}
          icon={iconNames.EDIT_ACTIVE}
          checked={isEditMode}
          onClick={this.clickEditModeHandler}
          disabled={is3DMapMode}
        />
        <IconButton
          placement={'bottomLeft'}
          title={i18n.TARGETING}
          icon={iconNames.AIM}
          checked={targetingMode}
          onClick={this.clickTargetingModeHandler}
        />
        {isMapCOP && <>
          <IconButton
            placement={'bottomLeft'}
            title={i18n.CREATE_TASK}
            icon={iconNames.TASK_DEFAULT}
            checked={isTaskMode}
            onClick={this.clickTaskModeHandler}
          />
        </>}
        <CreateButtonsComponent />
        <MenuDivider />
        <IconButton
          placement={'bottomRight'}
          title={i18n.VOLUME_VIEW}
          icon={iconNames.MAP_3D}
          checked={is3DMapMode}
          onClick={this.clickMap3D}
        />
        <MapSourceSelectComponent />
        <IconButton
          placement={'bottomLeft'}
          title={i18n.SITUATION_DETAILS({ level: subordinationLevelViewData.title })}
          icon={subordinationLevelViewData.icon}
          checked={isShowSubordinationLevel || !subordinationAuto}
          onClick={onClickSubordinationLevel}
        >
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
        </IconButton>
        <MenuDivider />
        <IconButton
          placement={'topLeft'}
          title={i18n.MEASURE}
          icon={iconNames.MENU_RULER_DEFAULT}
          checked={isMeasureOn}
          onClick={onMeasureChange}
          disabled={is3DMapMode}
        />
        <IconButton
          placement={'bottomLeft'}
          title={i18n.MARKER}
          icon={iconNames.MENU_MARKER_DEFAULT}
          checked={marker}
          onClick={onMarkerChange}
          disabled={is3DMapMode}
        />
        <IconButton
          placement={'bottomLeft'}
          title={i18n.TOPOGRAPHIC_OBJECTS}
          icon={iconNames.MENU_TOPOGRAPHY_1_DEFAULT}
          checked={topographicObjects}
          onClick={onTopographicObjectsChange}
          disabled={is3DMapMode}
        />
        <SelectionButtonsComponent />
        <FlexGridButtonsComponent />
        <div className="menu-layer-name">{layerName}</div>
      </div>
    )
  }
}
