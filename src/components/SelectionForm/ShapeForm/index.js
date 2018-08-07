import React from 'react'
import { Select, Input } from 'antd'
import PropTypes from 'prop-types'
import i18n from '../../../i18n'
import { default as Form, FormRow } from '../../form'

const Option = Select.Option
const { TextArea } = Input

const COLOR_BLUE = 'blue'
const COLOR_RED = 'red'
const COLOR_BLACK = 'black'
const COLOR_GREEN = 'green'
const COLOR_YELLOW = 'yellow'

const SEGMENT_ARC = 'arc'
const SEGMENT_DIRECT = 'direct'

const TYPE_SOLID = 'solid'
const TYPE_DASHED = 'dashed'

const STYLE_WAVE = 'wave'

export default class ShapeForm extends React.Component {
  static propTypes = {
    color: PropTypes.string,
    segment: PropTypes.string,
    lineType: PropTypes.string,
    style: PropTypes.string,
    coordinatesArray: PropTypes.arrayOf(PropTypes.object),
    onChange: PropTypes.func,
    onClose: PropTypes.func,
  }

  constructor (props) {
    super(props)
    const {
      color = COLOR_BLUE,
      segment = SEGMENT_DIRECT,
      lineType = TYPE_SOLID,
      style = STYLE_WAVE,
      coordinatesArray = [],
    } = props
    this.state = {
      color,
      segment,
      lineType,
      style,
      coordinatesArray: coordinatesArray.map((point) => `${point.x || 0} ${point.y || 0}`).join('\r\n'),
    }
  }

  colorChangeHandler = (value) => this.setState({ color: value })

  segmentChangeHandler = (value) => this.setState({ segment: value })

  lineTypeChangeHandler = (value) => this.setState({ lineType: value })

  styleChangeHandler = (value) => this.setState({ style: value })

  coordinatesArrayChangeHandler = ({ target: { value } }) => this.setState({
    coordinatesArray: value,
  })

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
      coordinatesArray: coordinatesArray.split(/(\r\n|\r|\n)/g).map((row) => {
        const [ x = 0, y = 0 ] = row.split(' ')
        return { x, y }
      }),
    })
  }

  cancelHandler = () => {
    this.props.onClose()
  }

  render () {
    const {
      color,
      segment,
      lineType,
      style,
      coordinatesArray,
    } = this.state
    return (
      <Form>
        <FormRow label={i18n.COLOR}>
          <Select value={ color } onChange={this.colorChangeHandler} >
            <Option value={COLOR_BLUE}>{i18n.BLUE}</Option>
            <Option value={COLOR_RED}>{i18n.RED}</Option>
            <Option value={COLOR_BLACK}>{i18n.BLACK}</Option>
            <Option value={COLOR_GREEN}>{i18n.GREEN}</Option>
            <Option value={COLOR_YELLOW}>{i18n.YELLOW}</Option>
          </Select>
        </FormRow>
        <FormRow label={i18n.LINE_SEGMENT}>
          <Select value={ segment } onChange={this.segmentChangeHandler} >
            <Option value={SEGMENT_DIRECT}>{i18n.SEGMENT_DIRECT}</Option>
            <Option value={SEGMENT_ARC}>{i18n.SEGMENT_ARC}</Option>
          </Select>
        </FormRow>
        <FormRow label={i18n.LINE_TYPE}>
          <Select value={ lineType } onChange={this.lineTypeChangeHandler} >
            <Option value={TYPE_SOLID}>{i18n.SOLID}</Option>
            <Option value={TYPE_DASHED}>{i18n.DASHED}</Option>
          </Select>
        </FormRow>
        <FormRow label={i18n.LINE_STYLE}>
          <Select value={ style } onChange={this.styleChangeHandler} >
            <Option value={STYLE_WAVE}>{i18n.LINE_STYLE_WAVE}</Option>
          </Select>
        </FormRow>
        <FormRow label={i18n.NODAL_POINTS}>
          <TextArea
            value={ coordinatesArray }
            onChange={this.coordinatesArrayChangeHandler}
          />
        </FormRow>
        <FormRow>
          <button onClick={this.cancelHandler}>{i18n.CANCEL}</button>
          <button onClick={this.okHandler}>{i18n.OK}</button>
        </FormRow>
      </Form>
    )
  }
}
