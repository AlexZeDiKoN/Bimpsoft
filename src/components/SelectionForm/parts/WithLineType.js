import React from 'react'
import { Select } from 'antd'
import { components } from '@C4/CommonComponents'
import PropTypes from 'prop-types'
import i18n from '../../../i18n'
import * as ENTITY from '../../../components/WebMap/entityKind'
import { typeDiv, typeOption } from './render'

const { FormRow } = components.form

export const types = {
  solid: { text: i18n.SOLID, value: 'solid', simple: true },
  dashed: { text: i18n.DASHED, value: 'dashed', simple: true },
  chain: { text: i18n.CHAIN_LINE, value: 'chain', simple: true },
  waved: { text: `${i18n.WAVED} 1`, value: 'waved', simple: false },
  waved2: { text: `${i18n.WAVED} 2`, value: 'waved2', simple: false },
  stroked: { text: i18n.STROKED, value: 'stroked', simple: false },
  solidWithDots: { text: i18n.LINE_SOLID_WITH_DOTS, value: 'solidWithDots', simple: false },
  blockage: { text: i18n.LINE_BLOCKAGE, value: 'blockage', simple: false },
  blockageIsolation: { text: i18n.LINE_BLOCKAGE_ISOLATION, value: 'blockageIsolation', simple: false },
  moatAntiTankUnfin: { text: i18n.LINE_MOAT_ANTITANK_UNFIN, value: 'moatAntiTankUnfin', simple: false },
  moatAntiTank: { text: i18n.LINE_MOAT_ANTITANK, value: 'moatAntiTank', simple: false },
  moatAntiTankMine: { text: i18n.LINE_MOAT_ANTITANK_MINE, value: 'moatAntiTankMine', simple: false },
  blockageWire: { text: i18n.LINE_BLOCKAGE_WIRE, value: 'blockageWire', simple: false },
  blockageWire1: { text: i18n.LINE_BLOCKAGE_WIRE1, value: 'blockageWire1', simple: false },
  blockageWire2: { text: i18n.LINE_BLOCKAGE_WIRE2, value: 'blockageWire2', simple: false },
  blockageWireFence: { text: i18n.LINE_BLOCKAGE_WIRE_FENCE, value: 'blockageWireFence', simple: false },
  blockageWireLow: { text: i18n.LINE_BLOCKAGE_WIRE_LOW, value: 'blockageWireLow', simple: false },
  blockageWireHigh: { text: i18n.LINE_BLOCKAGE_WIRE_HIGH, value: 'blockageWireHigh', simple: false },
  blockageSpiral: { text: i18n.LINE_BLOCKAGE_SPIRAL, value: 'blockageSpiral', simple: false },
  blockageSpiral2: { text: i18n.LINE_BLOCKAGE_SPIRAL2, value: 'blockageSpiral2', simple: false },
  blockageSpiral3: { text: i18n.LINE_BLOCKAGE_SPIRAL3, value: 'blockageSpiral3', simple: false },
  rowMinesAntyTank: { text: i18n.LINE_MINES_ANTI_TANK, value: 'rowMinesAntyTank', simple: false },
  rowMinesLand: { text: i18n.LINE_MINES_LAND, value: 'rowMinesLand', simple: false },
  trenches: { text: i18n.LINE_BLOCKAGE_TRENCHES, value: 'trenches', simple: false },
}

