import React from 'react'
import { Select } from 'antd'
import './withFillStyle.css'
import { components } from '@C4/CommonComponents'
import { colors } from '../../../constants'
import i18n from '../../../i18n'
import ColorPicker from '../../common/ColorPicker'
import { HATCH_TYPE } from '../../../constants/drawLines'
import { evaluateColor } from '../../../constants/colors'

const { FormRow } = components.form

const COLOR_PICKER_Z_INDEX = 2000

const PATH_HATCH = [ 'attributes', 'hatch' ]
const PATH_FILL = [ 'attributes', 'fill' ]

const HATCH_TYPES = {
  none: { text: i18n.FILL_FULL, value: HATCH_TYPE.NONE },
  leftToRight: { text: i18n.HATCH_LEFT_TO_RIGHT, value: HATCH_TYPE.LEFT_TO_RIGHT },
}

const TYPE_LIST_JSX = Object.values(HATCH_TYPES).map(({ value, text }) => (
  <Select.Option value={value} key={value}>{text}</Select.Option>
))

const WithFill = (Component) => class FillComponent extends Component {
  fillColorChangeHandler = (fill) => this.setResult((result) => result.setIn(PATH_FILL, fill))

  typeFillChangeHandler = (hatch) => {
    if (hatch !== HATCH_TYPE.NONE) {
      let fill = this.getResult().getIn(PATH_FILL)
      if (fill === evaluateColor(colors.TRANSPARENT) || fill === colors.TRANSPARENT) {
        fill = '#000000'
        this.setResult((result) => result.setIn(PATH_FILL, fill).setIn(PATH_HATCH, hatch))
        return
      }
    }
    this.setResult((result) => result.setIn(PATH_HATCH, hatch))
  }

  renderFill (useHatch = false) {
    const fill = this.getResult().getIn(PATH_FILL)
    const hatch = this.getResult().getIn(PATH_HATCH)
    const canEdit = this.isCanEdit()
    return (
      <div className={'fill-item-component'}>
        <FormRow label={useHatch ? i18n.FILL_TYPE : ''}>
          {useHatch
            ? <Select
              value={hatch}
              onChange={this.typeFillChangeHandler}
              className={!canEdit ? 'modals-input-disabled' : ''}
              disabled={!canEdit}>
              {TYPE_LIST_JSX}
            </Select>
            : <div className={'fill-item-text'}>{i18n.FILL_COLOR} </div>
          }
          <div className='color-picker-hover'>
            <ColorPicker
              disabled={!canEdit}
              // icon={IconNames.PALETTE}
              title={hatch === HATCH_TYPE.NONE ? i18n.FILL_COLOR : i18n.HATCH_COLOR}
              className="fill-item-component-control"
              color={fill}
              zIndex={COLOR_PICKER_Z_INDEX}
              onChange={this.fillColorChangeHandler}
            />
          </div>
        </FormRow>
      </div>
    )
  }
}

export default WithFill
