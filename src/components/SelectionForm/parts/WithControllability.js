import React from 'react'
import { Select } from 'antd'
import { components } from '@C4/CommonComponents'
import i18n from '../../../i18n'
import { CONTROL_TYPES as ct } from '../../../constants/symbols'
const { Option } = Select

const { FormRow } = components.form

const types = {
  [ct.UNCONTROLLED]: { text: i18n.MINE_UNCONTROLLED, value: ct.UNCONTROLLED },
  [ct.RADIO]: { text: i18n.MINE_RADIO, value: ct.RADIO },
  [ct.WIRED]: { text: i18n.MINE_WIRED, value: ct.WIRED },
}

const TYPE_LIST = Object.values(types)

export const PATH = [ 'attributes', 'params' ]

const WithControllability = (Component) => class ControllabilityComponent extends Component {
  controllabilityChangeHandler = (controlType) => this.setResult((result) => result.updateIn(PATH, (params) => {
    return { ...params, controlType }
  }))

  renderControllability () {
    const params = this.getResult().getIn(PATH)
    const controlType = params.controlType ?? ct.UNCONTROLLED
    const controlInfo = types[controlType]
    const canEdit = this.isCanEdit()
    const value = canEdit
      ? (
        <Select value={controlType} onChange={this.controllabilityChangeHandler}>
          {TYPE_LIST.map((type) => {
            return (
              <Option key={type.value} value={type.value}>
                <div className="icon-text">{type.text}</div>
              </Option>)
          })}
        </Select>
      )
      : <div className="mine-controllability-readonly">{controlInfo.text}</div>

    return (
      <FormRow label={i18n.MINE_CONTROLLABILITY}>
        {value}
      </FormRow>
    )
  }
}

export default WithControllability
