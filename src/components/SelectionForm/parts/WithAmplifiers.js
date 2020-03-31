import React from 'react'
import { Input } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
// import { typeOption } from './render'
import { MAX_LENGTH_TEXT_AMPLIFIERS } from './WithPointAmplifiers'

const { FormRow } = components.form

const PAIRS = {
  MIDDLE: { id: 'middle', name: 'N' },
  TOP: { id: 'top', name: 'H1' },
  BOTTOM: { id: 'bottom', name: 'H2' },
}

const PAIR_LIST = Object.values(PAIRS)

export const PATH_AMPLIFIERS = [ 'attributes', 'pointAmplifier' ]
export const PATH_PARAMS = [ 'attributes', 'params' ]

const WithAmplifiers = (Component) => class AmplifiersComponent extends Component {
  createAmplifierHandler = (id) => (event) => (
    this.setResult((result) => (result.setIn([ ...PATH_AMPLIFIERS, id ], event.target.value)))
  )

  renderAmplifiers () {
    const currentValue = this.getResult().getIn(PATH_AMPLIFIERS)
    const canEdit = this.isCanEdit()
    return (
      <div className="line-container__itemWidth">
        {PAIR_LIST.map(({ id, name }) => (
          <div className="line-container__itemWidth30" key={id}>
            <FormRow label={`${i18n.AMPLIFIER} "${name}"`}>
              <Input.TextArea
                value={currentValue[id] ?? ''}
                onChange={this.createAmplifierHandler(id)}
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

export default WithAmplifiers
