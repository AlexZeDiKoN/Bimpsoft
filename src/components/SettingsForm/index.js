import React from 'react'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import { Form, Select, Switch } from 'antd'
import i18n from '../../i18n'
import { CoordinatesTypes } from '../../constants'
import './style.css'
const { common: { MovablePanel } } = components
const FormItem = Form.Item
const Option = Select.Option

export default class SettingsForm extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    wrapper: PropTypes.instanceOf(MovablePanel),
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

    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    }

    return (
      <Wrapper title={i18n.SETTINGS} onClose={onClose}>
        <Form layout="horizontal">
          <FormItem label={i18n.DEFAULT_COORDINATES_SYSTEM} {...formItemLayout}>
            <Select value={coordinatesType} onChange={onChangeCoordinatesType} >
              <Option value={CoordinatesTypes.WGS_84}>{i18n.WGS_84}</Option>
              <Option value={CoordinatesTypes.USK_2000}>{i18n.USK_2000}</Option>
              <Option value={CoordinatesTypes.MGRS}>{i18n.MGRS}</Option>
            </Select>
          </FormItem>
          <FormItem label={i18n.MINIMAP} {...formItemLayout}>
            <Switch checked={showMiniMap} onChange={onChangeShowMiniMap}/>
          </FormItem>
          <FormItem label={i18n.AMPLIFIERS} {...formItemLayout}>
            <Switch checked={showAmplifiers} onChange={onChangeShowAmplifier}/>
          </FormItem>
          <FormItem label={i18n.GENERALIZATION} {...formItemLayout}>
            <Switch checked={generalization} onChange={onChangeGeneralization}/>
          </FormItem>
        </Form>
      </Wrapper>
    )
  }
}
