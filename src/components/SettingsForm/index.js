import React from 'react'
import PropTypes from 'prop-types'
import { Switch } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../i18n'
import './style.css'
import ModalContainer from '../common/ModalContainer'
import ScaleControl from '../common/ScaleControl'
import { paramsNames } from '../../constants'

const { default: Form, FormRow, FormDarkPart, FormDivider } = components.form

export default class SettingsForm extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    wrapper: PropTypes.oneOf([ ModalContainer ]),
    coordinatesType: PropTypes.string,
    showMiniMap: PropTypes.bool,
    params: PropTypes.object,
    showAmplifiers: PropTypes.bool,
    generalization: PropTypes.bool,
    onChangeCoordinatesType: PropTypes.func,
    onChangeShowMiniMap: PropTypes.func,
    onChangeShowAmplifier: PropTypes.func,
    onChangeGeneralization: PropTypes.func,
    onChangeParam: PropTypes.func,
    onClose: PropTypes.func,
  }

  changeParamHandler = (name, value) => {
    this.props.onChangeParam(name, value)
  }

  renderScaleControl (paramName) {
    return (<ScaleControl name={paramName} value={this.props.params[paramName] } onChange={this.changeParamHandler}/>)
  }

  render () {
    if (!this.props.visible) {
      return null
    }
    const {
      wrapper: Wrapper,
      // coordinatesType = CoordinatesTypes.WGS_84,
      showMiniMap,
      showAmplifiers,
      // generalization,
      onClose,
      // onChangeCoordinatesType,
      onChangeShowMiniMap,
      onChangeShowAmplifier,
      // onChangeGeneralization,
    } = this.props

    return (
      <Wrapper title={i18n.SETTINGS} onClose={onClose}>
        <Form className="settings-form-group">
          {/* <FormRow label={i18n.DEFAULT_COORDINATES_SYSTEM}> */}
          {/* <Select value={coordinatesType} onChange={onChangeCoordinatesType} > */}
          {/* <Option value={CoordinatesTypes.WGS_84}>{i18n.WGS_84}</Option> */}
          {/* <Option value={CoordinatesTypes.USK_2000}>{i18n.USK_2000}</Option> */}
          {/* <Option value={CoordinatesTypes.MGRS}>{i18n.MGRS}</Option> */}
          {/* </Select> */}
          {/* </FormRow> */}
          <FormRow label={i18n.MINIMAP}>
            <Switch checked={showMiniMap} onChange={onChangeShowMiniMap}/>
          </FormRow>
          <FormRow label={i18n.AMPLIFIERS}>
            <Switch checked={showAmplifiers} onChange={onChangeShowAmplifier}/>
          </FormRow>
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
          {/* <FormRow label={i18n.GENERALIZATION}> */}
          {/* <Switch checked={generalization} onChange={onChangeGeneralization}/> */}
          {/* </FormRow> */}
        </Form>
      </Wrapper>
    )
  }
}
