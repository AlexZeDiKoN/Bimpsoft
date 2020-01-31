import React, { Fragment } from 'react'
import { Tooltip } from 'antd'
import PropTypes from 'prop-types'
import { Collapse, Scrollbar, useToggleGroup  } from '@DZVIN/CommonComponents'
import { MilSymbol } from '@DZVIN/MilSymbolEditor'
import { symbols } from '../../constants/symbols'
import './style.css'
import { SYMBOLS } from '../../i18n/ua'
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
  const sections = useToggleGroup()

  const dragStartHandler = (e, symbol) => {
    e.dataTransfer.setData('text', JSON.stringify({ type: 'symbol', ...symbol }))
  }

  const partsJSX = symbols.map((part, index) => {
    const symbolJSX = part.children.map((symbol) => {
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

    return <div key={part.name} className={'collapseSection'}>
      <Collapse {...sections(index)}
        label={part.name}
      >
        <Scrollbar className={'symbol-container'}>
          { symbolJSX }
        </Scrollbar>
      </Collapse>
    </div>
  })

  return <Wrapper
    title={SYMBOLS}
  >
    <Scrollbar className={'parts-container'}>
      {partsJSX}
    </Scrollbar>
  </Wrapper>
}

SymbolsTab.propTypes = {
  canEdit: PropTypes.bool,
  wrapper: PropTypes.any,
}

SymbolSvg.propTypes = {
  name: PropTypes.string.isRequired,
}