export const TYPE_LINE_PATH = {
  solidWithDots: { d: `M0,8 h56 M4,14 h2 M10,14 h2 M16,14 h2 M22,14 h2 M28,14 h2 M34,14 h2 M40,14 h2 M46,14 h2 M52,14 h2`,
    fill: 'none' },
  stroked: { d: 'M0,16 h56 M4,16 v-8 M16,16 v-8 M28,16 v-8 M40,16 v-8 M52,16 v-8',
    fill: 'none' },
  waved: { d: 'M0,12 C0,0 16,0 16,12 C16,0 32,0 32,12 C32,0 48,0 48,12 C48,6 52,3 56,3',
    fill: 'none' },
  waved2: { d: 'M0,18 C0,6 16,6 16,18 C16,6 32,6 32,18 C32,6 48,6 48,18 C48,12 52,9 56,9',
    fill: 'none' },
  blockage: {
    d: 'M0,14 h4 l4,-12 l4,12 h8 l4,-12 l4,12 h8 l4,-12 l4,12 h8 l4,-12',
    fill: 'none' },
  blockageIsolation: { d: 'M0,14 h4 l4,-12 l4,12 h8 l4,-12 l4,12 h8 l4,-12 l4,12 h8 l4,-12 v12Z',
    fill: 'none' },
  moatAntiTankUnfin: {
    d: 'M0,19 l10,-18 l10,18 l10,-18 l10,18 l10,-18 l10,18 Z',
    fill: 'none' },
  moatAntiTank: {
    d: 'M0,19 l10,-18 l10,18 l10,-18 l10,18 l10,-18 l10,18 Z',
    fill: 'black' },
  moatAntiTankMine: {
    d: `M0,17 l8,-15 l8,15 l8,-15 l8,15  l8,-15 l8,15 l8,-15 l8,15Z M16,8 A3 3 0 1 1 16.01,8 M32,8 A3 3 0 1 1 32.01,8 M48,8 A3 3 0 1 1 48.01,8`,
    fill: 'black',
    strokeWidth: '1' },
  blockageWire: {
    d: 'M0,2 l6,12 M0,14 l6,-12 M16,2 l6,12 M16,14 l6,-12 M32,2 l6,12 M32,14 l6,-12 M48,2 l6,12 M48,14 l6,-12',
    fill: 'none' },
  blockageWire1: {
    d: 'M0,2 l6,12 M0,14 l6,-12 M25,2 l6,12 M25,14 l6,-12 M50,2 l6,12 M50,14 l6,-12 M0,8 h56',
    fill: 'none' },
  blockageWire2: {
    d: `M0,3 l6,10 M0,13 l6,-10 M8,3 l6,10 M8,13 l6,-10 M24,3 l6,10 M24,13 l6,-10 M32,3 l6,10 M32,13 l6,-10 M48,3 l6,10 M48,13 l6,-10 M0,8 h56`,
    fill: 'none' },
  blockageWireFence: {
    d: `M0,2 l6,12 M0,14 l6,-12 M16,2 l6,12 M16,14 l6,-12 M32,2 l6,12 M32,14 l6,-12 M48,2 l6,12 M48,14 l6,-12 M0,8 L56,8`,
    fill: 'none' },
  blockageWireLow: {
    d: `M0,3 l6,12 M0,15 l6,-12 M16,3 l6,12 M16,15 l6,-12 M32,3 l6,12 M32,15 l6,-12 M48,3 l6,12 M48,15 l6,-12 M0,16 L56,16`,
    fill: 'none' },
  blockageWireHigh: {
    d: `M0,3 l6,12 M0,15 l6,-12 M16,3 l6,12 M16,15 l6,-12 M32,3 l6,12 M32,15 l6,-12 M48,3 l6,12 M48,15 l6,-12 M0,16 L56,16 M0,2 L56,2`,
    fill: 'none' },
  blockageSpiral: {
    d: `M0,18 L56,18 M10,18 A5 8 0 1 1 10.01,18 M30,18 A5 8 0 1 1 30.01,18 M50,18 A5 8 0 1 1 50.01,18`,
    fill: 'none' },
  blockageSpiral2: {
    d: `M0,18 L56,18 M0,10 L56,10 M10,18 A5 8 0 1 1 10.01,18 M30,18 A5 8 0 1 1 30.01,18 M50,18 A5 8 0 1 1 50.01,18`,
    fill: 'none' },
  blockageSpiral3: {
    d: `M0,18 L56,18 M0,2 L56,2 M10,18 A5 8 0 1 1 10.01,18 M30,18 A5 8 0 1 1 30.01,18 M50,18 A5 8 0 1 1 50.01,18`,
    fill: 'none' },
  rowMinesAntyTank: {
    d: `M0,12 L56,12 M10,18 A6 6 0 1 1 10.01,18 M30,18 A6 6 0 1 1 30.01,18 M50,18 A6 6 0 1 1 50.01,18`,
    fill: 'black' },
  rowMinesLand: {
    d: `M0,12 L56,10 M10,18 A6 6 0 1 1 10.01,18 M30,18 A6 6 0 1 1 30.01,18 M50,18 A6 6 0 1 1 50.01,18  M8,8 l-6,-6 M12,8 l6,-6 M28,8 l-6,-6 M32,8 l6,-6 M48,8 l-6,-6 M52,8 l6,-6`,
    fill: 'black' },
  trenches: {
    d: 'M0,14 h4 v-10 h10 v10 h10 v-10 h10 v10 h10 v-10 h10 v10 h4',
    fill: 'none' } }

const TYPE_LIST = Object.values(types)

export const PATH_LINE_TYPE = [ 'attributes', 'lineType' ]

export const propTypes = {
  data: PropTypes.object,
}

const WithLineType = (Component) => class LineTypeComponent extends Component {
  static propTypes = propTypes

  lineTypeChangeHandler = (lineType) => this.setResult((result) => result.setIn(PATH_LINE_TYPE, lineType))

  renderLineType (simple = false) {
    const lineType = this.getResult().getIn(PATH_LINE_TYPE)
    const dataType = this.props.data?.type
    const typeInfo = types[lineType]
    const canEdit = this.isCanEdit()
    const value = canEdit
      ? (
        <Select
          value={lineType}
          className='line-type-select'
          dropdownClassName='line-type-dropdown'
          onChange={this.lineTypeChangeHandler}>
          {TYPE_LIST.map((type) => {
            if (ENTITY.GROUPS.AREAS.includes(dataType) && type.value === 'waved2') {
              return null
            }
            return type.simple || !simple
              ? typeOption(type.value, type.value, type.text)
              : null
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
