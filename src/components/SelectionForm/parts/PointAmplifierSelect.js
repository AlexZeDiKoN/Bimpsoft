import React from 'react'
import { Input } from 'antd'
import { components } from '@C4/CommonComponents'
// import { Map } from 'immutable'
// import { PointInfo } from '../../../store/reducers/webMap.js'
import i18n from '../../../i18n'

const { FormRow } = components.form

// const PAIRS = {
//   TOP: { id: 'top', name: 'T' },
//   MIDDLE: { id: 'middle', name: 'N' },
//   BOTTOM: { id: 'bottom', name: 'W' },
// }

// const PAIR_LIST = Object.values(PAIRS)

const PATH_S_INFO = [ 'attributes', 'sectorsInfo' ]

const PointAmplifierSelect = (Component) => class PointAmplifierSelectComponent extends Component {
  createAmplifierSelectHandler = (index) => ({ target: { name, value } }) => {
    this.setResult((result) => {
      result = result.updateIn([ ...PATH_S_INFO, index ],
        (sectorsInfo) => Object.assign({}, sectorsInfo, { [name]: value }))
      return result
    })
  }

  createAmplifierShowerHandler = (path, index) => () => this.setResult((result) =>
    result.updateIn(path, (showedSet) =>
      showedSet.has(index) ? showedSet.delete(index) : showedSet.add(index),
    ),
  )

  renderPointAmplifierSelect () {
    const canEdit = this.isCanEdit()
    const formStore = this.getResult()
    const name = 'T'
    const id = 'p0'
    const sectorInfo = formStore.getIn([ ...PATH_S_INFO, id ])
    const amplifierT = sectorInfo?.amplifier || ''
    return (
      <div className="line-container__item">
        <div className="line-container__itemWidth" key={id}>
          <FormRow label={`${i18n.AMPLIFIER} «${name}»`}>
            <Input.TextArea
              value={amplifierT}
              name={'amplifier'}
              onChange={this.createAmplifierSelectHandler(id)}
              disabled={!canEdit}
              rows={1}
            />
          </FormRow>
        </div>
      </div>
    )
  }
}

export default PointAmplifierSelect
