import React from 'react'
import PropTypes from 'prop-types'
import { Checkbox, Tabs, Select } from 'antd'
import { components, utils, MovablePanel } from '@C4/CommonComponents'
import FocusTrap from 'react-focus-lock'
import { HotKeysContainer, HotKey } from '../common/HotKeys'
import i18n from '../../i18n'
import ScaleControl from '../common/ScaleControl'
import { SubordinationLevel, paramsNames, SCALES, shortcuts } from '../../constants'

import './style.css'

const {
  form: { default: Form, FormRow, FormDarkPart },
  icons: { Icon },
} = components

const { Coordinates: Coord } = utils

const { Option } = Select

const SIZE_SETTING_MODAL = 580

const formatScale = (scale) => `1 : ${scale.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}`

export default class SettingsForm extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    wrapper: PropTypes.oneOf([ MovablePanel ]),
    coordinatesType: PropTypes.string,
    showMiniMap: PropTypes.bool,
    params: PropTypes.object,
    showAmplifiers: PropTypes.bool,
    // generalization: PropTypes.bool,
    onChangeCoordinatesType: PropTypes.func,
    onChangeShowMiniMap: PropTypes.func,
    onChangeShowAmplifier: PropTypes.func,
    onChangeGeneralization: PropTypes.func,
    onChangeParam: PropTypes.func,
    onClose: PropTypes.func,
  }

  changeParamOption = (name) => (value) => {
    const { onChangeParam } = this.props

    onChangeParam(name, value)
  }

  renderScaleControl (paramName) {
    const { params: { [paramName]: value }, onChangeParam } = this.props

    return (
      <ScaleControl name={paramName} value={Number(value)} step={1} onChange={onChangeParam}/>
    )
  }

  renderLevelControl (paramName) {
    const { params: { [paramName]: value } } = this.props

    return (
      <>
        <Select value={+value} onChange={this.changeParamOption(paramName)} className="select-level">
          {SubordinationLevel.list.map(({ value, title, icon }) => (
            <Option key={value} value={value}>
              <div className="flex-level">
                <Icon className="icon-level" icon={icon} /> <span className="text-level">{title}</span>
              </div>
            </Option>
          ))}
        </Select>
      </>
    )
  }

  render () {
    if (!this.props.visible) {
      return null
    }
    const {
      wrapper: Wrapper,
      coordinatesType = Coord.types.WGS_84,
      showMiniMap,
      showAmplifiers,
      // generalization,
      onClose,
      onChangeCoordinatesType,
      onChangeShowMiniMap,
      onChangeShowAmplifier,
      // onChangeGeneralization,
    } = this.props

    const clientWidth = document?.documentElement?.clientWidth

    return (
      <Wrapper
        title={i18n.SETTINGS}
        onClose={onClose}
        minWidth={SIZE_SETTING_MODAL}
        maxWidth={SIZE_SETTING_MODAL}
        minHeight={SIZE_SETTING_MODAL}
        maxHeight={SIZE_SETTING_MODAL}
        defaultPosition={{ x: clientWidth - SIZE_SETTING_MODAL - 40, y: 40 }}
      >
        <FocusTrap>
          <HotKeysContainer>
            <Form className="settings-form-group settings--form">
              <div className="settings-form-system">
                <div className="coordinateContainer">
                  <FormRow label={i18n.DEFAULT_COORDINATES_SYSTEM}>
                    <Select value={coordinatesType} onChange={onChangeCoordinatesType} >
                      {Object.keys(Coord.types).map((key) => (
                        <Option key={key} value={Coord.types[key]}>{Coord.names[Coord.types[key]]}</Option>
                      ))}
                    </Select>
                  </FormRow>
                </div>

                <div className="checkedContainer">
                  <FormRow label={i18n.MINIMAP}>
                    <Checkbox checked={showMiniMap} onChange={onChangeShowMiniMap}/>
                  </FormRow>
                  <FormRow label={i18n.AMPLIFIERS_POINT_SYMBOL}>
                    <Checkbox checked={showAmplifiers} onChange={onChangeShowAmplifier}/>
                  </FormRow>
                </div>
              </div>

              <Tabs>
                <Tabs.TabPane tab={i18n.ELEMENT_SIZES} key={1}>
                  <div className="pointTitle">
                    <div>{i18n.POINT_SIGN_SIZE_MIN}</div>
                    <div>{i18n.POINT_SIGN_SIZE_MAX}</div>
                  </div>
                  <div className="containerSign">
                    <FormRow label={i18n.POINT_SIGN_SIZE}/>
                    <FormDarkPart>
                      <FormRow>{this.renderScaleControl(paramsNames.POINT_SIZE_MIN)}</FormRow>
                      <FormRow>{this.renderScaleControl(paramsNames.POINT_SIZE_MAX)}</FormRow>
                    </FormDarkPart>
                  </div>

                  <div className="containerSign">
                    <FormRow label={i18n.TEXT_SIGN_SIZE}/>
                    <FormDarkPart>
                      <FormRow>{this.renderScaleControl(paramsNames.TEXT_SIZE_MIN)}</FormRow>
                      <FormRow>{this.renderScaleControl(paramsNames.TEXT_SIZE_MAX)}</FormRow>
                    </FormDarkPart>
                  </div>

                  <div className="containerSign">
                    <FormRow label={i18n.LINE_SIGN_SIZE}/>
                    <FormDarkPart>
                      <FormRow>{this.renderScaleControl(paramsNames.LINE_SIZE_MIN)}</FormRow>
                      <FormRow>{this.renderScaleControl(paramsNames.LINE_SIZE_MAX)}</FormRow>
                    </FormDarkPart>
                  </div>

                  <div className="containerSign">
                    <FormRow label={i18n.NODE_SIGN_SIZE}/>
                    <FormDarkPart>
                      <FormRow>{this.renderScaleControl(paramsNames.NODE_SIZE_MIN)}</FormRow>
                      <FormRow>{this.renderScaleControl(paramsNames.NODE_SIZE_MAX)}</FormRow>
                    </FormDarkPart>
                  </div>

                  <div className="containerSign">
                    <FormRow label={i18n.TEXT_AMPLIFIER_SIGN_SIZE}/>
                    <FormDarkPart>
                      <FormRow>{this.renderScaleControl(paramsNames.TEXT_AMPLIFIER_SIZE_MIN)}</FormRow>
                      <FormRow>{this.renderScaleControl(paramsNames.TEXT_AMPLIFIER_SIZE_MAX)}</FormRow>
                    </FormDarkPart>
                  </div>

                  <div className="containerSign">
                    <FormRow label={i18n.GRAPHIC_AMPLIFIER_SIGN_SIZE}/>
                    <FormDarkPart>
                      <FormRow>{this.renderScaleControl(paramsNames.GRAPHIC_AMPLIFIER_SIZE_MIN)}</FormRow>
                      <FormRow>{this.renderScaleControl(paramsNames.GRAPHIC_AMPLIFIER_SIZE_MAX)}</FormRow>
                    </FormDarkPart>
                  </div>

                  <div className="containerSign">
                    <FormRow label={i18n.WAVE_SIGN_SIZE}/>
                    <FormDarkPart>
                      <FormRow>{this.renderScaleControl(paramsNames.WAVE_SIZE_MIN)}</FormRow>
                      <FormRow>{this.renderScaleControl(paramsNames.WAVE_SIZE_MAX)}</FormRow>
                    </FormDarkPart>
                  </div>

                  <div className="containerSign">
                    <FormRow label={i18n.BLOCKAGE_SIGN_SIZE}/>
                    <FormDarkPart>
                      <FormRow>{this.renderScaleControl(paramsNames.BLOCKAGE_SIZE_MIN)}</FormRow>
                      <FormRow>{this.renderScaleControl(paramsNames.BLOCKAGE_SIZE_MAX)}</FormRow>
                    </FormDarkPart>
                  </div>

                  <div className="containerSign">
                    <FormRow label={i18n.MOAT_SIGN_SIZE}/>
                    <FormDarkPart>
                      <FormRow>{this.renderScaleControl(paramsNames.MOAT_SIZE_MIN)}</FormRow>
                      <FormRow>{this.renderScaleControl(paramsNames.MOAT_SIZE_MAX)}</FormRow>
                    </FormDarkPart>
                  </div>

                  <div className="containerSign">
                    <FormRow label={i18n.ROW_MINE_SIGN_SIZE}/>
                    <FormDarkPart>
                      <FormRow>{this.renderScaleControl(paramsNames.ROW_MINE_SIZE_MIN)}</FormRow>
                      <FormRow>{this.renderScaleControl(paramsNames.ROW_MINE_SIZE_MAX)}</FormRow>
                    </FormDarkPart>
                  </div>

                  <div className="containerSign">
                    <FormRow label={i18n.STROKE_SIGN_SIZE}/>
                    <FormDarkPart>
                      <FormRow>{this.renderScaleControl(paramsNames.STROKE_SIZE_MIN)}</FormRow>
                      <FormRow>{this.renderScaleControl(paramsNames.STROKE_SIZE_MAX)}</FormRow>
                    </FormDarkPart>
                  </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab={i18n.ELEMENT_SCALES} key={2}>
                  <div className="containerScales">
                    {SCALES.map((scale) => (
                      <div key={scale} className="containerForm">
                        <FormRow label={formatScale(scale)}>
                          {this.renderLevelControl(`${paramsNames.SCALE_VIEW_LEVEL}_${scale}`)}
                        </FormRow>
                      </div>
                    ))}
                  </div>
                </Tabs.TabPane>
              </Tabs>
              {/* <FormRow label={i18n.GENERALIZATION}> */}
              {/* <Switch checked={generalization} onChange={onChangeGeneralization}/> */}
              {/* </FormRow> */}
            </Form>
            <HotKey onKey={onClose} selector={shortcuts.ESC}/>
          </HotKeysContainer>
        </FocusTrap>
      </Wrapper>
    )
  }
}
