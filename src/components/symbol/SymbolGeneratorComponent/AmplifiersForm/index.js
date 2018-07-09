import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import i18n from '../../i18n'

export default class AmplifiersForm extends React.Component {
  changeAmplifier = (o) => {
    const { amplifiers = {} } = this.props
    this.props.onChange({ ...amplifiers, ...o })
  }

  render () {
    const { amplifiers = { engagementType: 'TARGET' } } = this.props
    return (
      <div className="amplifiers-form" >
        <InputControl
          label={i18n.AMPLIFIER_SPECIAL_HEADQUARTERS}
          onChange={ (value) => this.changeAmplifier({ specialHeadquarters: value }) }
          value={ amplifiers.specialHeadquarters}
        />
        <InputControl
          label={i18n.AMPLIFIER_HEADQUARTERS_ELEMENT}
          onChange={ (value) => this.changeAmplifier({ headquartersElement: value }) }
          value={ amplifiers.headquartersElement}
        />
        <InputControl
          label={i18n.AMPLIFIER_ENGAGEMENT_BAR}
          onChange={ (value) => this.changeAmplifier({ engagementBar: value }) }
          value={ amplifiers.engagementBar}
        />
        <InputControl
          label={i18n.AMPLIFIER_QUANTITY}
          onChange={ (value) => this.changeAmplifier({ quantity: value }) }
          value={ amplifiers.quantity}
        />
        <div className="amplifiers-form-control-group">
          <InputControl
            label={i18n.AMPLIFIER_SPECIAL_POINTER}
            onChange={ (value) => this.changeAmplifier({ specialPointer: value }) }
            value={ amplifiers.specialPointer}
          />
          <InputControl
            label={i18n.AMPLIFIER_DTG}
            onChange={ (value) => this.changeAmplifier({ dtg: value }) }
            value={ amplifiers.dtg}
          />
        </div>
        <InputControl
          label={i18n.AMPLIFIER_REINFORCED_REDUCED}
          onChange={ (value) => this.changeAmplifier({ reinforcedReduced: value }) }
          value={ amplifiers.reinforcedReduced}
        />
        <div className="amplifiers-form-control-group">
          <InputControl
            label={i18n.AMPLIFIER_WEAPONS_TYPE}
            onChange={ (value) => this.changeAmplifier({ weaponsType: value }) }
            value={ amplifiers.weaponsType}
          />
          <InputControl
            label={i18n.AMPLIFIER_PLATFORM_TYPE}
            onChange={ (value) => this.changeAmplifier({ platformType: value }) }
            value={ amplifiers.platformType}
          />
          <InputControl
            label={i18n.AMPLIFIER_TIME_OF_DISMANTLING}
            onChange={ (value) => this.changeAmplifier({ timeOfDismantling: value }) }
            value={ amplifiers.timeOfDismantling}
          />
        </div>
        <InputControl
          label={i18n.AMPLIFIER_STAFF_COMMENTS}
          onChange={ (value) => this.changeAmplifier({ staffComments: value }) }
          value={ amplifiers.staffComments}
        />
        <InputControl
          label={i18n.AMPLIFIER_UNIQUE_DESIGNATION}
          onChange={ (value) => this.changeAmplifier({ uniqueDesignation: value }) }
          value={ amplifiers.uniqueDesignation}
        />
        <div className="amplifiers-form-control-group">
          <InputControl
            label={i18n.AMPLIFIER_ADDITIONAL_INFORMATION}
            onChange={ (value) => this.changeAmplifier({ additionalInformation: value }) }
            value={ amplifiers.additionalInformation}
          />
          <InputControl
            label={i18n.AMPLIFIER_GENERAL_IDENTIFIER}
            onChange={ (value) => this.changeAmplifier({ generalIdentifier: value }) }
            value={ amplifiers.generalIdentifier}
          />
        </div>
        <div className="amplifiers-form-control-group">
          <InputControl
            label={i18n.AMPLIFIER_DIRECTION}
            onChange={ (value) => this.changeAmplifier({ direction: value }) }
            value={ amplifiers.direction}
          />
          <InputControl
            label={i18n.AMPLIFIER_SPEED}
            onChange={ (value) => this.changeAmplifier({ speed: value }) }
            value={ amplifiers.speed}
          />
        </div>
        <InputControl
          label={i18n.AMPLIFIER_HIGHER_FORMATION}
          onChange={ (value) => this.changeAmplifier({ higherFormation: value }) }
          value={ amplifiers.higherFormation}
        />
        <div className="amplifiers-form-control-row">
          <InputControl
            label={i18n.AMPLIFIER_EVALUATION_RATING}
            onChange={ (value) => this.changeAmplifier({ evaluationRating: value }) }
            value={ amplifiers.evaluationRating}
          />
          <InputControl
            label={i18n.AMPLIFIER_COMBAT_EFFECTIVENESS}
            onChange={ (value) => this.changeAmplifier({ combatEffectiveness: value }) }
            value={ amplifiers.combatEffectiveness}
          />
          <InputControl
            label={i18n.AMPLIFIER_IFF_SIF}
            onChange={ (value) => this.changeAmplifier({ iffSif: value }) }
            value={ amplifiers.iffSif}
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

class InputControl extends React.Component {
  changeHandler = (e) => this.props.onChange(e.target.value)

  render () {
    const { label, value = null } = this.props
    return (
      <div className="amplifiers-form-textfiled">
        <label>{label}</label>
        <input
          onChange={this.changeHandler}
          value={value}
        />
      </div>
    )
  }
}

InputControl.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
}
