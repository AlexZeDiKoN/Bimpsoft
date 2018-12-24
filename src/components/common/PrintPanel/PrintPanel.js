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
  FIFTH_ROW,
  START,
  FINISH,
  MAIN_INDICATORS,
  LEGEND,
  SIGN,
  SIGN_CONTENT,
  DOCUMENT_SIGNATORIES,
  POSITION,
  RANG,
  FULL_NAME, CONFIRM_DATE,
} from './../../../i18n/ua'
import './style.css'

// TODO: заменить реальными данными
const signatories = [
  { position: `Начальник штабу`, role: `полковник`, name: `О.С. Харченко`, date: `21.12.18` },
  { position: `Начальник оперативного управління`, role: `полковник`, name: `І.І. Панас`, date: `22.12.18` },
]
const classified = `Для службового користування`
const confirmDate = `22.12.18`

// TODO: вынести в константы
const scales = [ '100000', '200000', '500000', '1000000' ]

class PrintPanel extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    printScale: PropTypes.func,
  }

  state = {
    colors: {
      legendFirstColor: undefined,
      legendSecondColor: undefined,
      legendThirdColor: undefined,
      legendFourthColor: undefined,
    },
  }

  changeColorHandler = (color, key) => {
    const colors = this.state.colors
    colors[key] = color
    this.setState({ colors: colors })
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
    const { form: { getFieldDecorator }, printScale } = this.props
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
                <Select
                  onChange={(value) => printScale(value)}
                >
                  {this.createSelectChildren(scales)}
                </Select>
              )
            }
          </FormRow>
          <FormRow label={ MAP_LABEL }>
            {
              getFieldDecorator(
                PRINT_PANEL_KEYS.MAP_LABEL, {
                  initialValue: classified,
                }
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
          <div className='printPanelSign_block'>
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
                  color={this.state.colors[PRINT_PANEL_KEYS.LEGEND_FIRST_COLOR]}
                  className='PrintPanel_colorPicker'
                  onChange={(color) => this.changeColorHandler(color, PRINT_PANEL_KEYS.LEGEND_FIRST_COLOR)}
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
                  color={this.state.colors[PRINT_PANEL_KEYS.LEGEND_SECOND_COLOR]}
                  className='PrintPanel_colorPicker'
                  onChange={(color) => this.changeColorHandler(color, PRINT_PANEL_KEYS.LEGEND_SECOND_COLOR)}
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
                  color={this.state.colors[PRINT_PANEL_KEYS.LEGEND_THIRD_COLOR]}
                  className='PrintPanel_colorPicker'
                  onChange={(color) => this.changeColorHandler(color, PRINT_PANEL_KEYS.LEGEND_THIRD_COLOR)}
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
                  color={this.state.colors[PRINT_PANEL_KEYS.LEGEND_FOURTH_COLOR]}
                  className='PrintPanel_colorPicker'
                  onChange={(color) => this.changeColorHandler(color, PRINT_PANEL_KEYS.LEGEND_FOURTH_COLOR)}
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
          </div>
          <h5>{DOCUMENT_SIGNATORIES}</h5>
          <div className='printPanel_signatories'>
            <Row className='printPanelSignatoriesTitle_row'>
              <Col span={12}>
                {POSITION}
              </Col>
              <Col span={4}>
                {RANG}
              </Col>
              <Col span={8}>
                {FULL_NAME}
              </Col>
            </Row>
            {signatories.map((rowData) => {
              const { position, role, name, date } = rowData
              return (
                <Row key={date}>
                  <Col span={12}>
                    {position}
                  </Col>
                  <Col span={4}>
                    {role}
                  </Col>
                  <Col span={8}>
                    {name}
                  </Col>
                </Row>
              )
            })}
          </div>
          <FormRow label={ CONFIRM_DATE }>
            {
              getFieldDecorator(
                PRINT_PANEL_KEYS.MAP_LABEL, {
                  initialValue: confirmDate,
                }
              )(
                <Input
                  disabled
                />
              )
            }
          </FormRow>

          <Row>
            <Col span={12}>
              <Button
                key="close"
              >
                SCALE 200000
              </Button>
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
