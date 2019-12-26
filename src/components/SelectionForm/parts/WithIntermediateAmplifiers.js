import React from 'react'
import { Select, Input } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import { typeOption } from './render'
import { SUBORDINATION_LEVEL_PATH } from './WithSubordinationLevel'

const { FormRow } = components.form

const PAIRS = {
  TOP: { id: 'top', name: 'H1' },
  MIDDLE: { id: 'middle', name: 'B' },
  BOTTOM: { id: 'bottom', name: 'H2' },
}

export const NAME_OF_AMPLIFIERS = `${PAIRS.TOP.name}/${PAIRS.MIDDLE.name}/${PAIRS.BOTTOM.name}`

const TYPES = {
  NONE: 'none',
  LEVEL: 'level',
  TEXT: 'text',
}

const TYPE_LIST = [
  { id: '0', text: i18n.NO_ONE, value: TYPES.NONE },
  { id: '1', text: i18n.TEXT_2, value: TYPES.TEXT },
  { id: '2', text: i18n.SHOW_LEVEL, value: TYPES.LEVEL },
]

export const PATH = [ 'attributes', 'intermediateAmplifiers' ]
export const TYPE_PATH = [ 'attributes', 'intermediateAmplifierType' ]

export const INTERMEDIATE_AMPLIFIER_TYPES = TYPES
export const INTERMEDIATE_AMPLIFIER_PATH = PATH
export const INTERMEDIATE_AMPLIFIER_TYPE_PATH = TYPE_PATH

const WithIntermediateAmplifiers = (Component) => class IntermediateAmplifiersComponent extends Component {
  intermediateAmplifierTypeHandler = (type) => (
    this.setResult((result) => result.setIn(INTERMEDIATE_AMPLIFIER_TYPE_PATH, type))
  )

  createIntermediateAmplifierHandler = (id) => (event) => (
    this.setResult((result) => result.setIn([ ...INTERMEDIATE_AMPLIFIER_PATH, id ], event.target.value))
  )

  renderIntermediateAmplifiers () {
    const state = this.getResult()
    const currentValue = state.getIn(INTERMEDIATE_AMPLIFIER_PATH)
    const type = state.getIn(INTERMEDIATE_AMPLIFIER_TYPE_PATH)
    const subordinationLevel = state.getIn(SUBORDINATION_LEVEL_PATH)
    const canEdit = this.isCanEdit()

    const renderAmplifierInput = ({ id, name }) => (
      <div className="line-container__itemWidth" key={id}>
        <FormRow label={`${i18n.AMPLIFIER} "${name}"`}>
          <Input
            value={currentValue[id]}
            onChange={this.createIntermediateAmplifierHandler(id)}
            disabled={!canEdit}
          />
        </FormRow>
      </div>
    )

    return (
      <div className="line-container__item">
        <div className="line-container__itemWidth">
          <div className="line-container__item">
            <FormRow label={`${i18n.AMPLIFIER} "${PAIRS.MIDDLE.name}"`}>
              <Select
                value={type}
                onChange={this.intermediateAmplifierTypeHandler}
                disabled={!canEdit}
              >{TYPE_LIST.map(({ text, value }) => {
                  const level = value === TYPES.LEVEL ? subordinationLevel : null
                  return typeOption(value, 'solid', text, level)
                })}
              </Select>
              {type === TYPES.TEXT
                ? <Input
                  value={currentValue[PAIRS.MIDDLE.id]}
                  onChange={this.createIntermediateAmplifierHandler(PAIRS.MIDDLE.id)}
                /> : null}
            </FormRow>
          </div>
        </div>
        {renderAmplifierInput(PAIRS.TOP)}
        {renderAmplifierInput(PAIRS.BOTTOM)}
      </div>
    )
  }
}

export default WithIntermediateAmplifiers
