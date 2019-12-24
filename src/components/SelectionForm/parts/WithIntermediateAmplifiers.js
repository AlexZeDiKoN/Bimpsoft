import React from 'react'
import { Select, Input } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import { typeOption } from './render'
import { SUBORDINATION_LEVEL_PATH } from './WithSubordinationLevel'

const { FormRow } = components.form

const PAIRS = {
  TOP: { id: 'top', name: `${i18n.AMPLIFIER} "H1"` },
  MIDDLE: { id: 'middle', name: `${i18n.AMPLIFIER} "B"` },
  BOTTOM: { id: 'bottom', name: `${i18n.AMPLIFIER} "H2"` },
}

const TYPES = {
  NONE: 'none',
  LEVEL: 'show-level',
  TEXT: 'text',
}

const TYPE_LIST = [
  { id: '0', text: i18n.NO_ONE, value: TYPES.NONE },
  { id: '1', text: i18n.TEXT_2, value: TYPES.TEXT },
  { id: '2', text: i18n.SHOW_LEVEL, value: TYPES.LEVEL },
]

const PATH = [ 'attributes', 'intermediateAmplifiers' ]
const PATH_TO_TYPE = [ ...PATH, 'type' ]

const WithIntermediateAmplifiers = (Component) => class IntermediateAmplifiersComponent extends Component {
  intermediateAmplifierTypeHandler = (id) => this.setResult((result) => result.setIn(PATH_TO_TYPE, id))

  createIntermediateAmplifierHandler = (id) => (event) => (
    this.setResult((result) => result.setIn([ ...PATH, id ], event.target.value))
  )

  renderIntermediateAmplifiers () {
    const state = this.getResult()
    const currentValue = state.getIn(PATH)
    const subordinationLevel = state.getIn(SUBORDINATION_LEVEL_PATH)
    const canEdit = this.isCanEdit()

    const renderAmplifierInput = ({ id, name }) => (
      <div className="line-container__itemWidth" key={id}>
        <FormRow label={name}>
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
            <FormRow label={PAIRS.MIDDLE.name}>
              <Select
                value={currentValue.type}
                onChange={this.intermediateAmplifierTypeHandler}
                disabled={!canEdit}
              >{TYPE_LIST.map(({ text, value }) => {
                  const level = value === TYPES.LEVEL ? subordinationLevel : null
                  return typeOption(value, 'solid', text, level)
                })}
              </Select>
              {currentValue.type === TYPES.TEXT
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
