import React from 'react'
import PropTypes from 'prop-types'
import { Checkbox, Collapse, Select } from 'antd'
import { components, utils } from '@DZVIN/CommonComponents'
import FocusTrap from 'react-focus-lock'
import { HotKeysContainer, HotKey } from '../common/HotKeys'
import i18n from '../../i18n'
import ModalContainer from '../common/ModalContainer'
import ScaleControl from '../common/ScaleControl'
import { SubordinationLevel, paramsNames, SCALES, shortcuts } from '../../constants'

import './style.css'
const { names: iconNames, IconButton } = components.icons

const {
  form: { default: Form, FormRow, FormDarkPart },
  icons: { Icon },
} = components

const { Coordinates: Coord } = utils

const { Option } = Select

const formatScale = (scale) => `1 : ${scale.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}`

export default class SettingsForm extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    wrapper: PropTypes.oneOf([ ModalContainer ]),
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
      <ScaleControl name={paramName} value={Number(value)} onChange={onChangeParam}/>
    )
  }

  renderLevelControl (paramName) {
    const { params: { [paramName]: value } } = this.props

    return (
      <>
      <Select value={+value} onChange={this.changeParamOption(paramName)} showArrow={false} className="select-level">
        {SubordinationLevel.list.map(({ value, title, icon }) => (
          <Option key={value} value={value}>
            <div className="flex-level">
              <Icon className="icon-level" icon={icon} /> <span className="text-level">{title}</span>
            </div>
          </Option>
        ))}
      </Select>
      <div className="moreButtonSettins">
        <IconButton
          icon={iconNames.MORE_WHITE_DEFAULT}
        />
      </div>
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

    return (
      <Wrapper
        title={i18n.SETTINGS}
        onClose={onClose}
        defaultPosition={{ x: window.screen.width * 0.5, y: window.screen.height * 0.05 }}
      >
        <FocusTrap>
          <HotKeysContainer>
            <Form className="settings-form-group settings--form">
              <div className="settings-form-system">
                <div className="coordinateContainer">
                  <FormRow label={i18n.DEFAULT_COORDINATES_SYSTEM}>
                    <Select value={coordinatesType} showArrow={false} onChange={onChangeCoordinatesType} >
                      {Object.keys(Coord.types).map((key) => (
                        <Option key={key} value={Coord.types[key]}>{Coord.names[Coord.types[key]]}</Option>
                      ))}
                    </Select>
                    <div className="moreButtonSettins">
                      <IconButton
                        icon={iconNames.MORE_WHITE_DEFAULT}
                      />
                    </div>
                  </FormRow>
                </div>

                <div className="checkedContainer">
                  <FormRow label={i18n.MINIMAP}>
                    <Checkbox checked={showMiniMap} onChange={onChangeShowMiniMap}/>
                  </FormRow>
                  <FormRow label={i18n.AMPLIFIERS}>
                    <Checkbox checked={showAmplifiers} onChange={onChangeShowAmplifier}/>
                  </FormRow>
                </div>
              </div>

              <Collapse accordion>
                <Collapse.Panel header={i18n.ELEMENT_SIZES} key={1}>
                  <div className="pointTitle">{i18n.POINT_SIGN_SIZE_TITLE}</div>
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
                    <FormRow label={i18n.WAVE_SIGN_SIZE}/>
                    <FormDarkPart>
                      <FormRow>{this.renderScaleControl(paramsNames.WAVE_SIZE_MIN)}</FormRow>
                      <FormRow>{this.renderScaleControl(paramsNames.WAVE_SIZE_MAX)}</FormRow>
                    </FormDarkPart>
                  </div>

                  <div className="containerSign">
                    <FormRow label={i18n.STROKE_SIGN_SIZE}/>
                    <FormDarkPart>
                      <FormRow>{this.renderScaleControl(paramsNames.STROKE_SIZE_MIN)}</FormRow>
                      <FormRow>{this.renderScaleControl(paramsNames.STROKE_SIZE_MAX)}</FormRow>
                    </FormDarkPart>
                  </div>
                </Collapse.Panel>
                <Collapse.Panel header={i18n.ELEMENT_SCALES} key={2}>
                  <div className="containerScales">
                    {SCALES.map((scale) => (
                    <>
                    <div className="containerForm">
                      <FormRow key={scale} label={formatScale(scale)}>
                        {this.renderLevelControl(`${paramsNames.SCALE_VIEW_LEVEL}_${scale}`)}
                      </FormRow>
                    </div>
                    </>
                    ))}
                  </div>
                </Collapse.Panel>
              </Collapse>
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
