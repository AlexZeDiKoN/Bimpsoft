import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import i18n from '../../i18n'
import * as symbolOptions from '../../model/symbolOptions'

export default class AmplifiersForm extends React.Component {
  changeAmplifier = (e) => {
    const { target: { value, name } } = e
    const { amplifiers } = this.props
    this.props.onChange({ ...amplifiers, [name]: value })
  }

  render () {
    const { amplifiers = { engagementType: 'TARGET' } } = this.props

    const getInputProps = (name) => ({ name, value: amplifiers[name] || '', onChange: this.changeAmplifier })

    return (
      <div className="amplifiers-form" >
        <InputControl
          label={i18n.AMPLIFIER_SPECIAL_HEADQUARTERS}
          { ...getInputProps(symbolOptions.specialHeadquarters)}
        />
        <InputControl
          label={i18n.AMPLIFIER_HEADQUARTERS_ELEMENT}
          { ...getInputProps(symbolOptions.headquartersElement)}
        />
        <InputControl
          label={i18n.AMPLIFIER_ENGAGEMENT_BAR}
          { ...getInputProps(symbolOptions.engagementBar)}
        />
        <InputControl
          label={i18n.AMPLIFIER_QUANTITY}
          { ...getInputProps(symbolOptions.quantity)}
        />
        <div className="amplifiers-form-control-group">
          <InputControl
            label={i18n.AMPLIFIER_SPECIAL_DESIGNATOR}
            { ...getInputProps(symbolOptions.specialDesignator)}
          />
          <InputControl
            label={i18n.AMPLIFIER_DTG}
            { ...getInputProps(symbolOptions.dtg)}
          />
        </div>
        <InputControl
          label={i18n.AMPLIFIER_REINFORCED_REDUCED}
          { ...getInputProps(symbolOptions.reinforcedReduced)}
        />
        <div className="amplifiers-form-control-group">
          <InputControl
            label={i18n.AMPLIFIER_WEAPONS_TYPE}
            { ...getInputProps(symbolOptions.type)}
          />
          <InputControl
            label={i18n.AMPLIFIER_PLATFORM_TYPE}
            { ...getInputProps(symbolOptions.platformType)}
          />
          <InputControl
            label={i18n.AMPLIFIER_TIME_OF_DISMANTLING}
            { ...getInputProps(symbolOptions.equipmentTeardownTime)}
          />
        </div>
        <InputControl
          label={i18n.AMPLIFIER_STAFF_COMMENTS}
          { ...getInputProps(symbolOptions.staffComments)}
        />
        <InputControl
          label={i18n.AMPLIFIER_UNIQUE_DESIGNATION}
          { ...getInputProps(symbolOptions.uniqueDesignation)}
        />
        <div className="amplifiers-form-control-group">
          <InputControl
            label={i18n.AMPLIFIER_ADDITIONAL_INFORMATION}
            { ...getInputProps(symbolOptions.additionalInformation)}
          />
          <InputControl
            label={i18n.AMPLIFIER_GENERAL_IDENTIFIER}
            { ...getInputProps(symbolOptions.commonIdentifier)}
          />
        </div>
        <div className="amplifiers-form-control-group">
          <InputControl
            label={i18n.AMPLIFIER_DIRECTION}
            { ...getInputProps(symbolOptions.direction)}
          />
          <InputControl
            label={i18n.AMPLIFIER_SPEED}
            { ...getInputProps(symbolOptions.speed)}
          />
        </div>
        <InputControl
          label={i18n.AMPLIFIER_HIGHER_FORMATION}
          { ...getInputProps(symbolOptions.higherFormation)}
        />
        <div className="amplifiers-form-control-row">
          <InputControl
            label={i18n.AMPLIFIER_EVALUATION_RATING}
            { ...getInputProps(symbolOptions.evaluationRating)}
          />
          <InputControl
            label={i18n.AMPLIFIER_COMBAT_EFFECTIVENESS}
            { ...getInputProps(symbolOptions.combatEffectiveness)}
          />
          <InputControl
            label={i18n.AMPLIFIER_IFF_SIF}
            { ...getInputProps(symbolOptions.iffSif)}
          />
        </div>
      </div>
    )
  }
}

AmplifiersForm.propTypes = {
  amplifiers: PropTypes.object,
  onChange: PropTypes.func,
}

const InputControl = (props) => {
  const { label, name, value, onChange } = props
  return (
    <div className="amplifiers-form-textfiled">
      <label>{label}</label>
      <input name={name} value={value} onChange={onChange} />
    </div>
  )
}

InputControl.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
}
