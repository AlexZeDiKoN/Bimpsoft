import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Select, Input, DatePicker, Checkbox } from 'antd'
import { components, ButtonTypes, IButton, IconNames } from '@DZVIN/CommonComponents'
import moment from 'moment'
import { ColorTypes } from '@DZVIN/CommonComponents/src/constants'
import ColorPicker from '../../common/ColorPicker'
import i18n from '../../../i18n'
import { Print } from '../../../constants'
import './style.css'
import { DATE_TIME_FORMAT_SIGNATURE } from '../../../constants/formats'

const { TextArea } = Input

const COLOR_PICKER_Z_INDEX = 2000

class PrintPanel extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    setPrintScale: PropTypes.func,
    printScale: PropTypes.number,
    docConfirm: PropTypes.object,
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
      saveButtonEnabled: true,
      start: props.requisites.start,
      finish: props.requisites.finish,
    }
  }

  async componentDidMount () {
    await this.createSetFunctions()
    this.formatApprovers()
    this.addConstParameters()
  }

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    const { requisites, setPrintRequisites } = nextProps
    if (!requisites.legendAvailable && requisites.legendEnabled) {
      const { LEGEND_ENABLED } = Print.PRINT_PANEL_KEYS
      setPrintRequisites({ [LEGEND_ENABLED]: false })
      return false
    }
    if (!requisites.dpiAvailable.includes(requisites.dpi)) {
      const { setFieldsValue } = this.props.form
      const { DPI } = Print.PRINT_SELECTS_KEYS
      const dpi = requisites.dpiAvailable.slice(-1)[0]
      setPrintRequisites({ [DPI]: dpi })
      setFieldsValue({ [DPI]: dpi })
      return false
    }
    return true
  }

  createSetFunctions = () => {
    const { setPrintRequisites } = this.props
    const { PRINT_PANEL_KEYS, COLOR_PICKER_KEYS, PRINT_DATE_KEYS } = Print
    const Obj = Object.assign(
      Object.keys(PRINT_PANEL_KEYS)
        .reduce((prev, current) => (
          {
            ...prev,
            [current]: (e, dateString) => {
              let req
              if (PRINT_DATE_KEYS.includes(current)) {
                const { start, finish } = this.state
                const dates = { START: start, FINISH: finish, [current]: dateString }

                // swap dates
                // uncomment lines when remove disabledDate from DatePicker
                // if (dates.START && dates.FINISH &&
                //   moment(dates.START, DATE_FORMAT) > moment(dates.FINISH, DATE_FORMAT)) {
                //   [ dates.START, dates.FINISH ] = [ dates.FINISH, dates.START ]
                // }

                req = PRINT_DATE_KEYS.reduce(
                  (obj, key) => ({ ...obj, [PRINT_PANEL_KEYS[key]]: dates[key] }), {},
                )
                this.setState(req)
              } else {
                req = { [PRINT_PANEL_KEYS[current]]: e && e.target ? e.target.value || e.target.checked : null }
              }
              setPrintRequisites(req)
            },
          }
        ), {}),
      Object.keys(COLOR_PICKER_KEYS)
        .reduce((prev, current) => ({
          ...prev,
          [current]: (color) => {
            setPrintRequisites({ [COLOR_PICKER_KEYS[current]]: color })
            this.setState((prevState) => ({
              colors: {
                ...prevState.colors,
                [COLOR_PICKER_KEYS[current]]: color,
              },
            }))
          },
        }), {}),
    )
    this.setState({ setRequisitesFunc: Obj })
  }

  formatApprovers = () => {
    const {
      approversData,
      docConfirm: { signers },
      setPrintRequisites,
    } = this.props

    const {
      PRINT_SIGNATORIES: { SIGNATORIES },
    } = Print

    if (!signers) {
      return setPrintRequisites({
        [SIGNATORIES]: [],
      })
    }

    const signatories = signers.map((signer) => {
      const {
        who,
        date,
        status,
      } = signer

      if (status !== 'accepted') {
        return null
      }

      const {
        name,
        surname,
        position,
        role,
      } = approversData
        .filter((item) => Number(item.id) === who)[0] || {}

      return {
        position,
        role,
        name: this.formatContactName(surname, name),
        date,
      }
    })
      .filter(Boolean)
      .sort((a, b) => new Date(a.date) - new Date(b.date))

    setPrintRequisites({
      [SIGNATORIES]: signatories,
    })
  }

  formatContactName = (surname, name) => {
    let result = surname
    if (name) {
      result = `${name} ${result}`
    }
    return result
  }

  addConstParameters = () => {
    const {
      securityClassification: { classified },
      docConfirm: { signers },
      setPrintRequisites,
    } = this.props

    const date = signers && Math.max.apply(null, signers.map((value) => new Date(value.date)))

    const {
      PRINT_PANEL_KEYS: { MAP_LABEL, CONFIRM_DATE },
      DATE_FORMAT,
    } = Print

    setPrintRequisites({
      [MAP_LABEL]: classified,
      [CONFIRM_DATE]: (date && isFinite(date)) ? moment(date).format(DATE_FORMAT) : '',
    })
  }

  setScale = (value) => {
    const { setPrintScale } = this.props
    setPrintScale(value)
  }

  setPrintParameters = (value, key) => {
    const { setPrintRequisites } = this.props
    setPrintRequisites({ [key]: value })
  }

  changeLegendTableType = (newType) => {
    const { legendTableType } = this.state
    const { setPrintRequisites } = this.props
    const { LEGEND_TABLE_TYPE } = Print.PRINT_PANEL_KEYS
    if (legendTableType !== newType) {
      this.setState(
        { legendTableType: newType },
        () => setPrintRequisites({ [LEGEND_TABLE_TYPE]: newType }),
      )
    }
  }

  cancelPrint = () => {
    const { print, clearPrintRequisites } = this.props
    print()
    clearPrintRequisites()
  }

  enableSaveButton = (enable = true) => {
    this.setState({ saveButtonEnabled: enable })
  }

  createPrintFile = () => {
    const { createPrintFile } = this.props
    this.setState(
      { saveButtonEnabled: false },
      () => { createPrintFile(this.enableSaveButton) },
    )
  }

  createSelectChildren = (incomeData) => incomeData
    .map((item) => <Select.Option key={item}>{item}</Select.Option>)

  disabledDate = (field) => (value) => {
    const { DATE_FORMAT } = Print
    const { start, finish } = this.state
    const dates = { start, finish, [field]: value }
    if (!dates.start || !dates.finish) {
      return false
    }
    return moment(dates.start, DATE_FORMAT) > moment(dates.finish, DATE_FORMAT)
  }

  render () {
    const {
      form: { getFieldDecorator },
      printScale,
      requisites,
      requisites: { legendEnabled },
    } = this.props
    const { setRequisitesFunc, colors, legendTableType, saveButtonEnabled, start, finish } = this.state
    const {
      PRINT_PANEL_KEYS, PRINT_SELECTS_KEYS, PRINT_SCALES,
      DATE_FORMAT, COLOR_PICKER_KEYS, PRINT_PROJECTION_GROUP,
    } = Print
    const { FormRow, ButtonCancel, ButtonSave } = components.form
    return (
      <div
        className='printPanelFormInner'
        style={legendEnabled ? { overflowY: 'auto' } : { overflowY: 'hidden' }}>
        <Form>
          <div className='print-scale-container'>
            <div>{i18n.SCALE_PRINT}</div>
            {
              getFieldDecorator(
                PRINT_SELECTS_KEYS.SCALE, {
                  initialValue: printScale,
                },
              )(
                <Select onChange={this.setScale}>
                  {this.createSelectChildren(PRINT_SCALES)}
                </Select>,
              )
            }
          </div>
          {/* TODO: наразі прихований блок. При відображені замінити на FormRow */}
          <div className='print-scale-container'>
            <div>{i18n.DPI}</div>
            {
              getFieldDecorator(
                PRINT_SELECTS_KEYS.DPI, {
                  initialValue: requisites.dpi,
                },
              )(
                <Select onChange={(value) => this.setPrintParameters(value, PRINT_SELECTS_KEYS.DPI)}>
                  {this.createSelectChildren(requisites.dpiAvailable)}
                </Select>,
              )
            }
          </div>
          {/* TODO: наразі прихований блок. При відображені замінити на FormRow */}
          <Row className='printPanel_coordinatesType invisible' label={i18n.COORDINATES_TYPE}>
            {
              getFieldDecorator(
                PRINT_SELECTS_KEYS.PROJECTION_GROUP, {
                  initialValue: requisites.coordinatesType,
                },
              )(
                <Select onChange={(value) => this.setPrintParameters(value, PRINT_SELECTS_KEYS.COORDINATES_TYPES)}>
                  {this.createSelectChildren(PRINT_PROJECTION_GROUP)}
                </Select>,
              )
            }
          </Row>
          <div className='print-requisites-container'>
            <div>{i18n.PRINT_REQUISITES}</div>
            <Checkbox
              checked={legendEnabled}
              onChange={setRequisitesFunc.LEGEND_ENABLED}
              disabled={!requisites.legendAvailable}
            />
          </div>
          <div style={legendEnabled ? { opacity: '1' } : { opacity: '0', pointerEvents: 'none' }}>
            <div className='docBlock_header'>{i18n.DOC_HEADER}</div>
            <div className='printPanel_docBlock'>
              {
                getFieldDecorator(
                  PRINT_PANEL_KEYS.FIRST_ROW, {
                    initialValue: requisites.firstRow,
                  },
                )(
                  <Input onChange={setRequisitesFunc.FIRST_ROW} disabled={!legendEnabled}/>,
                )
              }
            </div>
            <div className='docBlock_subHeader'>{i18n.DOC_HEADER_SUBTITLE}</div>
            <div className='printPanel_docBlock'>
              {
                getFieldDecorator(
                  PRINT_PANEL_KEYS.SECOND_ROW, {
                    initialValue: requisites.secondRow,
                  },
                )(
                  <Input onChange={setRequisitesFunc.SECOND_ROW} disabled={!legendEnabled}/>,
                )
              }
              {
                getFieldDecorator(
                  PRINT_PANEL_KEYS.THIRD_ROW, {
                    initialValue: requisites.thirdRow,
                  },
                )(
                  <Input onChange={setRequisitesFunc.THIRD_ROW} disabled={!legendEnabled}/>,
                )
              }
              {
                getFieldDecorator(
                  PRINT_PANEL_KEYS.FOURTH_ROW, {
                    initialValue: requisites.fourthRow,
                  },
                )(
                  <Input onChange={setRequisitesFunc.FOURTH_ROW} disabled={!legendEnabled}/>,
                )
              }
              {
                getFieldDecorator(
                  PRINT_PANEL_KEYS.FIFTH_ROW, {
                    initialValue: requisites.fifthRow,
                  },
                )(
                  <Input onChange={setRequisitesFunc.FIFTH_ROW} disabled={!legendEnabled}/>,
                )
              }
              <div className='printData'>
                <FormRow label={i18n.START}>
                  <DatePicker
                    format={DATE_FORMAT}
                    value={start ? moment(start, DATE_FORMAT) : null}
                    onChange={setRequisitesFunc.START}
                    disabled={!legendEnabled}
                    disabledDate={this.disabledDate('start')}
                  />
                </FormRow>
                <FormRow label={i18n.FINISH}>
                  <DatePicker
                    format={DATE_FORMAT}
                    value={finish ? moment(finish, DATE_FORMAT) : null}
                    onChange={setRequisitesFunc.FINISH}
                    disabled={!legendEnabled}
                    disabledDate={this.disabledDate('finish')}
                  />
                </FormRow>
              </div>
            </div>
            <div className='docBlock_header'>{i18n.MAIN_INDICATORS}</div>
            <div className='printPanel_docBlock'>
              {
                getFieldDecorator(
                  PRINT_PANEL_KEYS.INDICATOR_FIRST_ROW, {
                    initialValue: requisites.indiFirst,
                  },
                )(
                  <Input onChange={setRequisitesFunc.INDICATOR_FIRST_ROW} disabled={!legendEnabled}/>,
                )
              }
              {
                getFieldDecorator(
                  PRINT_PANEL_KEYS.INDICATOR_SECOND_ROW, {
                    initialValue: requisites.indiSecond,
                  },
                )(
                  <Input onChange={setRequisitesFunc.INDICATOR_SECOND_ROW} disabled={!legendEnabled}/>,
                )
              }
              {
                getFieldDecorator(
                  PRINT_PANEL_KEYS.INDICATOR_THIRD_ROW, {
                    initialValue: requisites.indiThird,
                  },
                )(
                  <Input onChange={setRequisitesFunc.INDICATOR_THIRD_ROW} disabled={!legendEnabled}/>,
                )
              }
            </div>
            <div className='printPanel_legend'>
              <div className='docBlock_subHeader'>{i18n.LEGEND}</div>
              <div
                className='printPanel_legendControl'
              >
                <IButton
                  icon={IconNames.DOCUMENT_BOTTOM_LEFT}
                  type={ButtonTypes.WITH_BG}
                  colorType={legendTableType === 'left' ? ColorTypes.DARK_GREEN : ColorTypes.NONE}
                  active={legendTableType === 'left'}
                  onClick={() => this.changeLegendTableType('left')}
                  disabled={!legendEnabled}
                />
                <IButton
                  icon={IconNames.DOCUMENT_BOTTOM_RIGHT}
                  type={ButtonTypes.WITH_BG}
                  colorType={legendTableType !== 'left' ? ColorTypes.DARK_GREEN : ColorTypes.NONE}
                  active={legendTableType !== 'left'}
                  onClick={() => this.changeLegendTableType('right')}
                  disabled={!legendEnabled}
                />
              </div>
            </div>
            <div className='printPanelSign_block'>
              <Row className='printPanelSign_row'>
                <Col span={3}>
                  <ColorPicker
                    color={colors[COLOR_PICKER_KEYS.LEGEND_FIRST_COLOR]}
                    className='PrintPanel_colorPicker'
                    onChange={setRequisitesFunc.LEGEND_FIRST_COLOR}
                    disabled={!legendEnabled}
                    zIndex={COLOR_PICKER_Z_INDEX}
                  />
                </Col>
                <Col span={21}>
                  {
                    getFieldDecorator(
                      PRINT_PANEL_KEYS.LEGEND_FIRST_CONTENT, {
                        initialValue: requisites.legendFirstContent,
                      },
                    )(
                      <Input onChange={setRequisitesFunc.LEGEND_FIRST_CONTENT} disabled={!legendEnabled}/>,
                    )
                  }
                </Col>
              </Row>
              <Row className='printPanelSign_row'>
                <Col span={3}>
                  <ColorPicker
                    color={colors[COLOR_PICKER_KEYS.LEGEND_SECOND_COLOR]}
                    className='PrintPanel_colorPicker'
                    onChange={setRequisitesFunc.LEGEND_SECOND_COLOR}
                    disabled={!legendEnabled}
                    zIndex={COLOR_PICKER_Z_INDEX}
                  />
                </Col>
                <Col span={21}>
                  {
                    getFieldDecorator(
                      PRINT_PANEL_KEYS.LEGEND_SECOND_CONTENT, {
                        initialValue: requisites.legendSecondContent,
                      },
                    )(
                      <Input onChange={setRequisitesFunc.LEGEND_SECOND_CONTENT} disabled={!legendEnabled}/>,
                    )
                  }
                </Col>
              </Row>
              <Row className='printPanelSign_row'>
                <Col span={3}>
                  <ColorPicker
                    color={colors[COLOR_PICKER_KEYS.LEGEND_THIRD_COLOR]}
                    className='PrintPanel_colorPicker'
                    onChange={setRequisitesFunc.LEGEND_THIRD_COLOR}
                    disabled={!legendEnabled}
                    zIndex={COLOR_PICKER_Z_INDEX}
                  />
                </Col>
                <Col span={21}>
                  {
                    getFieldDecorator(
                      PRINT_PANEL_KEYS.LEGEND_THIRD_CONTENT, {
                        initialValue: requisites.legendThirdContent,
                      },
                    )(
                      <Input onChange={setRequisitesFunc.LEGEND_THIRD_CONTENT} disabled={!legendEnabled}/>,
                    )
                  }
                </Col>
              </Row>
              <Row className='printPanelSign_row'>
                <Col span={3}>
                  <ColorPicker
                    color={colors[COLOR_PICKER_KEYS.LEGEND_FOURTH_COLOR]}
                    className='PrintPanel_colorPicker'
                    onChange={setRequisitesFunc.LEGEND_FOURTH_COLOR}
                    disabled={!legendEnabled}
                    zIndex={COLOR_PICKER_Z_INDEX}
                  />
                </Col>
                <Col span={21}>
                  {
                    getFieldDecorator(
                      PRINT_PANEL_KEYS.LEGEND_FOURTH_CONTENT, {
                        initialValue: requisites.legendFourthContent,
                      },
                    )(
                      <Input onChange={setRequisitesFunc.LEGEND_FOURTH_CONTENT} disabled={!legendEnabled}/>,
                    )
                  }
                </Col>
              </Row>
            </div>
            <div className='docBlock_header'>{i18n.DOCUMENT_SIGNATORIES}</div>
            <div className='printPanel_signatories'>
              {requisites?.signatories?.map((rowData) => {
                const { position, role, name, date } = rowData
                const dateText = date && !!date.length ? moment(date).format(DATE_TIME_FORMAT_SIGNATURE) : null
                return (
                  <TextArea key={date} rows={5} disabled value={`${position} ${role} ${name} ${dateText}`}/>
                )
              })}
            </div>
          </div>

          <Row className='printPanel_buttonBlock'>
            <Col span={12}>
              <ButtonCancel onClick={this.cancelPrint} />
            </Col>
            <Col span={12}>
              <ButtonSave onClick={this.createPrintFile} disabled={!saveButtonEnabled}/>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

const WrappedPrintPanel = Form.create()(PrintPanel)

export default WrappedPrintPanel
