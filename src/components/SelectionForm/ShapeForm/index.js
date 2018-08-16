import React from 'react'
import { Select } from 'antd'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import { List } from 'immutable'
import i18n from '../../../i18n'
import { colors } from '../../../constants'
import {
  default as Form,
  FormItem,
  FormRow,
  FormDivider,
  FormDarkPart,
  FormButtonOk,
  FormButtonCancel,
} from './../../form'
import './style.css'
import CoordinateItem from './CoordinateItem'

const Option = Select.Option

const { icons: { Icon, IconHovered, names: iconNames } } = components

const SEGMENT_ARC = 'arc'
const SEGMENT_DIRECT = 'direct'

const TYPE_SOLID = 'solid'
const TYPE_DASHED = 'dashed'

const colorOption = (color, title) => (
  <Option value={color}>
    <div className="icon-option">
      <div className="icon-rect" style={{ backgroundColor: colors.values[color] }}></div>
      <div className="icon-text">{title}</div>
    </div>
  </Option>
)

const iconOption = (value, icon, title) => (
  <Option value={value}>
    <div className="icon-option">
      <Icon icon={icon} className="icon-rect"/>
      <div className="icon-text">{title}</div>
    </div>
  </Option>
)

const typeOption = (value, borderStyle, title) => (
  <Option value={value}>
    <div className="icon-option">
      <div className="option-line-type" style={{ borderStyle }}></div>
      <div className="icon-text">{title}</div>
    </div>
  </Option>
)

export default class ShapeForm extends React.Component {
  static propTypes = {
    color: PropTypes.string,
    segment: PropTypes.string,
    lineType: PropTypes.string,
    coordinatesArray: PropTypes.arrayOf(PropTypes.object),
    onChange: PropTypes.func,
    onClose: PropTypes.func,
  }

  constructor (props) {
    super(props)
    const {
      color = colors.BLUE,
      segment = SEGMENT_DIRECT,
      lineType = TYPE_SOLID,
      coordinatesArray = [ {} ],
    } = props
    this.state = {
      color,
      segment,
      lineType,
      coordinatesArray: List(coordinatesArray),
      editCoordinates: false,
    }
  }

  colorChangeHandler = (value) => this.setState({ color: value })

  segmentChangeHandler = (value) => this.setState({ segment: value })

  lineTypeChangeHandler = (value) => this.setState({ lineType: value })

  coordinateChangeHandler = (index, item) => {
    this.setState({ coordinatesArray: this.state.coordinatesArray.set(index, item) })
  }

  coordinateRemoveHandler = (index) => {
    if (this.state.coordinatesArray.size <= 1) {
      return
    }
    this.setState({ coordinatesArray: this.state.coordinatesArray.delete(index) })
  }

  coordinatesEditClickHandler = () => this.setState({ editCoordinates: !this.state.editCoordinates })

  okHandler = () => {
    const {
      color,
      segment,
      lineType,
      style,
      coordinatesArray,
    } = this.state
    this.props.onChange({
      color,
      segment,
      lineType,
      style,
      coordinatesArray: coordinatesArray.toJS(),
    })
  }

  cancelHandler = () => {
    this.props.onClose()
  }

  coordinateAddHandler = () => {
    this.setState({ coordinatesArray: this.state.coordinatesArray.push({ x: '', y: '' }) })
  }

  render () {
    const {
      color,
      segment,
      lineType,
      coordinatesArray,
      editCoordinates,
    } = this.state
    return (
      <Form className="shape-form">
        <FormRow label={i18n.COLOR}>
          <Select value={ color } onChange={this.colorChangeHandler} >
            {colorOption(colors.BLUE, i18n.BLUE)}
            {colorOption(colors.RED, i18n.RED)}
            {colorOption(colors.BLACK, i18n.BLACK)}
            {colorOption(colors.GREEN, i18n.GREEN)}
            {colorOption(colors.YELLOW, i18n.YELLOW)}
          </Select>
        </FormRow>
        <FormRow label={i18n.LINE_SEGMENT}>
          <Select value={ segment } onChange={this.segmentChangeHandler} >
            {iconOption(SEGMENT_DIRECT, iconNames.BROKEN_LINE_ACTIVE, i18n.SEGMENT_DIRECT)}
            {iconOption(SEGMENT_ARC, iconNames.CURVE_ACTIVE, i18n.SEGMENT_ARC)}
          </Select>
        </FormRow>
        <FormRow label={i18n.LINE_TYPE}>
          <Select value={ lineType } onChange={this.lineTypeChangeHandler} >
            {typeOption(TYPE_SOLID, 'solid', i18n.SOLID)}
            {typeOption(TYPE_DASHED, 'dashed', i18n.DASHED)}
          </Select>
        </FormRow>
        <FormDarkPart>
          <FormRow label={i18n.COORDINATES}>
            <IconHovered
              icon={editCoordinates ? iconNames.BAR_2_EDIT_ACTIVE : iconNames.BAR_2_EDIT_DEFAULT}
              hoverIcon={iconNames.BAR_2_EDIT_HOVER}
              onClick={this.coordinatesEditClickHandler}
            />
          </FormRow>
          <FormDivider />
          <FormRow label={i18n.NODAL_POINTS}>
            <IconHovered
              icon={iconNames.MAP_SCALE_PLUS_DEFAULT}
              hoverIcon={iconNames.MAP_SCALE_PLUS_HOVER}
              onClick={this.coordinateAddHandler}
            />
          </FormRow>
          <div className="text-form-scrollable">
            {coordinatesArray.map((coordinate, index) => (
              <CoordinateItem
                key={index}
                coordinate={coordinate}
                index={index}
                canRemove={coordinatesArray.size > 1}
                onChange={this.coordinateChangeHandler}
                onRemove={this.coordinateRemoveHandler}
              />
            ))}
          </div>
        </FormDarkPart>
        <FormItem>
          <FormButtonCancel onClick={this.cancelHandler}/>
          <FormButtonOk onClick={this.okHandler}/>
        </FormItem>
      </Form>
    )
  }
}
