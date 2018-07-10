import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import i18n from '../../i18n'
import * as symbolOptions from '../../model/symbolOptions'

const VALUE_REINFORCED = '+'
const VALUE_REDUCED = '-'
const VALUE_REINFORCED_AND_REDUCED = '+-'

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
        <SelectControl
          label={i18n.AMPLIFIER_REINFORCED_REDUCED}
          { ...getInputProps(symbolOptions.reinforcedReduced)}
        >
          <option value="">{i18n.UNDEFINED}</option>
          <option value={VALUE_REINFORCED} >{i18n.REINFORCED}</option>
          <option value={VALUE_REDUCED} >{i18n.REDUCED}</option>
          <option value={VALUE_REINFORCED_AND_REDUCED} >{i18n.REINFORCED_AND_REDUCED}</option>
        </SelectControl>
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

const SelectControl = (props) => {
  const { label, name, value, onChange, children } = props
  return (
    <div className="amplifiers-form-textfiled">
      <label>{label}</label>
      <select name={name} value={value} onChange={onChange} >
        {children}
      </select>
    </div>
  )
}
SelectControl.propTypes = {
  ...InputControl.propTypes,
  children: PropTypes.element,
}
