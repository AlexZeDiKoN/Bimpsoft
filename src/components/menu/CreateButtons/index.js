import React from 'react'
import PropTypes from 'prop-types'
import { ButtonTypes, ColorTypes, IButton, IconNames } from '@C4/CommonComponents'
import './style.css'
import { Tooltip } from 'antd'
import i18n from '../../../i18n'
import SelectionTypes from '../../../constants/SelectionTypes'
import LinesList from '../../LinesList'
import { getClickOutsideRef } from '../../../utils/clickOutside'
import MenuDivider from '../MenuDivider'
import { MOUSE_ENTER_DELAY } from '../../../constants/tooltip'

const lineTypes = [
  SelectionTypes.AREA, SelectionTypes.CURVE, SelectionTypes.POLYGON, SelectionTypes.POLYLINE, SelectionTypes.CIRCLE,
  SelectionTypes.RECTANGLE, SelectionTypes.SQUARE,
]

export default class CreateButtons extends React.PureComponent {
  static propTypes = {
    isEditMode: PropTypes.bool,
    isShowLines: PropTypes.bool,
    isCatalogLayer: PropTypes.bool,
    newShape: PropTypes.object,
    undoInfo: PropTypes.shape({
      canUndo: PropTypes.bool,
      canRedo: PropTypes.bool,
    }),

    onClickLineSign: PropTypes.func,
    onNewShapeChange: PropTypes.func,
    onLinesListClose: PropTypes.func,
    undo: PropTypes.func,
    redo: PropTypes.func,
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

  clickOutsideLinesListRef = getClickOutsideRef(() => this.props.onLinesListClose())

  render () {
    const {
      isEditMode,
      isShowLines,
      isCatalogLayer,
      newShape = {},
      onClickLineSign,
      undoInfo: { canUndo, canRedo },
      undo,
      redo,
    } = this.props

    if (!isEditMode) {
      return null
    }
    return (
      <>
        <MenuDivider />
        <Tooltip title={i18n.UNDO} mouseEnterDelay={MOUSE_ENTER_DELAY} placement='bottomLeft'>
          <IButton
            icon={IconNames.MAP_HEADER_ICON_UNDO}
            type={ButtonTypes.WITH_BG}
            colorType={ColorTypes.MAP_HEADER_GREEN}
            disabled={!isEditMode || !canUndo}
            onClick={undo}
          />
        </Tooltip>
        <Tooltip title={i18n.REDO} mouseEnterDelay={MOUSE_ENTER_DELAY} placement='bottomLeft'>
          <IButton
            type={ButtonTypes.WITH_BG}
            colorType={ColorTypes.MAP_HEADER_GREEN}
            icon={IconNames.MAP_HEADER_ICON_REDO}
            disabled={!isEditMode || !canRedo}
            onClick={redo}
          />
        </Tooltip>
        <MenuDivider />
        <Tooltip title={i18n.POINT_SIGN} mouseEnterDelay={MOUSE_ENTER_DELAY} placement='bottomLeft'>
          <IButton
            type={ButtonTypes.WITH_BG}
            colorType={ColorTypes.MAP_HEADER_GREEN}
            icon={IconNames.MAP_HEADER_ICON_MENU_CONVENTIONAL_SIGN}
            disabled={isCatalogLayer}
            active={newShape.type === SelectionTypes.POINT}
            onClick={this.clickPointHandler}
          />
        </Tooltip>
        <div className='btn-context-container'>
          <Tooltip title={i18n.LINE_SIGN} mouseEnterDelay={MOUSE_ENTER_DELAY} placement='bottomLeft'>
            <IButton
              icon={IconNames.MAP_HEADER_ICON_MENU_GROUPING_GRAPHIC_PRIMITIVES}
              type={ButtonTypes.WITH_BG}
              disabled={isCatalogLayer}
              colorType={ColorTypes.MAP_HEADER_GREEN}
              active={lineTypes.indexOf(newShape.type) >= 0 || isShowLines}
              onClick={onClickLineSign}
            />
          </Tooltip>
          {isShowLines && (
            <LinesList
              onSelect={this.selectLineHandler}
              shapeType={newShape.type}
              ref={this.clickOutsideLinesListRef}
            />
          )}
        </div>
        <Tooltip title={i18n.ADD_TEXT} mouseEnterDelay={MOUSE_ENTER_DELAY} placement='bottomLeft'>
          <IButton
            type={ButtonTypes.WITH_BG}
            colorType={ColorTypes.MAP_HEADER_GREEN}
            icon={IconNames.MAP_HEADER_ICON_MENU_TEXT}
            disabled={isCatalogLayer}
            active={newShape.type === SelectionTypes.TEXT}
            onClick={this.clickTextHandler}
          />
        </Tooltip>
      </>
    )
  }
}
