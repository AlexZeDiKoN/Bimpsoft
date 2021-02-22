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
    const ids = getIdSymbols({ type, code, attributes, coordinatesSize }, '')
    let nameSymbol
    if (ids.length === 0) {
      nameSymbol = `${name} *${i18n.NO_APPROPRIATE}*`
    } else if (ids.length !== 1) {
      nameSymbol = `${name} *${i18n.MANY_MATCH}*`
      symbols = ids.map((symbol) => {
        return <Tree.HighlightItem
          key={symbol.id}
          data={symbol}
          filter={{ textFilter: data.TextFilter.create('') }}
          titleSelector={(symbol) => symbol.name}
          showTooltip={true}
        />
      })
    } else {
      id = ids[0].id
    }
    const thisSymbol = id ? {}
      : {
        id,
        name: nameSymbol,
        render: <div className={'compilation-list-first'}>
          {symbols}
        </div>,
      }
    return (
      <div className={'symbol-container'}>
        <FilterInput
          values={id ? treeSymbols : [ thisSymbol, ...treeSymbols ]}
          value={id}
          name={'id'}
          onChange={({ target: { value } }) => this.onChangeSymbol(value, treeSymbols)}
          listHeight={600}
          dropDownFitToParent={true}
          opened={true}
        >
          {renderItem}
        </FilterInput>
      </div>
    )
  }
}
