import React from 'react'
import PropTypes from 'prop-types'
import {
  FilterInput,
  Tree,
  data,
} from '@C4/CommonComponents'
import {
  getIdSymbols,
  getPartsSymbols,
} from '../../../Symbols'

import './styleList.css'
import i18n from '../../../../i18n'
import { objectIsFunction } from '../../../../utils/whatIsIt'

const renderItem = (itemProps) => {
  if (!itemProps.data.render) {
    return null
  }
  const render = objectIsFunction(itemProps.data.render)
    ? itemProps.data.render(itemProps.filter?.textFilter)
    : itemProps.data.render
  return <div className={'selection-tactical-symbol'}>
    <Tree.ExpandItem {...itemProps}>
      <div style={{ width: '100%' }} onClick={(e) => {
        if (!itemProps.data.selectable) {
          e.stopPropagation && e.stopPropagation()
        }
      }}>
        <Tree.HoverItem>
          {render}
        </Tree.HoverItem>
      </div>
    </Tree.ExpandItem>
  </div>
}

export default class SelectionTacticalSymbol extends React.Component {
  static propTypes = {
    code: PropTypes.string,
    type: PropTypes.number,
    name: PropTypes.string,
    attributes: PropTypes.object,
    coordinatesSize: PropTypes.number,
    onChange: PropTypes.func,
    onExitWithChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    readOnly: PropTypes.bool,
  }

  onChangeSymbol = (value, treeSymbols) => {
    if (!value || !treeSymbols) {
      return
    }
    const index = treeSymbols.findIndex((symbol) => symbol.id === value)
    if (index < 0 || !treeSymbols[index].parentID) {
      return null
    }
    const { onChange } = this.props
    onChange && onChange(treeSymbols[index].data)
  }

  render () {
    const {
      type,
      code,
      name = '',
      attributes,
      coordinatesSize,
    } = this.props
    if (!code) { // соответствие возможно только для тактического знака
      return null
    }
    const treeSymbols = getPartsSymbols(type, code, '')
    let id = null
    let symbols = null
    let thisSymbol
    const ids = getIdSymbols({ type, code, attributes, coordinatesSize }, '')

    if (ids.length === 0) { // нет совпадений
      thisSymbol = {
        id,
        name: `${name} *${i18n.NO_APPROPRIATE}*`,
        render: null,
      }
    } else if (ids.length === 1) { // однозначное соответствие
      id = ids[0].id
    } else { // множественное соответствие
      symbols = ids.map((symbol, index) => {
        return <Tree.HighlightItem
          key={symbol.id}
          data={symbol}
          filter={{ textFilter: data.TextFilter.create('') }}
          titleSelector={(symbol) => `${index + 1}. ${symbol.name}`}
          showTooltip={true}
        />
      })
      thisSymbol = {
        id,
        name: `${name} *${i18n.MANY_MATCH}*`,
        render: <div className={'compilation-list-first'}>
          <Tree.HighlightItem
            key={0}
            data={null}
            filter={{ textFilter: data.TextFilter.create('') }}
            titleSelector={() => 'Знайдені збіги:'}
            fullTitleSelector={() => 'Знайдені збіги умовного знака з переліком'}
            showTooltip={true}
          />
          {symbols}
        </div>,
      }
    }

    return (
      <div className={'symbol-container'}>
        <FilterInput
          values={thisSymbol ? [ thisSymbol, ...treeSymbols ] : treeSymbols}
          value={id}
          name={'id'}
          onChange={({ target: { value } }) => this.onChangeSymbol(value, treeSymbols)}
          listHeight={600}
          dropDownFitToParent={true}
          // opened={true}
        >
          {renderItem}
        </FilterInput>
      </div>
    )
  }
}
