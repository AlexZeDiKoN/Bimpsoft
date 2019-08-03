import React from 'react'
import { Select } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import { typeDiv, typeOption } from './render'
import { SUBORDINATION_LEVEL_PATH } from './WithSubordinationLevel'

const { FormRow } = components.form
const AMPL_NONE = 'none'
const AMPL_SHOW_LEVEL = 'show-level'

const types = {
  [AMPL_NONE]: { text: i18n.NO_ONE, value: AMPL_NONE },
  [AMPL_SHOW_LEVEL]: { text: i18n.SHOW_LEVEL, value: AMPL_SHOW_LEVEL },
}

const PATH = [ 'attributes', 'lineAmpl' ]

const WithLineAmplifiers = (Component) => class LineAmplifiersComponent extends Component {
  lineAmplChangeHandler = (lineAmpl) => this.setResult((result) => result.setIn(PATH, lineAmpl))

  renderLineAmplifiers () {
    const result = this.getResult()
    const lineAmpl = result.getIn(PATH)
    const subordinationLevel = result.getIn(SUBORDINATION_LEVEL_PATH)
    const typeInfo = types[lineAmpl]
    const canEdit = this.isCanEdit()

    const value = canEdit
      ? (
        <Select value={lineAmpl} onChange={this.lineAmplChangeHandler}>
          {typeOption(AMPL_NONE, 'solid', types[AMPL_NONE].text)}
          {typeOption(AMPL_SHOW_LEVEL, 'solid', types[AMPL_SHOW_LEVEL].text, subordinationLevel)}
        </Select>
      )
      : typeDiv('solid', typeInfo.text, typeInfo.value === AMPL_SHOW_LEVEL ? subordinationLevel : null)

    return (
      <FormRow label={i18n.AMPLIFIERS}>
        {value}
      </FormRow>
    )
  }
}

export default WithLineAmplifiers
