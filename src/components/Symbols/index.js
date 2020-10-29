import React, { useState } from 'react'
import { Tooltip } from 'antd'
import PropTypes from 'prop-types'
import {
  Collapse,
  Scrollbar,
  useToggleGroup,
  ButtonTypes,
  ColorTypes,
  IButton,
  IconNames,
  FormBlock,
  HighlightedText,
  data,
} from '@DZVIN/CommonComponents'
import { MilSymbol } from '@DZVIN/MilSymbolEditor'
import { symbols } from '../../constants/symbols'
import './style.css'
import i18n from '../../i18n'
import { InputButton } from '../common'
import { MOUSE_ENTER_DELAY } from '../../constants/tooltip'
import spriteUrl from './sprite.svg'

const SymbolSvg = (props) => {
  const { name } = props
  return (
    <svg key={name}>
      <use xlinkHref={`${spriteUrl}#${name}`}/>
    </svg>
  )
}

const ButtonComponent = (props) =>
  <Collapse.Button {...props} active={false}>
    <Tooltip
      mouseEnterDelay={MOUSE_ENTER_DELAY}
      title={props?.children}
      placement='left'
      className={props?.value ? 'symbols-title symbols-title-opened' : 'symbols-title'}
    >
      {props?.children}
    </Tooltip>
  </Collapse.Button>

// Для того, что бы работали иконки запустите команду npm run svg-sprite2
const SymbolsTab = (props) => {
  const { canEdit } = props
  const [ search, onChange ] = useState('')
  const [ listMode, setListMode ] = useState(false)
  const sections = useToggleGroup()

  const dragStartHandler = (e, symbol, type) => {
    e.dataTransfer.setData('text', JSON.stringify({ type, ...symbol }))
  }

  const onChangeSearch = (value) => {
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
          className={listMode ? 'list' : ''}
          onDragStart={canEdit ? (e) => dragStartHandler(e, symbol, 'symbol') : null}
          draggable={canEdit}
        >
          {listMode ? <> <MilSymbol
            code={code}
            amplifiers={amp}
            className={'symbol'}
          /><div>{hint}</div></>
            : <MilSymbol
              code={code}
              amplifiers={amp}
              className={'symbol'}
            />}
        </div>
        : <div
          className={listMode ? 'list' : 'symbol'}
          draggable={canEdit}
          onDragStart={canEdit ? (e) => dragStartHandler(e, symbol, 'line') : null}
        >
          {listMode ? <>
            <div className='symbol'>
              <SymbolSvg
                name={`${code}`}
              />
            </div>
            <div><HighlightedText text={hint} textFilter={data.TextFilter.create(search)}/></div>
          </>
            : <SymbolSvg
              name={`${code}`}
            />}
        </div>

      return <Tooltip
        key={`${hint}${code}`}
        mouseEnterDelay={MOUSE_ENTER_DELAY}
        title={!listMode && <HighlightedText text={hint} textFilter={data.TextFilter.create(search)}/>}
      >
        { elemToRender }
      </Tooltip>
    })

    const value = (search !== '') ? { value: true } : {}

    return (sortedPart.length !== 0) &&
      <div
        key={part.name}
        className={search !== '' ? 'collapseSection collapseSectionFiltered' : 'collapseSection'}
      >
        <FormBlock vertical>
          <Collapse
            {...sections(index)}
            ButtonComponent={ButtonComponent}
            label={<span className={'symbols-title'}>
              <HighlightedText
                text={part.name}
                textFilter={data.TextFilter.create(search)}
              />
            </span>}
            {...value}
          >
            <Scrollbar className={listMode ? 'symbol-container-nowrap symbol-container' : 'symbol-container'}>
              { symbolJSX }
            </Scrollbar>
          </Collapse>
        </FormBlock>
      </div>
  })

  return (
    <div className='symbols-wrapper'>
      <div className='symbols-header'>
        <InputButton
          onChange={onChangeSearch}
          initValue={search}
          title={i18n.SYMBOLS}
        />
        <Tooltip title={i18n.GRID} mouseEnterDelay={MOUSE_ENTER_DELAY}>
          <IButton
            active={!listMode}
            type={ButtonTypes.WITH_BG}
            colorType={ColorTypes.WHITE}
            onClick={() => setListMode(false)}
            icon={IconNames.GRID}/>
        </Tooltip>
        <Tooltip title={i18n.LIST} mouseEnterDelay={MOUSE_ENTER_DELAY}>
          <IButton
            active={listMode}
            type={ButtonTypes.WITH_BG}
            colorType={ColorTypes.WHITE}
            onClick={() => setListMode(true)}
            icon={IconNames.LIST}/>
        </Tooltip>
      </div>
      <Scrollbar className='parts-container'>
        {partsJSX}
      </Scrollbar>
    </div>
  )
}

SymbolsTab.propTypes = {
  canEdit: PropTypes.bool,
}

SymbolsTab.displayName = 'SymbolsTab'

SymbolSvg.propTypes = {
  name: PropTypes.string.isRequired,
}

export default SymbolsTab
