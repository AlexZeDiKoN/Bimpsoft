import React, { Fragment, useState } from 'react'
import { Tooltip, Input } from 'antd'
import PropTypes from 'prop-types'
import { Collapse, Scrollbar, useToggleGroup } from '@DZVIN/CommonComponents'
import { MilSymbol } from '@DZVIN/MilSymbolEditor'
import { symbols } from '../../constants/symbols'
import './style.css'
import i18n from '../../i18n'
import spriteUrl from './sprite.svg'

const SymbolSvg = (props) => {
  const { name } = props
  return (
    <svg key={name}>
      <use xlinkHref={`${spriteUrl}#${name}`}/>
    </svg>
  )
}

// Для того, что бы работали иконки запустите команду npm run svg-sprite2
export default function SymbolsTab (props) {
  const { wrapper: Wrapper = Fragment, canEdit } = props
  const [ search, onChange ] = useState('')
  const sections = useToggleGroup()

  const dragStartHandler = (e, symbol) => {
    e.dataTransfer.setData('text', JSON.stringify({ type: 'symbol', ...symbol }))
  }

  const onChangeSearch = ({ target: { value } }) => {
    onChange(value)
  }

  const partsJSX = symbols.map((part, index) => {
    const sortedPart = (search !== '')
      ? part.children.filter((it) => it.hint.toLowerCase().includes(search.toLowerCase()) || it.code.includes(search))
      : part.children
    const symbolJSX = sortedPart.map((symbol) => {
      const { hint, code, amp } = symbol

      const elemToRender = (!amp.isSvg)
        ? <div
          onDragStart={canEdit ? (e) => dragStartHandler(e, symbol) : null}
          draggable={canEdit}
        >
          <MilSymbol
            code={code}
            amplifiers={amp}
            className={'symbol'}
          />
        </div>
        : <div
          className={'symbol'}
          draggable={canEdit}
        >
          <SymbolSvg
            name={`${code}`}
          />
        </div>

      return <Tooltip
        key={`${hint}${code}`}
        title={hint}
      >
        { elemToRender }
      </Tooltip>
    })

    return (sortedPart.length !== 0) && <div key={part.name} className={'collapseSection'}>
      <Collapse {...sections(index)}
        label={part.name}
        value={search !== ''}
      >
        <Scrollbar className={'symbol-container'}>
          { symbolJSX }
        </Scrollbar>
      </Collapse>
    </div>
  })

  return <Wrapper
    title={i18n.SYMBOLS}
  >
    <div className={'symbols-wrapper'}>
      <Input.Search
        placeholder={i18n.FILTER}
        onChange={onChangeSearch}
        value={search}
      />
      <Scrollbar className={'parts-container'}>
        {partsJSX}
      </Scrollbar>
    </div>
  </Wrapper>
}

SymbolsTab.propTypes = {
  canEdit: PropTypes.bool,
  wrapper: PropTypes.any,
}

SymbolSvg.propTypes = {
  name: PropTypes.string.isRequired,
}
