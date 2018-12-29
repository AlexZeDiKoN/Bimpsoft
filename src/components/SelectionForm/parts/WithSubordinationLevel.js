import React from 'react'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import SubordinationLevelSelect from '../../SubordinationLevelSelect'

const { FormRow } = components.form

export const SUBORDINATION_LEVEL_PATH = [ 'level' ]

const WithSubordinationLevel = (Component) => class SubordinationLevelComponent extends Component {
  changeSubordinationLevel = (subordinationLevel) =>
    this.setResult((result) => result.setIn(SUBORDINATION_LEVEL_PATH, subordinationLevel))

  renderSubordinationLevel () {
    const subordinationLevel = this.getResult().getIn(SUBORDINATION_LEVEL_PATH)

    const canEdit = this.isCanEdit()

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
