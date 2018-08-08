import React from 'react'
import PropTypes from 'prop-types'
import { Select, Switch } from 'antd'
import i18n from '../../i18n'
import { CoordinatesTypes } from '../../constants'
import { default as Form, FormRow } from '../form'
import './style.css'
import ModalContainer from '../common/ModalContainer'
const Option = Select.Option

export default class SettingsForm extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    wrapper: PropTypes.oneOf([ ModalContainer ]),
    coordinatesType: PropTypes.string,
    showMiniMap: PropTypes.bool,
    showAmplifiers: PropTypes.bool,
    generalization: PropTypes.bool,
    onChangeCoordinatesType: PropTypes.func,
    onChangeShowMiniMap: PropTypes.func,
    onChangeShowAmplifier: PropTypes.func,
    onChangeGeneralization: PropTypes.func,
    onClose: PropTypes.func,
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
      generalization,
      onClose,
      onChangeCoordinatesType,
      onChangeShowMiniMap,
      onChangeShowAmplifier,
      onChangeGeneralization,
    } = this.props

    return (
      <Wrapper title={i18n.SETTINGS} onClose={onClose}>
        <Form className="settings-form-group">
          <FormRow label={i18n.DEFAULT_COORDINATES_SYSTEM}>
            <Select value={coordinatesType} onChange={onChangeCoordinatesType} >
              <Option value={CoordinatesTypes.WGS_84}>{i18n.WGS_84}</Option>
              <Option value={CoordinatesTypes.USK_2000}>{i18n.USK_2000}</Option>
              <Option value={CoordinatesTypes.MGRS}>{i18n.MGRS}</Option>
            </Select>
          </FormRow>
          <FormRow label={i18n.MINIMAP}>
            <Switch checked={showMiniMap} onChange={onChangeShowMiniMap}/>
          </FormRow>
          <FormRow label={i18n.AMPLIFIERS}>
            <Switch checked={showAmplifiers} onChange={onChangeShowAmplifier}/>
          </FormRow>
          <FormRow label={i18n.GENERALIZATION}>
            <Switch checked={generalization} onChange={onChangeGeneralization}/>
          </FormRow>
        </Form>
      </Wrapper>
    )
  }
}
