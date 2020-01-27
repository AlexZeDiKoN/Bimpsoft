import React from 'react'
import { Select } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import { typeDiv, typeOption } from './render'

const { FormRow } = components.form

export const types = {
  solid: { text: i18n.SOLID, value: 'solid', simple: true },
  dashed: { text: i18n.DASHED, value: 'dashed', simple: true },
  waved: { text: i18n.WAVED, value: 'waved', simple: false },
  waved2: { text: `${i18n.WAVED} 2`, value: 'waved2', simple: false },
  stroked: { text: i18n.STROKED, value: 'stroked', simple: false },
}

const TYPE_LIST = Object.values(types)

export const PATH = [ 'attributes', 'lineType' ]

const WithLineType = (Component) => class LineTypeComponent extends Component {
  lineTypeChangeHandler = (lineType) => this.setResult((result) => result.setIn(PATH, lineType))

  renderLineType (simple = false) {
    const lineType = this.getResult().getIn(PATH)
    const typeInfo = types[lineType]
    const canEdit = this.isCanEdit()
    const value = canEdit
      ? (
        <Select value={lineType} onChange={this.lineTypeChangeHandler}>
          {TYPE_LIST.map((type) => {
            if (type.simple || !simple) {
              return typeOption(type.value, type.value, type.text)
            }
          }).filter(Boolean)}
        </Select>
      )
      : typeDiv(typeInfo.value, typeInfo.text)

    return (
      <FormRow label={i18n.LINE_TYPE}>
        {value}
      </FormRow>
    )
  }
}

export default WithLineType
