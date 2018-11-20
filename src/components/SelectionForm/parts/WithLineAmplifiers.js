import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import { typeDiv, typeOption } from './render'

const { FormRow } = components.form
const AMPL_NONE = 'none'
const AMPL_SHOW_LEVEL = 'show-level'

const types = {
  [AMPL_NONE]: { text: i18n.NO_ONE, value: AMPL_NONE },
  [AMPL_SHOW_LEVEL]: { text: i18n.SHOW_LEVEL, value: AMPL_SHOW_LEVEL },
}

const WithLineAmplifiers = (Component) => class LineAmplifiersComponent extends Component {
  static propTypes = {
    amplifiers: PropTypes.object,
    subordinationLevel: PropTypes.number,
  }

  constructor (props) {
    super(props)
    let { amplifiers: { lineAmpl } = {} } = props
    lineAmpl = Object.entries(types).find(([ key, { value } ]) => value === lineAmpl)
    lineAmpl = lineAmpl ? lineAmpl[0] : AMPL_NONE
    this.state.lineAmpl = lineAmpl
  }

  lineAmplChangeHandler = (lineAmpl) => this.setState({ lineAmpl })

  fillResult (result) {
    super.fillResult(result)
    !result.amplifiers && (result.amplifiers = {})
    const lineAmplInfo = types[this.state.lineAmpl]
    result.amplifiers.lineAmpl = lineAmplInfo && lineAmplInfo.value
  }

  renderLineAmplifiers () {
    const { lineAmpl, subordinationLevel } = this.state
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
