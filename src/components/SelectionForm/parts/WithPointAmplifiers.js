import React from 'react'
import { Input } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'

const { FormRow } = components.form

const PAIRS = {
  TOP: { id: 'top', name: 'T' },
  MIDDLE: { id: 'middle', name: 'N' },
  BOTTOM: { id: 'bottom', name: 'W' },
}

export const MAX_LENGTH_TEXT_AMPLIFIERS = {
  TEXTAREA: 30,
  TEXTMULTILINE: 128,
  INPUT: 15,
}

const PAIR_LIST = Object.values(PAIRS)

const PATH = [ 'attributes', 'pointAmplifier' ]

const WithPointAmplifiers = (Component) => class PointAmplifiersComponent extends Component {
  createPointAmplifierHandler = (id) => (event) => (
    this.setResult((result) => result.setIn([ ...PATH, id ], event.target.value))
  )

  renderPointAmplifiers () {
    const currentValue = this.getResult().getIn(PATH)
    const canEdit = this.isCanEdit()
    return (
      <div className="line-container__item">
        {PAIR_LIST.map(({ id, name }) => (
          <div className="line-container__itemWidth" key={id}>
            <FormRow label={`${i18n.AMPLIFIER} "${name}"`}>
              <Input
                type={'text'}
                value={currentValue[id] ?? ''}
                onChange={this.createPointAmplifierHandler(id)}
                disabled={!canEdit}
                rows={1}
                maxLength={MAX_LENGTH_TEXT_AMPLIFIERS.TEXTAREA}
              />
            </FormRow>
          </div>
        ))}
      </div>
    )
  }
}

export default WithPointAmplifiers
