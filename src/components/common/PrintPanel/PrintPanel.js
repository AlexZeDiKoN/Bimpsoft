import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Select, Input, DatePicker, Button } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import moment from 'moment'
import ColorPicker from '../../common/ColorPicker'
import i18n from '../../../i18n'
import { Print } from '../../../constants'
import './style.css'

// TODO: заменить реальными данными
// const signatories = [
//   { position: `Начальник штабу`, role: `полковник`, name: `О.С. Харченко`, date: `21.12.18` },
//   { position: `Начальник оперативного управління`, role: `полковник`, name: `І.І. Панас`, date: `22.12.18` },
// ]
// const confirmDate = `22.12.18`

class PrintPanel extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    setPrintScale: PropTypes.func,
    printScale: PropTypes.number,
    docConfirm: PropTypes.array,
    approversData: PropTypes.array,
    securityClassification: PropTypes.object,
    setPrintRequisites: PropTypes.func,
    clearPrintRequisites: PropTypes.func,
    print: PropTypes.func,
    requisites: PropTypes.object,
    createPrintFile: PropTypes.func,
  }

  constructor (props) {
    super(props)
    this.state = {
      colors: {
        legendFirstColor: props.requisites.legendFirstColor || undefined,
        legendSecondColor: props.requisites.legendSecondColor || undefined,
        legendThirdColor: props.requisites.legendThirdColor || undefined,
        legendFourthColor: props.requisites.legendFourthColor || undefined,
      },
      setRequisitesFunc: {},
      legendTableType: props.requisites.legendTableType,
      signatories: [],
    }
  }

  componentDidMount () {
    this.createSetFunctions()
    this.formatApprovers()
  }

  createSetFunctions = () => {
    const { setPrintRequisites } = this.props
    const { PRINT_PANEL_KEYS, COLOR_PICKER_KEYS } = Print
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

  formatApprovers = () => {
    const { approversData, docConfirm: { signers, approver } } = this.props
    const signatories = []
    signers.push(approver)
    signers.forEach((signer) => {
      const { id_user: userId, date } = signer
      const { name, patronymic, surname, position, role } = approversData.filter((item) => +item.id === userId)[0] || {}
      signatories.push({ position, role, name: this.formatContactName(name, patronymic, surname), date })
    })
    this.setState({ signatories })
  }

  formatContactName = (name, patronymic, surname) => {
    let result = surname
    name && (result = `${result} ${name.slice(0, 1)}.`)
    patronymic && (result = `${result} ${patronymic.slice(0, 1)}.`)
    return result
  }

  setScale = (value) => {
    const { setPrintScale } = this.props
    setPrintScale(value)
  }

  setPrintParameters = (value, key) => {
    const { setPrintRequisites } = this.props
    setPrintRequisites({ [ key ]: value })
  }

  changeLegendTableType = (newType) => {
    const { legendTableType } = this.state
    const { setPrintRequisites } = this.props
    const { LEGEND_TABLE_TYPE } = Print.PRINT_PANEL_KEYS
    if (legendTableType !== newType) {
      this.setState({ legendTableType: newType })
      setPrintRequisites({ [LEGEND_TABLE_TYPE]: newType })
    }
  }

  cancelPrint = () => {
    const { print, clearPrintRequisites } = this.props
    print()
    clearPrintRequisites()
  }

  createPrintFile = () => {
    const { createPrintFile } = this.props
    createPrintFile()
  }

  createSelectChildren = (incomeData) => incomeData
    .map((item) => <Select.Option key={item}>{item}</Select.Option>)

  render () {
    const {
      form: { getFieldDecorator },
      printScale,
      securityClassification: { classified },
      docConfirm: { approver },
      requisites,
    } = this.props
    const { setRequisitesFunc, colors, legendTableType, signatories } = this.state
    const {
      PRINT_PANEL_KEYS, PRINT_SELECTS_KEYS, PRINT_SCALES,
      DPI_TYPES, DATE_FORMAT, COLOR_PICKER_KEYS, PRINT_PROJECTION_GROUP,
    } = Print
    const { FormColumn, FormRow, ButtonCancel, ButtonSave } = components.form
    return (
      <div className='printPanelFormInner'>
        <Form>
          <FormRow className='printPanel_scale' label={i18n.SCALE}>
            {
              getFieldDecorator(
                PRINT_SELECTS_KEYS.SCALE, {
                  initialValue: printScale,
                },
              )(
                <Select
                  onChange={this.setScale}
                >
                  {this.createSelectChildren(PRINT_SCALES)}
                </Select>,
              )
            }
          </FormRow>
          {/* TODO: наразі прихований блок. При відображені замінити на FormRow */}
          <Row className='printPanel_dpi invisible' label={i18n.DPI}>
            {
              getFieldDecorator(
                PRINT_SELECTS_KEYS.DPI, {
                  initialValue: requisites.dpi,
                },
              )(
                <Select
                  onChange={(value) => this.setPrintParameters(value, PRINT_SELECTS_KEYS.DPI)}
                >
                  {this.createSelectChildren(DPI_TYPES)}
                </Select>,
              )
            }
          </Row>
          {/* TODO: наразі прихований блок. При відображені замінити на FormRow */}
          <Row className='printPanel_coordinatesType invisible' label={i18n.COORDINATES_TYPE}>
            {
              getFieldDecorator(
                PRINT_SELECTS_KEYS.PROJECTION_GROUP, {
                  initialValue: requisites.coordinatesType,
                },
              )(
                <Select
                  onChange={(value) => this.setPrintParameters(value, PRINT_SELECTS_KEYS.COORDINATES_TYPES)}
                >
                  {this.createSelectChildren(PRINT_PROJECTION_GROUP)}
                </Select>,
              )
            }
          </Row>
          <Row className='printPanelSecurity'>
            <Col span={5}>
              {i18n.MAP_LABEL}
            </Col>
            <Col span={19}>
              {classified}
            </Col>
          </Row>
          <h5 className='docBlock_header'>{i18n.DOC_HEADER}</h5>
          <div className='printPanel_docBlock'>
            <FormColumn label={i18n.FIRST_ROW}>
              {
                getFieldDecorator(
                  PRINT_PANEL_KEYS.FIRST_ROW, {
                    initialValue: requisites.firstRow,
                  },
                )(
                  <Input
                    onChange={setRequisitesFunc.FIRST_ROW}
                  />
                )
              }
            </FormColumn>
            <FormColumn label={i18n.SECOND_ROW}>
              {
                getFieldDecorator(
                  PRINT_PANEL_KEYS.SECOND_ROW, {
                    initialValue: requisites.secondRow,
                  },
                )(
                  <Input
                    onChange={setRequisitesFunc.SECOND_ROW}
                  />
                )
              }
            </FormColumn>
            <FormColumn label={i18n.THIRD_ROW}>
              {
                getFieldDecorator(
                  PRINT_PANEL_KEYS.THIRD_ROW, {
                    initialValue: requisites.thirdRow,
                  },
                )(
                  <Input
                    onChange={setRequisitesFunc.THIRD_ROW}
                  />
                )
              }
            </FormColumn>
            <FormColumn label={i18n.FOURTH_ROW}>
              {
                getFieldDecorator(
                  PRINT_PANEL_KEYS.FOURTH_ROW, {
                    initialValue: requisites.fourthRow,
                  },
                )(
                  <Input
                    onChange={setRequisitesFunc.FOURTH_ROW}
                  />
                )
              }
            </FormColumn>
            <FormColumn label={i18n.FIFTH_ROW}>
              {
                getFieldDecorator(
                  PRINT_PANEL_KEYS.FIFTH_ROW, {
                    initialValue: requisites.fifthRow,
                  },
                )(
                  <Input
                    onChange={setRequisitesFunc.FIFTH_ROW}
                  />
                )
              }
            </FormColumn>
            <FormRow label={i18n.START}>
              <DatePicker
                format={DATE_FORMAT}
                defaultValue={requisites.start ? moment(requisites.start, DATE_FORMAT) : null}
                onChange={setRequisitesFunc.START}
              />
            </FormRow>
            <FormRow label={i18n.FINISH}>
              <DatePicker
                format={DATE_FORMAT}
                defaultValue={requisites.finish ? moment(requisites.finish, DATE_FORMAT) : null}
                onChange={setRequisitesFunc.FINISH}
              />
            </FormRow>
          </div>
          <h5>{i18n.MAIN_INDICATORS}</h5>
          <div className='printPanel_indicators'>
            <FormRow>
              {
                getFieldDecorator(
                  PRINT_PANEL_KEYS.INDICATOR_FIRST_ROW, {
                    initialValue: requisites.indiFirst,
                  },
                )(
                  <Input
                    onChange={setRequisitesFunc.INDICATOR_FIRST_ROW}
                  />
                )
              }
            </FormRow>
            <FormRow>
              {
                getFieldDecorator(
                  PRINT_PANEL_KEYS.INDICATOR_SECOND_ROW, {
                    initialValue: requisites.indiSecond,
                  },
                )(
                  <Input
                    onChange={setRequisitesFunc.INDICATOR_SECOND_ROW}
                  />
                )
              }
            </FormRow>
            <FormRow>
              {
                getFieldDecorator(
                  PRINT_PANEL_KEYS.INDICATOR_THIRD_ROW, {
                    initialValue: requisites.indiThird,
                  },
                )(
                  <Input
                    onChange={setRequisitesFunc.INDICATOR_THIRD_ROW}
                  />
                )
              }
            </FormRow>
          </div>
          <Row className='printPanel_legend'>
            <Col span={18}>
              <h5>{i18n.LEGEND}</h5>
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
                {i18n.SIGN}
              </Col>
              <Col span={18}>
                {i18n.SIGN_CONTENT}
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
                {
                  getFieldDecorator(
                    PRINT_PANEL_KEYS.LEGEND_FIRST_CONTENT, {
                      initialValue: requisites.legendFirstContent,
                    },
                  )(
                    <Input
                      onChange={setRequisitesFunc.LEGEND_FIRST_CONTENT}
                    />
                  )
                }
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
                {
                  getFieldDecorator(
                    PRINT_PANEL_KEYS.LEGEND_SECOND_CONTENT, {
                      initialValue: requisites.legendSecondContent,
                    },
                  )(
                    <Input
                      onChange={setRequisitesFunc.LEGEND_SECOND_CONTENT}
                    />
                  )
                }
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
                {
                  getFieldDecorator(
                    PRINT_PANEL_KEYS.LEGEND_THIRD_CONTENT, {
                      initialValue: requisites.legendThirdContent,
                    },
                  )(
                    <Input
                      onChange={setRequisitesFunc.LEGEND_THIRD_CONTENT}
                    />
                  )
                }
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
                {
                  getFieldDecorator(
                    PRINT_PANEL_KEYS.LEGEND_FOURTH_CONTENT, {
                      initialValue: requisites.legendFourthContent,
                    },
                  )(
                    <Input
                      onChange={setRequisitesFunc.LEGEND_FOURTH_CONTENT}
                    />
                  )
                }
              </Col>
            </Row>
          </div>
          <h5>{i18n.DOCUMENT_SIGNATORIES}</h5>
          <div className='printPanel_signatories'>
            <Row className='printPanelSignatoriesTitle_row'>
              <Col span={10}>
                {i18n.POSITION}
              </Col>
              <Col span={6}>
                {i18n.RANG}
              </Col>
              <Col span={8}>
                {i18n.FULL_NAME}
              </Col>
            </Row>
            {console.log(signatories)}
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
          <FormRow className='printPanel_confirmDate' label={i18n.CONFIRM_DATE}>
            {
              getFieldDecorator(
                PRINT_PANEL_KEYS.CONFIRM_DATE, {
                  initialValue: approver.date,
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
              <ButtonSave onClick={this.createPrintFile}/>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

const WrappedPrintPanel = Form.create()(PrintPanel)

export default WrappedPrintPanel
