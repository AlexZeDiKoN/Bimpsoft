import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Select, Input, DatePicker, Button } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import ColorPicker from '../../common/ColorPicker'
import { PRINT_PANEL_KEYS, COLOR_PICKER_KEYS } from './../../../constants'
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
    setRequisitesFunc: {},
    legendTableType: '',
  }

  componentDidMount () {
    this.createSetFunctions()
    this.changeLegendTableType('left')
  }

  createSetFunctions = () => {
    const { setPrintRequisites } = this.props
    const Obj = Object.assign(
      Object.keys(PRINT_PANEL_KEYS)
        .reduce((prev, current) => (
          {
            ...prev,
            [ current ]:
              ({ target }, dateString) => target
                ? setPrintRequisites({ [ PRINT_PANEL_KEYS[current] ]: target.value })
                : setPrintRequisites({ [ PRINT_PANEL_KEYS[current] ]: dateString }),
          }
        ), {}),
      Object.keys(COLOR_PICKER_KEYS)
        .reduce((prev, current) => ({
          ...prev,
          [ current ]: (color) => {
            setPrintRequisites({ [ COLOR_PICKER_KEYS[current] ]: color })
            this.setState((prevState) => (
              {
                colors: { ...prevState.colors, [ COLOR_PICKER_KEYS[current] ]: color },
              }
            ))
          },
        }), {}),
    )
    this.setState({ setRequisitesFunc: Obj })
  }

  setScale = (value) => {
    const { setPrintScale } = this.props
    setPrintScale(value)
  }

  changeLegendTableType = (newType) => {
    const { legendTableType } = this.state
    const { setPrintRequisites } = this.props
    if (legendTableType !== newType) {
      this.setState({ legendTableType: newType })
      setPrintRequisites({ [PRINT_PANEL_KEYS.LEGEND_TABLE_TYPE]: newType })
    }
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
      printScale,
      securityClassification: { classified },
    } = this.props
    const { setRequisitesFunc, colors, legendTableType } = this.state
    const { FormColumn, FormRow, ButtonCancel, ButtonSave } = components.form
    return (
      <div className='printPanelFormInner'>
        <Form>
          <FormRow className='printPanel_scale' label={SCALE}>
            {
              getFieldDecorator(
                PRINT_PANEL_KEYS.SCALE, {
                  initialValue: printScale,
                },
              )(
                <Select
                  onChange={this.setScale}
                >
                  {this.createSelectChildren(scales)}
                </Select>,
              )
            }
          </FormRow>
          <Row className='printPanelSecurity'>
            <Col span={5}>
              {MAP_LABEL}
            </Col>
            <Col span={19}>
              {classified}
            </Col>
          </Row>
          <h5 className='docBlock_header'>{DOC_HEADER}</h5>
          <div className='printPanel_docBlock'>
            <FormColumn label={FIRST_ROW}>
              <Input
                onChange={setRequisitesFunc.FIRST_ROW}
              />
            </FormColumn>
            <FormColumn label={SECOND_ROW}>
              <Input
                onChange={setRequisitesFunc.SECOND_ROW}
              />
            </FormColumn>
            <FormColumn label={THIRD_ROW}>
              <Input
                onChange={setRequisitesFunc.THIRD_ROW}
              />
            </FormColumn>
            <FormColumn label={FOURTH_ROW}>
              <Input
                onChange={setRequisitesFunc.FOURTH_ROW}
              />
            </FormColumn>
            <FormColumn label={FIFTH_ROW}>
              <Input
                onChange={setRequisitesFunc.FIFTH_ROW}
              />
            </FormColumn>
            <FormRow label={START}>
              <DatePicker
                format={dateFormat}
                onChange={setRequisitesFunc.START}
              />
            </FormRow>
            <FormRow label={FINISH}>
              <DatePicker
                format={dateFormat}
                onChange={setRequisitesFunc.FINISH}
              />
            </FormRow>
          </div>
          <h5>{MAIN_INDICATORS}</h5>
          <div className='printPanel_indicators'>
            <FormRow>
              <Input
                onChange={setRequisitesFunc.INDICATOR_FIRST_ROW}
              />
            </FormRow>
            <FormRow>
              <Input
                onChange={setRequisitesFunc.INDICATOR_SECOND_ROW}
              />
            </FormRow>
            <FormRow>
              <Input
                onChange={setRequisitesFunc.INDICATOR_THIRD_ROW}
              />
            </FormRow>
          </div>
          <Row className='printPanel_legend'>
            <Col span={18}>
              <h5>{LEGEND}</h5>
            </Col>
            <Col
              span={6}
              className='printPanel_legendControl'
            >
              <Button
                htmlType='button'
                type='normal'
                icon='left'
                size='small'
                className={legendTableType !== 'left' ? '' : 'active'}
                onClick={() => this.changeLegendTableType('left')}
              />
              <Button
                htmlType='button'
                type='normal'
                icon='right'
                size='small'
                className={legendTableType === 'left' ? '' : 'active'}
                onClick={() => this.changeLegendTableType('right')}
              />
            </Col>
          </Row>
          <div className='printPanelSign_block'>
            <Row className='printPanelSignTitle_row'>
              <Col
                span={6}
                className={legendTableType !== 'left' ? 'right' : ''}
              >
                {SIGN}
              </Col>
              <Col span={18}>
                {SIGN_CONTENT}
              </Col>
            </Row>
            <Row className='printPanelSign_row'>
              <Col
                span={6}
                className={legendTableType === 'left' ? '' : 'right'}
              >
                <ColorPicker
                  color={colors[ COLOR_PICKER_KEYS.LEGEND_FIRST_COLOR ]}
                  className='PrintPanel_colorPicker'
                  onChange={setRequisitesFunc.LEGEND_FIRST_COLOR}
                />
              </Col>
              <Col span={18}>
                <Input
                  onChange={setRequisitesFunc.LEGEND_FIRST_CONTENT}
                />
              </Col>
            </Row>
            <Row className='printPanelSign_row'>
              <Col
                span={6}
                className={legendTableType === 'left' ? '' : 'right'}
              >
                <ColorPicker
                  color={colors[ COLOR_PICKER_KEYS.LEGEND_SECOND_COLOR ]}
                  className='PrintPanel_colorPicker'
                  onChange={setRequisitesFunc.LEGEND_SECOND_COLOR}
                />
              </Col>
              <Col span={18}>
                <Input
                  onChange={setRequisitesFunc.LEGEND_SECOND_CONTENT}
                />
              </Col>
            </Row>
            <Row className='printPanelSign_row'>
              <Col
                span={6}
                className={legendTableType === 'left' ? '' : 'right'}
              >
                <ColorPicker
                  color={colors[ COLOR_PICKER_KEYS.LEGEND_THIRD_COLOR ]}
                  className='PrintPanel_colorPicker'
                  onChange={setRequisitesFunc.LEGEND_THIRD_COLOR}
                />
              </Col>
              <Col span={18}>
                <Input
                  onChange={setRequisitesFunc.LEGEND_THIRD_CONTENT}
                />
              </Col>
            </Row>
            <Row className='printPanelSign_row'>
              <Col
                span={6}
                className={legendTableType === 'left' ? '' : 'right'}
              >
                <ColorPicker
                  color={colors[ COLOR_PICKER_KEYS.LEGEND_FOURTH_COLOR ]}
                  className='PrintPanel_colorPicker'
                  onChange={setRequisitesFunc.LEGEND_FOURTH_COLOR}
                />
              </Col>
              <Col span={18}>
                <Input
                  onChange={setRequisitesFunc.LEGEND_FOURTH_CONTENT}
                />
              </Col>
            </Row>
          </div>
          <h5>{DOCUMENT_SIGNATORIES}</h5>
          <div className='printPanel_signatories'>
            <Row className='printPanelSignatoriesTitle_row'>
              <Col span={10}>
                {POSITION}
              </Col>
              <Col span={6}>
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
                  <Col span={10}>
                    {position}
                  </Col>
                  <Col span={6}>
                    {role}
                  </Col>
                  <Col span={8}>
                    {name}
                  </Col>
                </Row>
              )
            })}
          </div>
          <FormRow className='printPanel_confirmDate' label={CONFIRM_DATE}>
            {
              getFieldDecorator(
                PRINT_PANEL_KEYS.CONFIRM_DATE, {
                  initialValue: confirmDate,
                },
              )(
                <Input
                  disabled
                />,
              )
            }
          </FormRow>

          <Row className='printPanel_buttonBlock'>
            <Col span={12}>
              <ButtonCancel onClick={this.cancelPrint} />
            </Col>
            <Col span={12}>
              {/* TODO: доделать отправку */}
              <ButtonSave/>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

const WrappedPrintPanel = Form.create()(PrintPanel)

export default WrappedPrintPanel
