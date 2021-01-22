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
} from '@C4/CommonComponents'
import { MilSymbol } from '@C4/MilSymbolEditor'
import { symbols } from '../../constants/symbols'
import './style.css'
import i18n from '../../i18n'
import { InputButton } from '../common'
import { MOUSE_ENTER_DELAY } from '../../constants/tooltip'
import entityKind from '../WebMap/entityKind'
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

// определение id в списке тактических знаков по заданым условиям
// если заданы атрибуты(амплификаторы), то будет жесткая проверка соответствия знака с учетом амплификаторов
// Настройка игнорирования полей в коде знака
// 4 символ "Принадлежность"
// 7 символ "Стан"
// 8 символ кода биты [ 0, 2 ] - "Макет/хибній", "Угруповання"
const maskIgnore = [ 0, 0, 0, 7, 0, 0, 7, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
const isMatchCode = (code1, code2) => {
  if (code1.length !== code2.length || code1.length !== 20) {
    return false
  }
  for (let i = 0; i < code1.length; i++) {
    if (maskIgnore[i]) {
      const number1 = parseInt(code1[i], 10)
      const number2 = parseInt(code2[i], 10)
      if (isNaN(number1) || isNaN(number2) || ((number1 ^ number2) & ~maskIgnore[i])) {
        return false
      }
    } else if (code1[i] !== code2[i]) {
      return false
    }
  }
  return true
}

export const getIdSymbols = (searchTerms, searchFilter) => {
  const { code, attributes: amp } = searchTerms
  let id = null
  if (code) {
    symbols.findIndex((parent, indexParent) => {
      const sortedPart = (searchFilter && searchFilter !== '')
        ? parent.children.filter((it) => {
          return it.hint.toLowerCase().includes(searchFilter.toLowerCase()) || it.code.includes(searchFilter)
        })
        : parent.children
      const index = sortedPart.findIndex((children) => {
        if (isMatchCode(children.code, code)) {
          if (amp && children.amp) {
            // перебор предустановленных амплификаторов тактического знака
            for (const key in children.amp) {
              // eslint-disable-next-line no-prototype-builtins
              if (!children.amp.hasOwnProperty(key) || !amp.hasOwnProperty(key) || children.amp[key] !== amp[key]) {
                return false
              }
            }
          }
          return true
        }
        return false
      })
      if (index < 0) {
        return false
      }
      id = `${indexParent}_${index}`
      return true
    })
  }
  return id
}

// сборка списка тектических знаков
export const getPartsSymbols = (type, search) => {
  return symbols.map((part, indexParent) => {
    const sortedPart = (search !== '')
      ? part.children.filter((it) => it.hint.toLowerCase().includes(search.toLowerCase()) || it.code.includes(search))
      : part.children

    const parentToRender =
      <div className={'list'} >
        {<HighlightedText text={part.name} textFilter={data.TextFilter.create(search)}/>}
      </div>

    const parent = {
      id: `${indexParent}`,
      name: part.name,
      render: parentToRender,
    }

    const symbolJSX = sortedPart.map((symbol, index) => {
      const { hint, code, amp } = symbol

      // фильтрация по типу знака
      if ((amp.isSvg && amp.type !== type) || (type !== entityKind.POINT && !amp.isSvg)) {
        return null
      }
      const elemToRender =
        <div className={'list'} >
          {(!amp.isSvg)
            ? <>
              <MilSymbol
                code={code}
                amplifiers={amp}
                className={'symbol'}
              />
              <div>{<HighlightedText text={hint} textFilter={data.TextFilter.create(search)}/>}</div>
            </>
            : <>
              <div className='symbol'>
                <SymbolSvg
                  name={`${code}`}
                />
              </div>
              <div><HighlightedText text={hint} textFilter={data.TextFilter.create(search)}/></div>
            </>
          }
        </div>

      return {
        id: `${indexParent}_${index}`,
        name: hint,
        parentID: `${indexParent}`,
        data: JSON.stringify(symbol),
        render: elemToRender,
      }
    }).filter(Boolean)

    return [ parent, symbolJSX ]
  }).flat(Infinity)
}

// Для того, что бы работали иконки запустите команду npm run svg-sprite2
const SymbolsTab = (props) => {
  const { canEdit, listModeOnly = false } = props
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
          className={(listMode || listModeOnly) ? 'list' : ''}
          onDragStart={canEdit ? (e) => dragStartHandler(e, symbol, 'symbol') : null}
          draggable={canEdit}
        >
          {(listMode || listModeOnly) ? <> <MilSymbol
            code={code}
            amplifiers={amp}
            className={'symbol'}
          /><div>{<HighlightedText text={hint} textFilter={data.TextFilter.create(search)}/>}</div></>
            : <MilSymbol
              code={code}
              amplifiers={amp}
              className={'symbol'}
            />}
        </div>
        : <div
          className={(listMode || listModeOnly) ? 'list' : 'symbol'}
          draggable={canEdit}
          onDragStart={canEdit ? (e) => dragStartHandler(e, symbol, 'line') : null}
        >
          {(listMode || listModeOnly) ? <>
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
            <Scrollbar className={
              (listMode || listModeOnly) ? 'symbol-container-nowrap symbol-container' : 'symbol-container'
            }>
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
        {!listModeOnly && <>
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
        </>}
      </div>
      <Scrollbar className='parts-container'>
        {partsJSX}
      </Scrollbar>
    </div>
  )
}

SymbolsTab.propTypes = {
  canEdit: PropTypes.bool,
  listModeOnly: PropTypes.bool,
}

SymbolsTab.displayName = 'SymbolsTab'

SymbolSvg.propTypes = {
  name: PropTypes.string.isRequired,
}

ButtonComponent.propTypes = {
  children: PropTypes.string.isRequired,
  value: PropTypes.bool,
}

export default SymbolsTab
