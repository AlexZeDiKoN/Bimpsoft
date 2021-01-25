import React from 'react'
import PropTypes from 'prop-types'
import { FilterInput, HighlightedText, Tree } from '@C4/CommonComponents'
import {
  getIdSymbols,
  getPartsSymbols,
} from '../../../Symbols'

import './styleList.css'
import i18n from '../../../../i18n'

// const NO_APPROPRIATE = '* немає відповідного тактичного знака *'
// const MANY_MATCH = '* множинний збіг тактичних знаків *' + i18n.ALL

const renderItem = (itemProps) => {
  return <Tree.ExpandItem {...itemProps}>
    <Tree.HoverItem>
      {itemProps.data.render}
    </Tree.HoverItem>
  </Tree.ExpandItem>
}

export default class SelectionTacticalSymbol extends React.Component {
  static propTypes = {
    code: PropTypes.string,
    type: PropTypes.number,
    name: PropTypes.string,
    attributes: PropTypes.object,
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
      return
    }
    const { onChange } = this.props
    onChange && onChange(treeSymbols[index].data)
  }

  render () {
    const { type, code, name = '', attributes } = this.props
    const treeSymbols = getPartsSymbols(type, '')
    let id = getIdSymbols({ type, code, attributes }, '')
    const nameSymbol = `${name} *${(id === undefined) ? i18n.MANY_MATCH : i18n.NO_APPROPRIATE}*`
    id = id || null
    const thisSymbol = id ? {}
      : {
        id,
        name: nameSymbol,
        render: <div className={'list'} >
          <HighlightedText text={nameSymbol}/>
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
        >
          {renderItem}
        </FilterInput>
      </div>
    )
  }
}
