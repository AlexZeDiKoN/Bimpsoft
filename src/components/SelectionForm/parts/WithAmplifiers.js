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
  createAmplifierHandler = (id, pathAmplifiers, simpleObject) => (event) => simpleObject
    ? this.setResult((result) => result.setIn(pathAmplifiers, {
      ...result.getIn(pathAmplifiers),
      [id]: event.target.value,
    }))
    : this.setResult((result) => result.setIn([ ...pathAmplifiers, id ], event.target.value))

  changeNumAmplifier = (pathAmplifiers, simpleObject) => (name, value) => {
    if (!isNaN(value)) {
      if (simpleObject) {
        this.setResult((result) => result.setIn(pathAmplifiers, { ...result.getIn(pathAmplifiers), [name]: value }))
      } else {
        this.setResult((result) => (result.setIn([ ...pathAmplifiers, name ], value)))
      }
    }
  }

  renderAmplifiers (ampPairs, pathAmplifiers = PATH_AMPLIFIERS, simpleObject = false) {
    const amplifiersPairs = ampPairs ?? PAIRS_DEFAULT
    const currentValue = this.getResult().getIn(pathAmplifiers)
    const canEdit = this.isCanEdit()
    return (
      <div className="line-container__item">
        {amplifiersPairs.map(({ id, name, type, maxRows }) => (
          <div className="line-container__itemWidth" key={id}>
            {type !== TYPE_AMPLIFIER_NUM
              ? <FormRow label={`${i18n.AMPLIFIER} "${name}"`}>
                  <Input.TextArea
                    value={currentValue[id] ?? ''}
                    onChange={this.createAmplifierHandler(id, pathAmplifiers, simpleObject)}
                    disabled={!canEdit}
                    rows={id === amps.A ? 6 : 1}
                    autoSize={ maxRows ? { minRows: 1, maxRows: maxRows } : undefined}
                    maxLength={id === amps.A
                      ? MAX_LENGTH_TEXT_AMPLIFIERS.TEXT_MULTILINE
                      : MAX_LENGTH_TEXT_AMPLIFIERS.TEXTAREA}
                  />
                </FormRow>
              : <FormRow label={`${name}`}>
                  <NumberControl
                    name={id}
                    value={Number(currentValue[id])}
                    onChange={this.changeNumAmplifier(pathAmplifiers, simpleObject)}
                  />
                </FormRow>
            }
          </div>
        ))}
      </div>
    )
  }
}

export default WithAmplifiers
