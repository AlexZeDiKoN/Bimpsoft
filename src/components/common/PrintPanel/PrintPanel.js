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
  FULL_NAME,
  CONFIRM_DATE,
} from './../../../i18n/ua'
import './style.css'

// TODO: заменить реальными данными
const signatories = [
  { position: `Начальник штабу`, role: `полковник`, name: `О.С. Харченко`, date: `21.12.18` },
  { position: `Начальник оперативного управління`, role: `полковник`, name: `І.І. Панас`, date: `22.12.18` },
]
const confirmDate = `22.12.18`

// TODO: вынести в константы
const scales = [ '100000', '200000', '500000', '1000000' ]
const dateFormat = 'DD.MM.YYYY'

class PrintPanel extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    setPrintScale: PropTypes.func,
    printScale: PropTypes.number,
    docConfirm: PropTypes.object,
    securityClassification: PropTypes.object,
    setPrintRequisites: PropTypes.func,
    clearPrintRequisites: PropTypes.func,
    print: PropTypes.func,
  }

  state = {
    colors: {
      legendFirstColor: undefined,
      legendSecondColor: undefined,
      legendThirdColor: undefined,
      legendFourthColor: undefined,
    },
    setRequisitesFunk: {},
  }

  componentDidMount () {
    const { setPrintRequisites } = this.props
    const Obj = Object.keys(PRINT_PANEL_KEYS)
      .reduce((prev, current) => (
        { ...prev,
          [current]:
            ({ target }, dateString) => target
              ? setPrintRequisites({ [current]: target.value })
              : setPrintRequisites({ [current]: dateString }),
        }
      ), {})
    this.setState({ setRequisitesFunk: Obj })
  }

  changeColorHandler = (color, key) => {
    const colors = this.state.colors
    const { setPrintRequisites } = this.props
    colors[key] = color
    this.setState({ colors: colors })
    setPrintRequisites({ [key]: color })
  }

  cancelPrint = () => {
    const { print, clearPrintRequisites } = this.props
    print()
    clearPrintRequisites()
  }

  createSelectChildren = (incomeData) => incomeData
    .map((item) => <Select.Option key={item}>{item}</Select.Option>)

  render () {
    const {
      form: { getFieldDecorator },
      setPrintScale,
      printScale,
      securityClassification: { classified },
    } = this.props
    const { setRequisitesFunk } = this.state
    const { FormColumn, FormRow } = components.form
    return (
      <div className='printPanelFormInner'>
        <Form>
          <FormRow label={ SCALE }>
            {
              getFieldDecorator(
                PRINT_PANEL_KEYS.SCALE, {
                  initialValue: printScale,
                }
              )(
                <Select
                  onChange={(value) => setPrintScale(value)}
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
                },
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
              <Input
                onChange={setRequisitesFunk.FIRST_ROW}
              />
            </FormColumn>
            <FormColumn label={ SECOND_ROW }>
              <Input
                onChange={setRequisitesFunk.SECOND_ROW}
              />
            </FormColumn>
            <FormColumn label={ THIRD_ROW }>
              <Input
                onChange={setRequisitesFunk.THIRD_ROW}
              />
            </FormColumn>
            <FormColumn label={ FOURTH_ROW }>
              <Input
                onChange={setRequisitesFunk.FOURTH_ROW}
              />
            </FormColumn>
            <FormColumn label={ FIFTH_ROW }>
              <Input
                onChange={setRequisitesFunk.FIFTH_ROW}
              />
            </FormColumn>
            <FormRow label={ START }>
              <DatePicker
                format={dateFormat}
                onChange={setRequisitesFunk.START}
              />
            </FormRow>
            <FormRow label={ FINISH }>
              <DatePicker
                format={dateFormat}
                onChange={setRequisitesFunk.FINISH}
              />
            </FormRow>
          </div>
          <h5>{MAIN_INDICATORS}</h5>
          <div className='printPanel_indicators'>
            <FormRow>
              <Input
                onChange={setRequisitesFunk.INDICATOR_FIRST_ROW}
              />
            </FormRow>
            <FormRow>
              <Input
                onChange={setRequisitesFunk.INDICATOR_SECOND_ROW}
              />
            </FormRow>
            <FormRow>
              <Input
                onChange={setRequisitesFunk.INDICATOR_THIRD_ROW}
              />
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
                <Input
                  onChange={setRequisitesFunk.LEGEND_FIRST_CONTENT}
                />
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
                <Input
                  onChange={setRequisitesFunk.LEGEND_SECOND_CONTENT}
                />
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
                <Input
                  onChange={setRequisitesFunk.LEGEND_THIRD_CONTENT}
                />
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
                <Input
                  onChange={setRequisitesFunk.LEGEND_FOURTH_CONTENT}
                />
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
                PRINT_PANEL_KEYS.CONFIRM_DATE, {
                  initialValue: confirmDate,
                },
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
                onClick={this.cancelPrint}
              >
                CANCEL
              </Button>
              <Button
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
