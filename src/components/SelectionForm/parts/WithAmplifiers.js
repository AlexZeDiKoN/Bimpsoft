import React from 'react'
import { Input, Tooltip } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import { amps } from '../../../constants/symbols'
import { MAX_LENGTH_TEXT_AMPLIFIERS } from './WithPointAmplifiers'
import './withAmplifiersStyle.css'

const { FormRow } = components.form

const PAIRS_DEFAULT = [
  { id: amps.N, name: 'N_' },
  { id: amps.T, name: 'H1_' },
  { id: amps.W, name: 'H2_' },
]

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

  changeNumAmplifier = (pathAmplifiers, simpleObject) => (name, value) => {
    if (!isNaN(value)) {
      if (simpleObject) {
        this.setResult((result) => result.setIn(pathAmplifiers, { ...result.getIn(pathAmplifiers), [name]: value }))
      } else {
        this.setResult((result) => (result.setIn([ ...pathAmplifiers, name ], value)))
      }
    }
  }

  renderAmplifiers (ampPairs, pathAmplifiers = PATH_AMPLIFIERS, simpleObject = false, svg) {
    const amplifiersPairs = ampPairs ?? PAIRS_DEFAULT
    const currentValue = this.getResult().getIn(pathAmplifiers)
    const canEdit = this.isCanEdit()
    return (
      <div className="amplifier-container__item">
        {amplifiersPairs.map(({ id, name, type, maxRows, maxNumber }) => (
          <div className="amplifier-container__itemWidth" key={id}>
            <FormRow title={null}
              label={svg
                ? <Tooltip
                  overlayClassName='shape-form-svg-tooltip'
                  mouseEnterDelay={1}
                  placement={'left'}
                  title={() => svg}>
                  {`${i18n.AMPLIFIER} "${name}"`}
                </Tooltip>
                : `${i18n.AMPLIFIER} "${name}"`}>
              {type === TYPE_AMPLIFIER_NUM
                ? <Input.Number
                  type="number"
                  className="number-control-input"
                  disabled={!canEdit}
                  readOnly={!canEdit}
                  step={1}
                  min="0"
                  max={maxNumber}
                  value={currentValue[id] ?? ''}
                  onChange={this.changeHandler}
                />
                : type === TYPE_AMPLIFIER_INTEGER
                  ? <Input.Integer
                    type="number"
                    className="number-control-input"
                    disabled={!canEdit}
                    readOnly={!canEdit}
                    step={1}
                    min="0"
                    max={maxNumber}
                    value={currentValue[id] ?? ''}
                    onChange={this.changeHandler}
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
                        ? MAX_LENGTH_TEXT_AMPLIFIERS.TEXT_MULTILINE
                        : MAX_LENGTH_TEXT_AMPLIFIERS.TEXTAREA}
                    />
                    : <Input.TextArea
                      value={currentValue[id] ?? ''}
                      onChange={this.createAmplifierHandler(id, pathAmplifiers, simpleObject)}
                      readOnly={!canEdit}
                      className={!canEdit ? 'modals-input-disabled' : ''}
                      rows={id === amps.A ? 6 : 1}
                      autoSize={ maxRows ? { minRows: 1, maxRows: maxRows } : undefined}
                      maxLength={id === amps.A
                        ? MAX_LENGTH_TEXT_AMPLIFIERS.TEXT_MULTILINE
                        : MAX_LENGTH_TEXT_AMPLIFIERS.TEXTAREA}
                    />}
            </FormRow>
            {/* <NumberControl */}
            {/*  name={id} */}
            {/*  disabled={!canEdit} */}
            {/*  value={Number(currentValue[id])} */}
            {/*  onChange={this.changeNumAmplifier(pathAmplifiers, simpleObject)} */}
            {/*  maxNumber={maxNumber} */}
            {/* /> */}
          </div>
        ))}
      </div>
    )
  }
}

export default WithAmplifiers
