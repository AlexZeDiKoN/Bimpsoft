import React from 'react'
import { Select } from 'antd'
import { components } from '@C4/CommonComponents'
import i18n from '../../../i18n'
import { endsDiv, endsOption } from './render'

const { FormRow } = components.form

export const ENDS_NONE = 'none'
export const ENDS_ARROW1 = 'arrow1'
export const ENDS_ARROW2 = 'arrow2'
export const ENDS_ARROW3 = 'arrow3'
export const ENDS_ARROW4 = 'arrow4'
export const ENDS_FORK = 'fork'
export const ENDS_CROSS = 'cross'
export const ENDS_STROKE1 = 'stroke1'
export const ENDS_STROKE2 = 'stroke2'
export const ENDS_STROKE3 = 'stroke3'

export const DIRECTION_LEFT = 'left'
export const DIRECTION_RIGHT = 'right'

export const types = {
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

export const PATHS = {
  [DIRECTION_LEFT]: [ 'attributes', DIRECTION_LEFT ],
  [DIRECTION_RIGHT]: [ 'attributes', DIRECTION_RIGHT ],
}

const WithLineEnds = (Component) => class LineEndsComponent extends Component {
  lineEndsChangeHandlers = {
    [DIRECTION_LEFT]: (lineEnds) => this.setResult((result) => result.setIn(PATHS[DIRECTION_LEFT], lineEnds)),
    [DIRECTION_RIGHT]: (lineEnds) => this.setResult((result) => result.setIn(PATHS[DIRECTION_RIGHT], lineEnds)),
  }

  renderLineEnds (direction) {
    const lineEnds = this.getResult().getIn(PATHS[direction])
    const typeInfo = types[lineEnds]
    const canEdit = this.isCanEdit()

    const value = canEdit
      ? (
        <Select value={lineEnds} onChange={this.lineEndsChangeHandlers[direction]}>
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
