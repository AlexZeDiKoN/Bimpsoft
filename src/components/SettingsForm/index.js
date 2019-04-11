import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Collapse, Select } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import FocusTrap from 'react-focus-lock'
import { HotKeysContainer, HotKey } from '../common/HotKeys'
import i18n from '../../i18n'
import ModalContainer from '../common/ModalContainer'
import ScaleControl from '../common/ScaleControl'
import { CoordinatesTypes, SubordinationLevel, paramsNames, SCALES, shortcuts } from '../../constants'

import './style.css'

const { form: { default: Form, FormRow, FormDarkPart }, icons: { Icon } } = components
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
      <Select value={+value} onChange={this.changeParamOption(paramName)} className="select-level">
        {SubordinationLevel.list.map(({ value, title, icon }) => (
          <Option key={value} value={value}>
            <div className="flex-level">
              <Icon className="icon-level" icon={icon} /> <span className="text-level">{title}</span>
            </div>
          </Option>
        ))}
      </Select>
    )
  }

  render () {
    if (!this.props.visible) {
      return null
    }
    const {
      wrapper: Wrapper,
      coordinatesType = CoordinatesTypes.WGS_84,
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
              <FormRow label={i18n.DEFAULT_COORDINATES_SYSTEM}>
                <Select value={coordinatesType} onChange={onChangeCoordinatesType} >
                  {Object.keys(CoordinatesTypes).map((key) => (
                    <Option key={key} value={CoordinatesTypes[key]}>{i18n[key]}</Option>
                  ))}
                </Select>
              </FormRow>
              <FormRow label={i18n.MINIMAP}>
                <Switch checked={showMiniMap} onChange={onChangeShowMiniMap}/>
              </FormRow>
              <FormRow label={i18n.AMPLIFIERS}>
                <Switch checked={showAmplifiers} onChange={onChangeShowAmplifier}/>
              </FormRow>

              <Collapse accordion>
                <Collapse.Panel header={i18n.ELEMENT_SIZES} key={1}>
                  <FormRow label={i18n.POINT_SIGN_SIZE}/>
                  <FormDarkPart>
                    <FormRow label={i18n.MIN_ZOOM}>{this.renderScaleControl(paramsNames.POINT_SIZE_MIN)}</FormRow>
                    <FormRow label={i18n.MAX_ZOOM}>{this.renderScaleControl(paramsNames.POINT_SIZE_MAX)}</FormRow>
                  </FormDarkPart>
                  <FormRow label={i18n.TEXT_SIGN_SIZE}/>
                  <FormDarkPart>
                    <FormRow label={i18n.MIN_ZOOM}>{this.renderScaleControl(paramsNames.TEXT_SIZE_MIN)}</FormRow>
                    <FormRow label={i18n.MAX_ZOOM}>{this.renderScaleControl(paramsNames.TEXT_SIZE_MAX)}</FormRow>
                  </FormDarkPart>
                  <FormRow label={i18n.LINE_SIGN_SIZE}/>
                  <FormDarkPart>
                    <FormRow label={i18n.MIN_ZOOM}>{this.renderScaleControl(paramsNames.LINE_SIZE_MIN)}</FormRow>
                    <FormRow label={i18n.MAX_ZOOM}>{this.renderScaleControl(paramsNames.LINE_SIZE_MAX)}</FormRow>
                  </FormDarkPart>
                </Collapse.Panel>
                <Collapse.Panel header={i18n.ELEMENT_SCALES} key={2}>
                  {SCALES.map((scale) => (
                    <FormRow key={scale} label={formatScale(scale)}>
                      {this.renderLevelControl(`${paramsNames.SCALE_VIEW_LEVEL}_${scale}`)}
                    </FormRow>
                  ))}
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
