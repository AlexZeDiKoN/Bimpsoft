import React from 'react'
import { Input } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'

const { FormRow } = components.form

const PAIRS = {
  TOP: { id: 'top', name: 'T' },
  MIDDLE: { id: 'middle', name: 'N' },
  BOTTOM: { id: 'bottom', name: 'W' },
}

const PATH = [ 'attributes', 'pointAmplifiers' ]

const WithPointAmplifiers = (Component) => class PointAmplifiersComponent extends Component {
  createPointAmplifierHandler = (id) => (event) => (
    this.setResult((result) => result.setIn([ ...PATH, id ], event.target.value))
  )

  renderPointAmplifiers () {
    const state = this.getResult()
    const currentValue = state.getIn(PATH)
    const canEdit = this.isCanEdit()

    return (
      <div className="line-container__item">
        {Object.values(PAIRS).map(({ id, name }) => (
          <div className="line-container__itemWidth" key={id}>
            <FormRow label={`${i18n.AMPLIFIER} "${name}"`}>
              <Input
                value={currentValue[id]}
                onChange={this.createPointAmplifierHandler(id)}
                disabled={!canEdit}
              />
            </FormRow>
          </div>
        ))}
      </div>
    )
  }
}

export default WithPointAmplifiers
