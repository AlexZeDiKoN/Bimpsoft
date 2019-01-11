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
    subordinationLevel: PropTypes.number,
    onChangeEditMode: PropTypes.func,
    onClickPointSign: PropTypes.func,

    onClickSubordinationLevel: PropTypes.func,
    onSubordinationLevelChange: PropTypes.func,
    onSubordinationLevelClose: PropTypes.func,
    onMeasureChange: PropTypes.func,
    onCopy: PropTypes.func,
    onCut: PropTypes.func,
    onPaste: PropTypes.func,
    onDelete: PropTypes.func,
    layerName: PropTypes.string,

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
      onClickSubordinationLevel,
      onSubordinationLevelChange,
      onMeasureChange,
      createButtonsComponent: CreateButtonsComponent,
      mapSourceSelectComponent: MapSourceSelectComponent,
      selectionButtonsComponent: SelectionButtonsComponent,
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
          checked={isShowSubordinationLevel}
          onClick={onClickSubordinationLevel}
        >
          {isShowSubordinationLevel && (
            <ContextMenu ref={this.clickOutsideSubordinationLevelRef}>
              {SubordinationLevel.list.map(({ title, value, icon, iconActive }) => (
                <ContextMenuItem
                  key={value}
                  value={value}
                  icon={icon}
                  text={title}
                  checked={value === subordinationLevel}
                  hoverIcon={iconActive}
                  onClick={onSubordinationLevelChange}
                />
              ))}
            </ContextMenu>
          )}
        </IconButton>
        <IconButton
          value={!isMeasureOn}
          title={i18n.MEASURE}
          icon={isMeasureOn ? iconNames.RULLER_HOVER : iconNames.RULLER_ACTIVE}
          hoverIcon={iconNames.RULLER_HOVER}
          checked={isMeasureOn}
          onClick={onMeasureChange}
        />
        <SelectionButtonsComponent />
        <div className="menu-layer-name">{layerName}</div>
      </div>
    )
  }
}
