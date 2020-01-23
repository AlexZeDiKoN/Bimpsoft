import React, { Fragment } from 'react'
import { Tooltip } from 'antd'
import { CollapseSection, Scrollbar } from '@DZVIN/CommonComponents'
import { MilSymbol } from '@DZVIN/MilSymbolEditor'
import { symbols, amps } from '../../constants/symbols'
import './style.css'
import spriteUrl from './sprite.svg'

const SymbolSvg = (props) => {
  const { name } = props
  return (
    <svg key={name}>
      <use xlinkHref={`${spriteUrl}#${name}`}/>
    </svg>
  )
}

export default function SymbolsTab (props) {
  const { wrapper: Wrapper = Fragment } = props
  const partsJSX = symbols.map((part) => {
    const symbolJSX = part.children.map((symbol) => {
      const { hint, code, amp } = symbol
      const elemToRender = (hint && code && !(amp.isSvg || amp[amps.N] || amp[amps.T]))
        ? <MilSymbol
          code={code}
          amplifiers={amp}
          className={'symbol'}
        />
        : (code && amp.isSvg)
          ? <div className={'symbol'}><SymbolSvg
            name={`${code}`}
          /></div>
          : <div
            style={ { backgroundColor: 'blue' } }
            className={'symbol'}
          >
          Тут буде лінія
          </div>

      return <Tooltip
        key={`${hint}${code}`}
        title={hint}
      >
        { elemToRender }
      </Tooltip>
    })

    return <div key={part.name}>
      <CollapseSection
        label={part.name}
      >
        <Scrollbar className={'symbol-container'}>
          { symbolJSX }
        </Scrollbar>
      </CollapseSection>
    </div>
  })

  return <Wrapper
    title={'Умовні Знаки'}
  >
    <Scrollbar className={'parts-container'}>
      {partsJSX}
    </Scrollbar>
  </Wrapper>
}
