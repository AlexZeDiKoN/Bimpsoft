import React from 'react'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import IconButton from '../IconButton'
import './style.css'
import i18n from '../../../i18n'
import SelectionTypes from '../../../constants/SelectionTypes'
import LinesList from '../../LinesList'
import { getClickOutsideRef } from '../../../utils/clickOutside'
import MenuDivider from '../MenuDivider'

const iconNames = components.icons.names

const lineTypes = [
  SelectionTypes.AREA, SelectionTypes.CURVE, SelectionTypes.POLYGON, SelectionTypes.POLYLINE, SelectionTypes.CIRCLE,
  SelectionTypes.RECTANGLE, SelectionTypes.SQUARE,
]

export default class CreateButtons extends React.PureComponent {
  static propTypes = {
    isEditMode: PropTypes.bool,
    isShowLines: PropTypes.bool,
    newShape: PropTypes.object,
    onClickLineSign: PropTypes.func,
    onNewShapeChange: PropTypes.func,
    onLinesListClose: PropTypes.func,
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
      newShape = {},
      onClickLineSign,
    } = this.props

    if (!isEditMode) {
      return null
    }
    return (
      <>
        <MenuDivider />
        <IconButton
          title={i18n.POINT_SIGN}
          icon={iconNames.CONVENTIONAL_SIGN_DEFAULT}
          checked={newShape.type === SelectionTypes.POINT}
          onClick={this.clickPointHandler}
        />
        <IconButton
          title={i18n.LINE_SIGN}
          icon={iconNames.GROUPING_GRAPHIC_PRIMITIVES_DEFAULT}
          checked={lineTypes.indexOf(newShape.type) >= 0}
          onClick={onClickLineSign}
        >
          {isShowLines && (
            <LinesList
              onSelect={this.selectLineHandler}
              shapeType={newShape.type}
              ref={this.clickOutsideLinesListRef}
            />
          )}
        </IconButton>
        <IconButton
          title={i18n.ADD_TEXT}
          icon={iconNames.TEXT_SIGN_DEFAULT}
          checked={newShape.type === SelectionTypes.TEXT}
          onClick={this.clickTextHandler}
        />
      </>
    )
  }
}
