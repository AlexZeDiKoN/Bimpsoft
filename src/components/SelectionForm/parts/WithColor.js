import React from 'react'
import { FormRow } from '@C4/CommonComponents'
import  ColorPicker from '../../common/ColorPicker'
import { colors } from '../../../constants'
import i18n from '../../../i18n'
import { colorDiv } from './render'

export const PATH = [ 'attributes', 'color' ]

const PRESET_COLORS = Object.values(colors.values)
const COLOR_PICKER_Z_INDEX = 2000

const WithColor = (Component) => class ColorComponent extends Component {
  colorChangeHandler = (color) => this.setResult((result) => result.setIn(PATH, color))

  renderColor (showLabel = false) {
    const color = this.getResult().getIn(PATH)
    const canEdit = this.isCanEdit()
    const value =
      <FormRow label={showLabel ? i18n.LINE_COLOR : ''}>
        {canEdit ? (
          <ColorPicker
            color={color}
            onChange={this.colorChangeHandler}
            zIndex={COLOR_PICKER_Z_INDEX}
            presetColors={PRESET_COLORS}
          />
        ) : colorDiv(color)}
      </FormRow>

    return (
      <div className={'container-color-picker'}>
        {value}
      </div>
    )
  }
}

export default WithColor
