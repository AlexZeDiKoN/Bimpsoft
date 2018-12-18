import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Select, Input, DatePicker, Button } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import ColorPicker from '../../common/ColorPicker'
import { PRINT_PANEL_KEYS } from './../../../constants'
import {
  SCALE,
  MAP_LABEL,
  DOC_HEADER,
  FIRST_ROW,
  SECOND_ROW,
  THIRD_ROW,
  FOURTH_ROW,
  FIFTH_ROW, START, FINISH, MAIN_INDICATORS, LEGEND, SIGN, SIGN_CONTENT,
} from './../../../i18n/ua'
import './style.css'

// TODO: вынести в константы
const scales = [ '100000', '200000', '500000', '1000000' ]

class PrintPanel extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
  }

  state = {
    colors: {
      0: undefined,
      1: undefined,
      2: undefined,
      3: undefined,
    },
  }

  changeColorHandler = (color, key) => {
    const state = this.state
    state.colors[key] = color
    this.setState(state)
  }

  createSelectChildren = (incomeData) => incomeData
    .map((item) => <Select.Option key={item}>{item}</Select.Option>)

  handleSubmit = (e) => {
    const customFields = { ...this.state.customFields }
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        console.log('Received values of form: ', customFields)
      } else {
        console.log({ values, customFields })
      }
    })
  }

  render () {
    const { form: { getFieldDecorator } } = this.props
    const { FormColumn, FormRow } = components.form
    return (
      <div className='printPanelFormInner'>
        <Form onSubmit={this.handleSubmit}>
          <FormRow label={ SCALE }>
            {
              getFieldDecorator(
                PRINT_PANEL_KEYS.SCALE, {
                  initialValue: '100000',
                }
              )(
                <Select>
                  {this.createSelectChildren(scales)}
                </Select>
              )
            }
          </FormRow>
          <FormRow label={ MAP_LABEL }>
            {
              getFieldDecorator(
                PRINT_PANEL_KEYS.MAP_LABEL
              )(
                <Input
                  disabled
                />
              )
            }
          </FormRow>
          <h5 className='docBlock_header'>{DOC_HEADER}</h5>
          <div className='printPanel_docBlock'>
            <FormColumn label={ FIRST_ROW }>
              {
                getFieldDecorator(
                  PRINT_PANEL_KEYS.FIRST_ROW
                )(
                  <Input/>
                )
              }
            </FormColumn>
            <FormColumn label={ SECOND_ROW }>
              {
                getFieldDecorator(
                  PRINT_PANEL_KEYS.SECOND_ROW
                )(
                  <Input/>
                )
              }
            </FormColumn>
            <FormColumn label={ THIRD_ROW }>
              {
                getFieldDecorator(
                  PRINT_PANEL_KEYS.THIRD_ROW
                )(
                  <Input/>
                )
              }
            </FormColumn>
            <FormColumn label={ FOURTH_ROW }>
              {
                getFieldDecorator(
                  PRINT_PANEL_KEYS.FOURTH_ROW
                )(
                  <Input/>
                )
              }
            </FormColumn>
            <FormColumn label={ FIFTH_ROW }>
              {
                getFieldDecorator(
                  PRINT_PANEL_KEYS.FIFTH_ROW
                )(
                  <Input/>
                )
              }
            </FormColumn>
            <FormRow label={ START }>
              {
                getFieldDecorator(
                  PRINT_PANEL_KEYS.START
                )(
                  <DatePicker />
                )
              }
            </FormRow>
            <FormRow label={ FINISH }>
              {
                getFieldDecorator(
                  PRINT_PANEL_KEYS.FINISH
                )(
                  <DatePicker />
                )
              }
            </FormRow>
          </div>
          <h5>{MAIN_INDICATORS}</h5>
          <div className='printPanel_indicators'>
            <FormRow>
              {
                getFieldDecorator(
                  PRINT_PANEL_KEYS.INDICATOR_FIRST_ROW
                )(
                  <Input />
                )
              }
            </FormRow>
            <FormRow>
              {
                getFieldDecorator(
                  PRINT_PANEL_KEYS.INDICATOR_SECOND_ROW
                )(
                  <Input />
                )
              }
            </FormRow>
            <FormRow>
              {
                getFieldDecorator(
                  PRINT_PANEL_KEYS.INDICATOR_THIRD_ROW
                )(
                  <Input />
                )
              }
            </FormRow>
          </div>
          <h5>{LEGEND}</h5>
          <Row className='printPanelSignTitle_row'>
            <Col span={6}>
              {SIGN}
            </Col>
            <Col span={18}>
              {SIGN_CONTENT}
            </Col>
          </Row>
          <Row className='printPanelSign_row'>
            <Col span={6}>
              <ColorPicker
                color={this.state.colors['0']}
                className='PrintPanel_colorPicker'
                onChange={(color) => this.changeColorHandler(color, 0)}
              />
            </Col>
            <Col span={17}>
              {
                getFieldDecorator(
                  PRINT_PANEL_KEYS.LEGEND_FIRST_CONTENT
                )(
                  <Input/>
                )
              }
            </Col>
          </Row>
          <Row className='printPanelSign_row'>
            <Col span={6}>
              <ColorPicker
                color={this.state.colors[1]}
                className='PrintPanel_colorPicker'
                onChange={(color) => this.changeColorHandler(color, 1)}
              />
            </Col>
            <Col span={17}>
              {
                getFieldDecorator(
                  PRINT_PANEL_KEYS.LEGEND_SECOND_CONTENT
                )(
                  <Input/>
                )
              }
            </Col>
          </Row>
          <Row className='printPanelSign_row'>
            <Col span={6}>
              <ColorPicker
                color={this.state.colors['2']}
                className='PrintPanel_colorPicker'
                onChange={(color) => this.changeColorHandler(color, 2)}
              />
            </Col>
            <Col span={17}>
              {
                getFieldDecorator(
                  PRINT_PANEL_KEYS.LEGEND_THIRD_CONTENT
                )(
                  <Input/>
                )
              }
            </Col>
          </Row>
          <Row className='printPanelSign_row'>
            <Col span={6}>
              <ColorPicker
                color={this.state.colors['3']}
                className='PrintPanel_colorPicker'
                onChange={(color) => this.changeColorHandler(color, 3)}
              />
            </Col>
            <Col span={17}>
              {
                getFieldDecorator(
                  PRINT_PANEL_KEYS.LEGEND_FOURTH_CONTENT
                )(
                  <Input/>
                )
              }
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Button key="close">CANCEL</Button>
              <Button
                type="primary"
                htmlType="submit"
              >
                SAVE
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

const WrappedPrintPanel = Form.create()(PrintPanel)

export default WrappedPrintPanel
