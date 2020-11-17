import React from 'react'
import { Select, Input, Tooltip } from 'antd'
import { components } from '@C4/CommonComponents'
import i18n from '../../../i18n'
import { MARK_TYPE } from '../../../constants/drawLines'
import { MAX_LENGTH_TEXT, MAX_ROW } from '../../../constants/InputText'
import { typeOption } from './render'
import { SUBORDINATION_LEVEL_PATH } from './WithSubordinationLevel'

import './WithIntermediateAmplifiers.css'
import { MOUSE_ENTER_DELAY } from '../../../constants/tooltip'

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
  ARROW: MARK_TYPE.ARROW_90,
  ARROW_FILED: MARK_TYPE.ARROW_30_FILL,
}

const TYPE_LIST = [
  { id: '0', text: i18n.NO_ONE, value: TYPES.NONE },
  { id: '1', text: i18n.TEXT_2, value: TYPES.TEXT },
  { id: '2', text: i18n.SHOW_LEVEL, value: TYPES.LEVEL },
  { id: '3', text: i18n.ARROW_FILLED, value: TYPES.ARROW_FILED },
  { id: '4', text: i18n.ARROW_LEFT, value: TYPES.ARROW },
]

export const PATH = [ 'attributes', 'intermediateAmplifier' ]
export const TYPE_PATH = [ 'attributes', 'intermediateAmplifierType' ]

const WithIntermediateAmplifiers = (Component) => class IntermediateAmplifiersComponent extends Component {
  intermediateAmplifierTypeHandler = (type) => {
    this.setResult((result) => {
      return result
        .setIn(TYPE_PATH, type)
        .setIn([ ...PATH, PAIRS.MIDDLE.id ], null)
    })
  }

  createIntermediateAmplifierHandler = (id) => (event) => {
    const strs = event.target.value.split('\n')
    if (strs.length > MAX_ROW.INTERMEDIATE_AMP) {
      return
    }
    return this.setResult((result) => result.setIn([ ...PATH, id ], event.target.value))
  }

  renderIntermediateAmplifiers (svg) {
    const state = this.getResult()
    const currentValue = state.getIn(PATH)
    const type = state.getIn(TYPE_PATH)
    const subordinationLevel = state.getIn(SUBORDINATION_LEVEL_PATH)
    const canEdit = this.isCanEdit()

    const renderAmplifierInput = ({ id, name }) => (
      <div className="line-container__itemWidth" key={id}>
        <FormRow
          title={null}
          label={svg ? <Tooltip
            overlayClassName='shape-form-svg-tooltip'
            mouseEnterDelay={MOUSE_ENTER_DELAY}
            placement={'left'}
            title={() => svg}>
            {`${i18n.AMPLIFIER} "${name}"`}
          </Tooltip> : `${i18n.AMPLIFIER} "${name}"`}>
          <Input.TextArea
            autoSize={{ maxRows: 3 }}
            value={currentValue[id] ?? ''}
            onChange={this.createIntermediateAmplifierHandler(id)}
            className={!canEdit ? 'modals-input-disabled' : ''}
            readOnly={!canEdit}
            rows={1}
            maxLength={MAX_LENGTH_TEXT.TEXTAREA}
          />
        </FormRow>
      </div>
    )

    return (
      <div className="intermediate-amplifiers__item">
        <div className="intermediate-amplifiers__itemWidth">
          <div className="intermediate-amplifiers__item-B">
            <FormRow
              title={null}
              label={svg ? <Tooltip
                overlayClassName='shape-form-svg-tooltip'
                mouseEnterDelay={MOUSE_ENTER_DELAY}
                placement={'left'}
                title={() => svg}>
                {`${i18n.AMPLIFIER} "${PAIRS.MIDDLE.name}"`}
              </Tooltip> : `${i18n.AMPLIFIER} "${PAIRS.MIDDLE.name}"`}>
              <Select
                value={type}
                onChange={this.intermediateAmplifierTypeHandler}
                disabled={!canEdit}
                className={!canEdit ? 'modals-input-disabled' : ''}
              >{TYPE_LIST.map(({ text, value }) => {
                  const level = value === TYPES.LEVEL ? subordinationLevel : null
                  let borderStyle
                  switch (value) {
                    case TYPES.ARROW:
                    case TYPES.ARROW_FILED:
                      borderStyle = value
                      break
                    default:
                      borderStyle = 'solid'
                  }
                  return typeOption(value, borderStyle, text, level)
                })}
              </Select>
              <Input
                className={!canEdit ? 'modals-input-disabled' : ''}
                disabled={!canEdit || type !== TYPES.TEXT}
                value={currentValue[PAIRS.MIDDLE.id] ?? ''}
                onChange={this.createIntermediateAmplifierHandler(PAIRS.MIDDLE.id)}
                maxLength={MAX_LENGTH_TEXT.INPUT}
              />
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
