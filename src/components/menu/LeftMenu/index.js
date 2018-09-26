import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import { notification } from 'antd/lib/index'
import IconButton from '../IconButton'
import './style.css'
import i18n from '../../../i18n'
import SelectionTypes from '../../../constants/SelectionTypes'
import LinesList from '../../LinesList'
import SubordinationLevel from '../../../constants/SubordinationLevel'
import ContextMenu from '../ContextMenu'
import ContextMenuItem from '../ContextMenu/ContextMenuItem'
import { getClickOutsideRef } from '../../../utils/clickOutside'

const iconNames = components.icons.names

export default class LeftMenu extends React.Component {
  static propTypes = {
    isEditMode: PropTypes.bool,
    canEditCurrentLayer: PropTypes.bool,
    isShowPoints: PropTypes.bool,
    isShowLines: PropTypes.bool,
    isShowSubordinationLevel: PropTypes.bool,
    isMeasureOn: PropTypes.bool,
    newShape: PropTypes.object,
    isShowSources: PropTypes.bool,
    mapSources: PropTypes.element,
    subordinationLevel: PropTypes.number,
    onClickEditMode: PropTypes.func,
    onClickPointSign: PropTypes.func,
    onClickLineSign: PropTypes.func,
    onClickMapSource: PropTypes.func,
    onClickSubordinationLevel: PropTypes.func,
    onNewShapeChange: PropTypes.func,
    onSubordinationLevelChange: PropTypes.func,
    onSubordinationLevelClose: PropTypes.func,
    onLinesListClose: PropTypes.func,
    onMeasureChange: PropTypes.func,
    onCopy: PropTypes.func,
    onCut: PropTypes.func,
    onPaste: PropTypes.func,
    onDelete: PropTypes.func,
    layerName: PropTypes.string,
  }

  selectLineHandler = (type) => {
    this.props.onNewShapeChange({ type })
    this.props.onLinesListClose()
  }

  clickTextHandler = () => {
    this.props.onNewShapeChange(this.props.newShape.type !== SelectionTypes.TEXT ? { type: SelectionTypes.TEXT } : {})
  }

  clickPointHandler = () => {
    this.props.onNewShapeChange(this.props.newShape.type !== SelectionTypes.POINT ? { type: SelectionTypes.POINT } : {})
  }

  clickOutsideSubordinationLevelRef = getClickOutsideRef(() => this.props.onSubordinationLevelClose())

  clickOutsideLinesListRef = getClickOutsideRef(() => this.props.onLinesListClose())

  clickEditModeHandler = () => {
    const {
      canEditCurrentLayer,
      onClickEditMode,
      layerName,
    } = this.props
    if (canEditCurrentLayer) {
      onClickEditMode()
    } else {
      notification.warn({ message: i18n.CANNOT_ENABLE_EDIT_MODE, description: i18n.READ_ONLY_LAYER_ACCESS(layerName) })
    }
  }

  render () {
    const {
      isEditMode,
      isShowLines,
      isShowSubordinationLevel,
      isMeasureOn,
      newShape = {},
      subordinationLevel = SubordinationLevel.TEAM_CREW,
      onClickLineSign,
      onClickMapSource,
      onClickSubordinationLevel,
      onSubordinationLevelChange,
      onMeasureChange,
      onCopy,
      onCut,
      onPaste,
      onDelete,
      mapSources,
      isShowSources,
      layerName,
    } = this.props

    const subordinationLevelViewData = SubordinationLevel.list.find((item) => item.value === subordinationLevel)

    return (
      <div className='left-menu'>
        <IconButton
          text={i18n.EDIT_MODE}
          icon={isEditMode ? iconNames.EDIT_ACTIVE : iconNames.EDIT_DEFAULT}
          hoverIcon={iconNames.EDIT_HOVER}
          onClick={this.clickEditModeHandler}
        />
        {isEditMode && (
          <Fragment>
            <IconButton
              text={i18n.POINT_SIGN}
              icon={
                newShape.type === SelectionTypes.POINT
                  ? iconNames.CONVENTIONAL_SIGN_ACTIVE
                  : iconNames.CONVENTIONAL_SIGN_DEFAULT
              }
              hoverIcon={iconNames.CONVENTIONAL_SIGN_HOVER}
              onClick={this.clickPointHandler}
            />
            <IconButton
              text={i18n.LINE_SIGN}
              icon={
                isShowLines
                  ? iconNames.GROUPING_GRAPHIC_PRIMITIVES_ACTIVE
                  : iconNames.GROUPING_GRAPHIC_PRIMITIVES_DEFAULT
              }
              hoverIcon={iconNames.GROUPING_GRAPHIC_PRIMITIVES_HOVER}
              onClick={onClickLineSign}
            >
              {isShowLines && (<LinesList
                onSelect={this.selectLineHandler}
                shapeType={ newShape.type }
                ref={this.clickOutsideLinesListRef}
              />)}
            </IconButton>
            <IconButton
              text={i18n.ADD_TEXT}
              icon={
                newShape.type === SelectionTypes.TEXT
                  ? iconNames.TEXT_SIGN_ACTIVE
                  : iconNames.TEXT_SIGN_DEFAULT
              }
              hoverIcon={iconNames.TEXT_SIGN_HOVER}
              onClick={this.clickTextHandler}
            />
          </Fragment>
        )}
        <IconButton
          text={i18n.MAP_SOURCE}
          icon={isShowSources ? iconNames.MAP_ACTIVE : iconNames.MAP_DEFAULT}
          hoverIcon={iconNames.MAP_HOVER}
          onClick={onClickMapSource}
        >
          {mapSources}
        </IconButton>
        <IconButton
          text={i18n.SITUATION_DETAILS({ level: subordinationLevelViewData.title })}
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
          text={i18n.MEASURE}
          icon={isMeasureOn ? iconNames.RULLER_HOVER : iconNames.RULLER_ACTIVE}
          hoverIcon={iconNames.RULLER_HOVER}
          checked={isMeasureOn}
          onClick={onMeasureChange}
        />
        {isEditMode && (
          <Fragment>
            <IconButton
              text={i18n.CUT}
              icon={iconNames.CUT_DEFAULT}
              hoverIcon={iconNames.CUT_HOVER}
              onClick={onCut}
            />
            <IconButton
              text={i18n.COPY}
              icon={iconNames.COPY_DEFAULT}
              hoverIcon={iconNames.COPY_HOVER}
              onClick={onCopy}
            />
            <IconButton
              text={i18n.PASTE}
              icon={iconNames.PASTE_DEFAULT}
              hoverIcon={iconNames.PASTE_HOVER}
              onClick={onPaste}
            />
            <IconButton
              text={i18n.DELETE}
              icon={iconNames.DELETE_DEFAULT}
              hoverIcon={iconNames.DELETE_HOVER}
              onClick={onDelete}
            />
          </Fragment>
        )}
        <div className="menu-layer-name">{layerName}</div>
      </div>
    )
  }
}
