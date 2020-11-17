import React from 'react'
import { Input, Tooltip } from 'antd'
import { components } from '@C4/CommonComponents'
import i18n from '../../../i18n'
import { MAX_LENGTH_TEXT, MAX_ROW } from '../../../constants/InputText'
import { MOUSE_ENTER_DELAY } from '../../../constants/tooltip'

const { FormRow } = components.form

const PAIRS = {
  TOP: { id: 'top', name: 'T' },
  MIDDLE: { id: 'middle', name: 'N' },
  BOTTOM: { id: 'bottom', name: 'W' },
}

const PAIR_LIST = Object.values(PAIRS)

const PATH = [ 'attributes', 'pointAmplifier' ]

const WithPointAmplifiers = (Component) => class PointAmplifiersComponent extends Component {
  createPointAmplifierHandler = (id) => (event) => {
    const strs = event.target.value.split('\n')
    if (strs.length > MAX_ROW.POINT_AMP) {
      return
    }
    return this.setResult((result) => result.setIn([ ...PATH, id ], event.target.value))
  }

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
                mouseEnterDelay={MOUSE_ENTER_DELAY}
                placement={'left'}
                title={() => svg}>
                {`${i18n.AMPLIFIER} "${name}"`}
              </Tooltip> : `${i18n.AMPLIFIER} "${name}"`}>
              <Input.TextArea
                autoSize={{ maxRows: 3 }}
                value={currentValue[id] ?? ''}
                onChange={this.createPointAmplifierHandler(id)}
                className={!canEdit ? 'modals-input-disabled' : ''}
                readOnly={!canEdit}
                rows={1}
                maxLength={MAX_LENGTH_TEXT.TEXTAREA}
              />
            </FormRow>
          </div>
        ))}
      </div>
    )
  }
}

export default WithPointAmplifiers
