import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Slider } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../i18n'
import './style.css'
import ModalContainer from '../common/ModalContainer'

const { default: Form, FormRow, FormColumn } = components.form

export default class SettingsForm extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    wrapper: PropTypes.oneOf([ ModalContainer ]),
    coordinatesType: PropTypes.string,
    showMiniMap: PropTypes.bool,
    pointSizes: PropTypes.shape({
      min: PropTypes.number,
      max: PropTypes.number,
    }),
    showAmplifiers: PropTypes.bool,
    generalization: PropTypes.bool,
    onChangeCoordinatesType: PropTypes.func,
    onChangeShowMiniMap: PropTypes.func,
    onChangeShowAmplifier: PropTypes.func,
    onChangeGeneralization: PropTypes.func,
    onChangePointSizes: PropTypes.func,
    onClose: PropTypes.func,
  }

  changePointSizeHandler = (value) => {
    const [ min, max ] = value
    this.props.onChangePointSizes(min, max)
  }

  render () {
    if (!this.props.visible) {
      return null
    }
    const {
      wrapper: Wrapper,
      // coordinatesType = CoordinatesTypes.WGS_84,
      showMiniMap,
      pointSizes: { min, max },
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
          <FormColumn label={i18n.POINT_SIGN_SIZE}>
            <Slider range step={1} value={[ min, max ]} onChange={this.changePointSizeHandler} />
          </FormColumn>
          {/* <FormRow label={i18n.GENERALIZATION}> */}
          {/* <Switch checked={generalization} onChange={onChangeGeneralization}/> */}
          {/* </FormRow> */}
        </Form>
      </Wrapper>
    )
  }
}
