import React from 'react'
import { components } from '@C4/CommonComponents'
import i18n from '../../../i18n'
import SubordinationLevelSelect from '../../SubordinationLevelSelect'
import { SubordinationLevel } from '../../../constants'
import { propTypes } from './AbstractShapeForm'

const { FormRow } = components.form

export const SUBORDINATION_LEVEL_PATH = [ 'level' ]

const WithSubordinationLevel = (Component) => class SubordinationLevelComponent extends Component {
  static propTypes = propTypes

  componentDidUpdate (prevProps) {
    const { unit } = this.getResult()
    const { byIds } = this.getOrgStructures()
    if (unit && (prevProps.data.unit !== unit)) {
      let unitData = byIds[unit]
      if (unitData.itemType === 'CommandPost') {
        unitData = byIds[unitData.militaryUnitID]
      }
      this.changeSubordinationLevel(unitData.natoLevelID)
    }
  }

  changeSubordinationLevel = (subordinationLevel) =>
    this.setResult((result) => result.setIn(SUBORDINATION_LEVEL_PATH, subordinationLevel))

  renderSubordinationLevel () {
    const canEdit = this.isCanEdit()
    const subordinationLevel = this.getResult()[SUBORDINATION_LEVEL_PATH] || SubordinationLevel.UNDEFINED

    return (
      <FormRow label={i18n.SUBORDINATION_LEVEL}>
        <SubordinationLevelSelect
          readOnly={!canEdit}
          value={subordinationLevel}
          onChange={this.changeSubordinationLevel}
        />
      </FormRow>
    )
  }
}

export default WithSubordinationLevel
