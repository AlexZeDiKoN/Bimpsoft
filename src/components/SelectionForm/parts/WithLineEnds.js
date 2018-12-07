import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import { endsDiv, endsOption } from './render'

const { FormRow } = components.form

const ENDS_NONE = 'none'
const ENDS_ARROW1 = 'arrow1'
const ENDS_ARROW2 = 'arrow2'
const ENDS_ARROW3 = 'arrow3'
const ENDS_ARROW4 = 'arrow4'
const ENDS_FORK = 'fork'
const ENDS_CROSS = 'cross'
const ENDS_STROKE1 = 'stroke1'
const ENDS_STROKE2 = 'stroke2'
const ENDS_STROKE3 = 'stroke3'

export const DIRECTION_LEFT = 'left'
export const DIRECTION_RIGHT = 'right'

const types = {
  [ENDS_NONE]: { text: i18n.REGULAR, value: ENDS_NONE },
  [ENDS_ARROW1]: { text: `${i18n.ARROW} 1`, value: ENDS_ARROW1 },
  [ENDS_ARROW2]: { text: `${i18n.ARROW} 2`, value: ENDS_ARROW2 },
  [ENDS_ARROW3]: { text: `${i18n.ARROW} 3`, value: ENDS_ARROW3 },
  [ENDS_ARROW4]: { text: `${i18n.ARROW} 4`, value: ENDS_ARROW4 },
  [ENDS_STROKE1]: { text: `${i18n.STROKE} 1`, value: ENDS_STROKE1 },
  [ENDS_STROKE2]: { text: `${i18n.STROKE} 2`, value: ENDS_STROKE2 },
  [ENDS_STROKE3]: { text: `${i18n.STROKE} 3`, value: ENDS_STROKE3 },
  [ENDS_FORK]: { text: i18n.FORK, value: ENDS_FORK },
  [ENDS_CROSS]: { text: i18n.CROSS, value: ENDS_CROSS },
}

const WithLineEnds = (Component) => class LineEndsComponent extends Component {
  static propTypes = {
    amplifiers: PropTypes.object,
  }

  constructor (props) {
    super(props)
    let { amplifiers: { [DIRECTION_LEFT]: left, [DIRECTION_RIGHT]: right } = {} } = props
    left = Object.entries(types).find(([ key, { value } ]) => value === left)
    right = Object.entries(types).find(([ key, { value } ]) => value === right)
    left = left ? left[0] : ENDS_NONE
    right = right ? right[0] : ENDS_NONE
    this.state = { ...this.state, [DIRECTION_LEFT]: left, [DIRECTION_RIGHT]: right }
  }

  lineEndsChangeHandler = (direction) => (lineEnds) => this.setState({ [direction]: lineEnds })

  fillResult (result) {
    super.fillResult(result)
    !result.amplifiers && (result.amplifiers = {})
    const leftInfo = types[this.state[DIRECTION_LEFT]]
    const rightInfo = types[this.state[DIRECTION_RIGHT]]
    result.amplifiers[DIRECTION_LEFT] = leftInfo && leftInfo.value
    result.amplifiers[DIRECTION_RIGHT] = rightInfo && rightInfo.value
  }

  renderLineEnds (direction) {
    const { [direction]: lineEnds } = this.state
    const typeInfo = types[lineEnds]
    const canEdit = this.isCanEdit()

    const value = canEdit
      ? (
        <Select value={lineEnds} onChange={this.lineEndsChangeHandler(direction)}>
          {endsOption(types[ENDS_NONE], direction)}
          {endsOption(types[ENDS_ARROW1], direction)}
          {endsOption(types[ENDS_ARROW2], direction)}
          {endsOption(types[ENDS_ARROW3], direction)}
          {endsOption(types[ENDS_ARROW4], direction)}
          {endsOption(types[ENDS_STROKE1], direction)}
          {endsOption(types[ENDS_STROKE2], direction)}
          {endsOption(types[ENDS_STROKE3], direction)}
          {endsOption(types[ENDS_FORK], direction)}
          {endsOption(types[ENDS_CROSS], direction)}
        </Select>
      )
      : endsDiv(typeInfo, direction)

    return (
      <FormRow label={i18n[`LINE_ENDS_${direction.toUpperCase()}`]}>
        {value}
      </FormRow>
    )
  }
}

export default WithLineEnds
