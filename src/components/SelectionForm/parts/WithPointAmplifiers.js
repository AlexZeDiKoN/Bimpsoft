import React from 'react'
import { Input, Tooltip } from 'antd'
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
  TEXT_MULTILINE: 128,
  INPUT: 15,
}

const PAIR_LIST = Object.values(PAIRS)

const PATH = [ 'attributes', 'pointAmplifier' ]

const WithPointAmplifiers = (Component) => class PointAmplifiersComponent extends Component {
  createPointAmplifierHandler = (id) => (event) => (
    this.setResult((result) => result.setIn([ ...PATH, id ], event.target.value))
  )

  renderPointAmplifiers (svg) {
    const currentValue = this.getResult().getIn(PATH)
    const canEdit = this.isCanEdit()
    return (
      <div className="line-container__item">
        {PAIR_LIST.map(({ id, name }) => (
          <div className="line-container__itemWidth" key={id}>
            <FormRow
              title={null}
              label={svg ? <Tooltip
                overlayClassName='shape-form-svg-tooltip'
                mouseEnterDelay={1}
                placement={'left'}
                title={() => svg}>
                {`${i18n.AMPLIFIER} "${name}"`}
              </Tooltip> : `${i18n.AMPLIFIER} "${name}"`}>
              <Input.TextArea
                autoSize={{ maxRows: 3, minRows: 1 }}
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
