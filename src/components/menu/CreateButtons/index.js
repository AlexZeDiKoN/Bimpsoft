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
          icon={
            newShape.type === SelectionTypes.POINT
              ? iconNames.CONVENTIONAL_SIGN_ACTIVE
              : iconNames.CONVENTIONAL_SIGN_DEFAULT
          }
          hoverIcon={iconNames.CONVENTIONAL_SIGN_HOVER}
          onClick={this.clickPointHandler}
        />
        <IconButton
          title={i18n.LINE_SIGN}
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
          title={i18n.ADD_TEXT}
          icon={
            newShape.type === SelectionTypes.TEXT
              ? iconNames.TEXT_SIGN_ACTIVE
              : iconNames.TEXT_SIGN_DEFAULT
          }
          hoverIcon={iconNames.TEXT_SIGN_HOVER}
          onClick={this.clickTextHandler}
        />
      </>
    )
  }
}
