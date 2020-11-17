import React from 'react'
import { Tooltip, Input as antdInput } from 'antd'
import { components, Input } from '@C4/CommonComponents'
import i18n from '../../../i18n'
import { amps } from '../../../constants/symbols'
import './withAmplifiersStyle.css'
import { MAX_LENGTH_TEXT } from '../../../constants/InputText'
import { MOUSE_ENTER_DELAY } from '../../../constants/tooltip'

const { FormRow } = components.form

const PAIRS_DEFAULT = [
  { id: amps.N, name: 'N_' },
  { id: amps.T, name: 'H1_' },
  { id: amps.W, name: 'H2_' },
]

const DEFAULT_MAX_ROWS = 3 // максимльное количкство строк на которое растягивается поле TextArea по умолчанию

export const PATH_AMPLIFIERS = [ 'attributes', 'pointAmplifier' ]
export const TYPE_AMPLIFIER_NUM = 'num'
export const TYPE_AMPLIFIER_INTEGER = 'integer'
export const TYPE_AMPLIFIER_TEXT = 'text'

const WithAmplifiers = (Component) => class AmplifiersComponent extends Component {
  createAmplifierHandler = (id, pathAmplifiers, simpleObject) => (event) => simpleObject
    ? this.setResult((result) => result.setIn(pathAmplifiers, {
      ...result.getIn(pathAmplifiers),
      [id]: event.target.value,
    }))
    : this.setResult((result) => result.setIn([ ...pathAmplifiers, id ], event.target.value))

  changeNumAmplifier = (id, pathAmplifiers, simpleObject) => ({ target: { value } }) => {
    if (!isNaN(value)) {
      this.setResult((result) => simpleObject
        ? result.setIn(pathAmplifiers, { ...result.getIn(pathAmplifiers), [id]: value })
        : result.setIn([ ...pathAmplifiers, id ], value))
    }
  }

  renderAmplifiers (ampConfig, pathAmplifiers = PATH_AMPLIFIERS, simpleObject = false, svg) {
    const amplifiers = ampConfig ?? PAIRS_DEFAULT
    const currentValue = this.getResult().getIn(pathAmplifiers)
    const canEdit = this.isCanEdit()
    return (
      <div className="amplifier-container__item">
        {amplifiers.map(({ id, name, type, maxRows = DEFAULT_MAX_ROWS, minNumber, maxNumber, notTitle }) =>
          <div className="amplifier-container__itemWidth" key={id}>
            <FormRow
              title={null}
              label={svg
                ? <Tooltip
                  overlayClassName='shape-form-svg-tooltip'
                  mouseEnterDelay={MOUSE_ENTER_DELAY}
                  placement={'left'}
                  title={() => svg}>
                  {`${i18n.AMPLIFIER} "${name}"`}
                </Tooltip>
                : `${notTitle ? '' : i18n.AMPLIFIER} "${name}"`
              }
            >
              {type === TYPE_AMPLIFIER_NUM
                ? <Input.Number
                  type="number"
                  className="number-control-input"
                  disabled={!canEdit}
                  readOnly={!canEdit}
                  step={1}
                  min={minNumber}
                  max={maxNumber}
                  value={currentValue[id] ?? ''}
                  onChange={this.changeNumAmplifier(id, pathAmplifiers, simpleObject)}
                />
                : type === TYPE_AMPLIFIER_INTEGER
                  ? <Input.Integer
                    type="number"
                    className="number-control-input"
                    disabled={!canEdit}
                    readOnly={!canEdit}
                    step={1}
                    min={minNumber}
                    max={maxNumber}
                    value={currentValue[id] ?? ''}
                    onChange={this.changeNumAmplifier(id, pathAmplifiers, simpleObject, name)}
                  />
                  : maxRows === 1
                    ? <Input
                      className={!canEdit ? 'modals-input-disabled' : ''}
                      name={name}
                      value={currentValue[id] ?? ''}
                      readOnly={!canEdit}
                      onChange={this.createAmplifierHandler(id, pathAmplifiers, simpleObject)}
                      disabled={!canEdit}
                      maxLength={id === amps.A
                        ? MAX_LENGTH_TEXT.TEXT_MULTILINE
                        : MAX_LENGTH_TEXT.TEXTAREA}
                    />
                    : <antdInput.TextArea
                      value={currentValue[id] ?? ''}
                      onChange={this.createAmplifierHandler(id, pathAmplifiers, simpleObject)}
                      readOnly={!canEdit}
                      className={!canEdit ? 'modals-input-disabled' : ''}
                      rows={id === amps.A ? 6 : 1}
                      autoSize={maxRows ? { maxRows } : undefined}
                      maxLength={id === amps.A
                        ? MAX_LENGTH_TEXT.TEXT_MULTILINE
                        : MAX_LENGTH_TEXT.TEXTAREA}
                    />}
            </FormRow>
          </div>)
        }
      </div>
    )
  }
}

export default WithAmplifiers
