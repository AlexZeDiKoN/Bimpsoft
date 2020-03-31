import React from 'react'
import { Input } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
// import { typeOption } from './render'
import { MAX_LENGTH_TEXT_AMPLIFIERS } from './WithPointAmplifiers'

const { FormRow } = components.form

const PAIRS_DEFAULT = [
  { id: 'middle', name: 'N_' },
  { id: 'top', name: 'H1_' },
  { id: 'bottom', name: 'H2_' },
]

// const amplifiersPairs = PAIRS_DEFAULT

export const PATH_AMPLIFIERS = [ 'attributes', 'pointAmplifier' ]

const WithAmplifiers = (Component) => class AmplifiersComponent extends Component {
  createAmplifierHandler = (id) => (event) => (
    this.setResult((result) => (result.setIn([ ...PATH_AMPLIFIERS, id ], event.target.value)))
  )

  renderAmplifiers (ampPairs) {
    const amplifiersPairs = ampPairs ?? PAIRS_DEFAULT
    const currentValue = this.getResult().getIn(PATH_AMPLIFIERS)
    const canEdit = this.isCanEdit()
    return (
      <div className="line-container__itemWidth">
        {amplifiersPairs.map(({ id, name }) => (
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
