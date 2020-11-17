import React from 'react'
import { Select } from 'antd'
import { components } from '@C4/CommonComponents'
import { MilSymbol } from '@C4/MilSymbolEditor'
import i18n from '../../../i18n'
import { MINE_TYPES as mt, CODE_MINE_TYPES } from '../../../constants/symbols'
// import { optionsSvg } from './render'
const { Option } = Select

const { FormRow } = components.form

const types = {
  [mt.ANTI_TANK]: { text: i18n.MINE_ANTI_TANK, value: mt.ANTI_TANK },
  [mt.ANTI_PERSONNEL]: { text: i18n.MINE_ANTI_PERSONNEL, value: mt.ANTI_PERSONNEL },
  [mt.UNDEFINED_TYPE]: { text: i18n.MINE_UNDEFINED_TYPE, value: mt.UNDEFINED_TYPE },
  [mt.VARIOUS_TYPES]: { text: i18n.MINE_VARIOUS_TYPES, value: mt.VARIOUS_TYPES },
  [mt.MARINE]: { text: i18n.MINE_MARINE, value: mt.MARINE },
  [mt.MARINE_BOTTOM]: { text: i18n.MINE_MARINE_BOTTOM, value: mt.MARINE_BOTTOM },
  [mt.MARINE_ANCHORS]: { text: i18n.MINE_MARINE_ANCHORS, value: mt.MARINE_ANCHORS },
}

const TYPE_LIST = Object.values(types)

export const PATH = [ 'attributes', 'params' ]
export const PATH_TYPE = [ 'attributes', 'params', 'mineType' ]

const WithMineType = (Component) => class MineTypeComponent extends Component {
  mineTypeChangeHandler = (mineType) => this.setResult((result) => result.updateIn(PATH, (params) => {
    return { ...params, mineType }
  }))

  renderMineType (simple = false) {
    const params = this.getResult().getIn(PATH)
    const mineType = params.mineType ?? mt.UNDEFINED_TYPE
    const typeInfo = types[mineType]
    const canEdit = this.isCanEdit()
    const SIZE = (typeInfo < mt.MARINE) ? 24 : 22
    const value = canEdit
      ? (
        <Select value={mineType} onChange={this.mineTypeChangeHandler}>
          {TYPE_LIST.map((type) => {
            return type.simple || !simple
              ? <Option key={type.value} value={type.value}>
                <div className="icon-option">
                  <MilSymbol
                    code={CODE_MINE_TYPES[type.value]}
                    amplifiers={{ size: SIZE }}
                  />
                  <div className="icon-text">{type.text}</div>
                </div>
              </Option> : null
          }).filter(Boolean)}
        </Select>
      )
      : (<div className="icon-option">
        <MilSymbol
          code={CODE_MINE_TYPES[mineType]}
          amplifiers={{ size: SIZE }}
          className={'symbol'}
        />
        <div className="icon-text">{typeInfo.text}</div>
      </div>)
    return (
      <FormRow label={i18n.MINE_TYPE}>
        {value}
      </FormRow>
    )
  }
}

export default WithMineType
