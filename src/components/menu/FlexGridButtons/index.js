import React from 'react'
import PropTypes from 'prop-types'
import { IButton, IconNames, ButtonTypes, ColorTypes } from '@C4/CommonComponents'
import { Tooltip } from 'antd'
import i18n from '../../../i18n'
import MenuDivider from '../MenuDivider'
import { shortcuts } from '../../../constants'
import { HotKey } from '../../common/HotKeys'
import { MAX_DIRECTIONS } from '../../../store/reducers/flexGrid'
import formFor from './DirectionForms'
import Combine from './DirectionForms/Combine'
import Divide from './DirectionForms/Divide'
import { MOUSE_ENTER_DELAY } from '../../../constants/tooltip'

const DivideDirectionForm = formFor(Divide)
const CombineDirectionsForm = formFor(Combine)

export default class FlexGridButtons extends React.Component {
  static propTypes = {
    isEditMode: PropTypes.bool,
    visible: PropTypes.bool,
    showFlexGridOptions: PropTypes.func,
    hideFlexGrid: PropTypes.func,
    calcFlexGridUnits: PropTypes.func,
    showDivideDirForm: PropTypes.func,
    onModalCancel: PropTypes.func,
    selectDirection: PropTypes.func,
    deselectDirection: PropTypes.func,
    isShownDivideForm: PropTypes.bool,
    flexGrid: PropTypes.object,
    updateFlexGridDirections: PropTypes.func,
    isShownCombineForm: PropTypes.bool,
    showCombineDirForm: PropTypes.func,
  }

  render () {
    const {
      isEditMode,
      visible,
      showFlexGridOptions,
      hideFlexGrid,
      calcFlexGridUnits,
      showDivideDirForm,
      isShownDivideForm,
      isShownCombineForm,
      showCombineDirForm,
      onModalCancel,
      selectDirection,
      deselectDirection,
      flexGrid,
      updateFlexGridDirections,
    } = this.props

    if (!isEditMode) {
      return null
    }

    const dropHandler = visible ? hideFlexGrid : showFlexGridOptions

    return (
      <>
        <MenuDivider />
        <HotKey selector={shortcuts.DROP_FLEX_GRID} onKey={dropHandler} />
        <Tooltip title={`${i18n.FLEX_GRID} (${i18n.FLEX_GRID_SHORTCUT})`} mouseEnterDelay={MOUSE_ENTER_DELAY} placement='bottomLeft'>
          <IButton
            type={ButtonTypes.WITH_BG}
            colorType={ColorTypes.MAP_HEADER_GREEN}
            icon={IconNames.MAP_HEADER_ICON_MENU_OPERATING_AREA}
            active={visible}
            onClick={dropHandler}
          />
        </Tooltip>
        <Tooltip title={i18n.SEND_TO_ICT} mouseEnterDelay={MOUSE_ENTER_DELAY} placement='bottomLeft'>
          <IButton
            type={ButtonTypes.WITH_BG}
            colorType={ColorTypes.MAP_HEADER_GREEN}
            icon={IconNames.MAP_HEADER_ICON_SEND_ICT}
            disabled={!visible}
            onClick={calcFlexGridUnits}
          />
        </Tooltip>
        <div className='btn-context-container'>
          <Tooltip title={i18n.DIVIDE_DIRECTION} mouseEnterDelay={MOUSE_ENTER_DELAY} placement='bottomLeft'>
            <IButton
              type={ButtonTypes.WITH_BG}
              colorType={ColorTypes.MAP_HEADER_GREEN}
              icon={IconNames.MAP_HEADER_ICON_MENU_DIVISION}
              disabled={!visible || flexGrid.directions >= MAX_DIRECTIONS}
              onClick={showDivideDirForm}
            />
          </Tooltip>
          {isShownDivideForm &&
          <DivideDirectionForm
            onCancel={onModalCancel}
            onOk={updateFlexGridDirections}
            select={selectDirection}
            deselect={deselectDirection}
            flexGrid={flexGrid}
          />}
        </div>
        <div className='btn-context-container'>
          <Tooltip title={i18n.COMBINE_DIRECTIONS} mouseEnterDelay={MOUSE_ENTER_DELAY} placement='bottomLeft'>
            <IButton
              type={ButtonTypes.WITH_BG}
              colorType={ColorTypes.MAP_HEADER_GREEN}
              icon={IconNames.MAP_HEADER_ICON_MENU_UNION}
              disabled={!visible || flexGrid.directions < 2}
              onClick={showCombineDirForm}
            />
          </Tooltip>
          {isShownCombineForm &&
          <CombineDirectionsForm
            onCancel={onModalCancel}
            onOk={updateFlexGridDirections}
            select={selectDirection}
            deselect={deselectDirection}
            flexGrid={flexGrid}
          />}
        </div>
      </>
    )
  }
}
