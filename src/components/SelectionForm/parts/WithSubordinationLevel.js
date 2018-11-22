import React from 'react'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import SubordinationLevelSelect from '../../SubordinationLevelSelect'
import { SubordinationLevel } from '../../../constants'

const { FormRow } = components.form

const WithSubordinationLevel = (Component) => class SubordinationLevelComponent extends Component {
  static propTypes = {
    subordinationLevel: PropTypes.number,
  }

  constructor (props) {
    super(props)
    this.state.subordinationLevel = props.subordinationLevel || SubordinationLevel.TEAM_CREW
  }

  changeSubordinationLevel = (subordinationLevel) => this.setState({ subordinationLevel })

  fillResult (result) {
    super.fillResult(result)
    result.subordinationLevel = this.state.subordinationLevel
  }

  renderSubordinationLevel () {
    const {
      subordinationLevel,
    } = this.state

    const canEdit = this.isCanEdit()

    return (
      <FormRow label={i18n.SUBORDINATION_LEVEL}>
        <SubordinationLevelSelect
          readOnly={!canEdit}
          value={ subordinationLevel }
          onChange={this.changeSubordinationLevel}
        />
      </FormRow >
    )
  }
}

export default WithSubordinationLevel
