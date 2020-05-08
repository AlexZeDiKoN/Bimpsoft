import React from 'react'
import { Input } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
// import { typeOption } from './render'
import { amps } from '../../../constants/symbols'
import NumberControl from '../../common/NumberControl'
import { MAX_LENGTH_TEXT_AMPLIFIERS } from './WithPointAmplifiers'

const { FormRow } = components.form

const PAIRS_DEFAULT = [
  { id: amps.N, name: 'N_' },
  { id: amps.T, name: 'H1_' },
  { id: amps.W, name: 'H2_' },
]

export const PATH_AMPLIFIERS = [ 'attributes', 'pointAmplifier' ]
export const TYPE_AMPLIFIER_NUM = 'num'
export const TYPE_AMPLIFIER_TEXT = 'text'

const WithAmplifiers = (Component) => class AmplifiersComponent extends Component {
  createAmplifierHandler = (id) => (event) => (
    this.setResult((result) => (result.setIn([ ...PATH_AMPLIFIERS, id ], event.target.value)))
  )

  changeNumAmplifier = (name, value) => {
    if (!isNaN(value)) {
      this.setResult((result) => (result.setIn([ ...PATH_AMPLIFIERS, name ], value)))
    }
  }

  renderAmplifiers (ampPairs) {
    const amplifiersPairs = ampPairs ?? PAIRS_DEFAULT
    const currentValue = this.getResult().getIn(PATH_AMPLIFIERS)
    const canEdit = this.isCanEdit()
    return (
      <div className="line-container__item">
        {amplifiersPairs.map(({ id, name, type }) => (
          <div className="line-container__itemWidth" key={id}>
            {type !== TYPE_AMPLIFIER_NUM ? (
              <FormRow label={`${i18n.AMPLIFIER} "${name}"`}>
                <Input.TextArea
                  value={currentValue[id] ?? ''}
                  onChange={this.createAmplifierHandler(id)}
                  disabled={!canEdit}
                  rows={id === amps.A ? 6 : 1}
                  maxLength={id === amps.A
                    ? MAX_LENGTH_TEXT_AMPLIFIERS.TEXTMULTILINE
                    : MAX_LENGTH_TEXT_AMPLIFIERS.TEXTAREA}
                />
              </FormRow>) : (
              <FormRow label={`${name}`}>
                <NumberControl name={id} value={Number(currentValue[id])} onChange={this.changeNumAmplifier}/>
              </FormRow>
            )}
          </div>
        ))}
      </div>
    )
  }
}

export default WithAmplifiers
