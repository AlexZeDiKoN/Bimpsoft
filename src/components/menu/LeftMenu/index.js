import React from 'react'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import IconButton from '../IconButton'
import './style.css'
import i18n from '../../../i18n'
import SubordinationLevel from '../../../constants/SubordinationLevel'
import ContextMenu from '../ContextMenu'
import ContextMenuItem from '../ContextMenu/ContextMenuItem'
import { getClickOutsideRef } from '../../../utils/clickOutside'
import MenuDivider from '../MenuDivider'

const iconNames = components.icons.names

export default class LeftMenu extends React.Component {
  static propTypes = {
    isEditMode: PropTypes.bool,
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
  }

  clickOutsideSubordinationLevelRef = getClickOutsideRef(() => this.props.onSubordinationLevelClose())

  clickEditModeHandler = () => {
    const { isEditMode, onChangeEditMode } = this.props
    onChangeEditMode(!isEditMode)
  }

  render () {
    const {
      isEditMode,
      isShowSubordinationLevel,
      isMeasureOn,
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
          title={i18n.EDIT_MODE}
          icon={isEditMode ? iconNames.EDIT_ACTIVE : iconNames.EDIT_DEFAULT}
          hoverIcon={iconNames.EDIT_HOVER}
          onClick={this.clickEditModeHandler}
        />
        <CreateButtonsComponent />
        <MenuDivider />
        <MapSourceSelectComponent />
        <IconButton
          title={i18n.SITUATION_DETAILS({ level: subordinationLevelViewData.title })}
          icon={
            isShowSubordinationLevel
              ? subordinationLevelViewData.iconActive
              : subordinationLevelViewData.icon
          }
          hoverIcon={subordinationLevelViewData.iconActive}
          checked={isShowSubordinationLevel || !subordinationAuto}
          onClick={onClickSubordinationLevel}
        >
          {isShowSubordinationLevel && (
            <ContextMenu ref={this.clickOutsideSubordinationLevelRef}>
              <ContextMenuItem
                icon={iconNames.NONE_ICON_DEFAULT}
                text={i18n.AUTO}
                checked={subordinationAuto}
                hoverIcon={iconNames.NONE_ICON_ACTIVE}
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
          value={!isMeasureOn}
          title={i18n.MEASURE}
          icon={iconNames.MENU_RULER_DEFAULT}
          hoverIcon={iconNames.MENU_RULER_ACTIVE}
          checked={isMeasureOn}
          onClick={onMeasureChange}
        />
        <IconButton
          title={i18n.MARKER}
          icon={iconNames.MENU_MARKER_DEFAULT}
          hoverIcon={iconNames.MENU_MARKER_ACTIVE}
          checked={marker}
          onClick={onMarkerChange}
        />
        <IconButton
          title={i18n.TOPOGRAPHIC_OBJECTS}
          icon={iconNames.MENU_TOPOGRAPHY_1_DEFAULT}
          hoverIcon={iconNames.MENU_TOPOGRAPHY_1_ACTIVE}
          checked={topographicObjects}
          onClick={onTopographicObjectsChange}
        />
        <SelectionButtonsComponent />
        <FlexGridButtonsComponent />
        <div className="menu-layer-name">{layerName}</div>
      </div>
    )
  }
}
