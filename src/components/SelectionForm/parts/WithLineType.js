import React from 'react'
import { Select } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import { typeDiv, typeOption } from './render'
const { names: iconNames, IconButton } = components.icons

const { FormRow } = components.form
const TYPE_SOLID = 'solid'
const TYPE_DASHED = 'dashed'
const TYPE_WAVED = 'waved'
const TYPE_STROKED = 'stroked'

const types = {
  [TYPE_SOLID]: { text: i18n.SOLID, value: 'solid' },
  [TYPE_DASHED]: { text: i18n.DASHED, value: 'dashed' },
  [TYPE_WAVED]: { text: i18n.WAVED, value: 'waved' },
  [TYPE_STROKED]: { text: i18n.STROKED, value: 'stroked' },
}

const PATH = [ 'attributes', 'lineType' ]

const WithLineType = (Component) => class LineTypeComponent extends Component {
  lineTypeChangeHandler = (lineType) => this.setResult((result) => result.setIn(PATH, lineType))

  renderLineType (simple = false) {
    const lineType = this.getResult().getIn(PATH)
    const typeInfo = types[lineType]
    const canEdit = this.isCanEdit()

    const value = canEdit
      ? (
        <>
        <Select value={ lineType } showArrow={false} onChange={this.lineTypeChangeHandler}>
          {typeOption(TYPE_SOLID, 'solid', i18n.SOLID)}
          {typeOption(TYPE_DASHED, 'dashed', i18n.DASHED)}
          {!simple && typeOption(TYPE_WAVED, 'waved', i18n.WAVED)}
          {!simple && typeOption(TYPE_STROKED, 'stroked', i18n.STROKED)}
        </Select>
        <IconButton
          className="icon-button-more"
          icon={iconNames.MORE_WHITE_DEFAULT}
        />
        </>
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
