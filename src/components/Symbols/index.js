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
import {
  symbols,
  amps,
  directionAmps,
} from '../../constants/symbols'
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
// Для области проверяем следующие атрибуты со возможными значениями по умолчанию
const allAmpsDefault = {
  [amps.T]: [ null, '' ],
  [amps.N]: [ null, '' ],
  [amps.W]: [ null, '' ],
}

const isMatchAttr = (attr1, attr2) => {
  if (Array.isArray(attr1)) {
    return attr1.some((value) => value === attr2)
  }
  if (Object.prototype.toString.call(attr1) === '[object Object]' &&
    Object.prototype.toString.call(attr2) === '[object Object]') {
    for (const key of Object.keys(attr1)) {
      // eslint-disable-next-line no-prototype-builtins
      if (!attr2.hasOwnProperty(key)) {
        return false
      }
      if (!isMatchAttr(attr1[key], attr2[key])) {
        return false
      }
    }
    return true
  }
  return false
}
//
// Для точечного знака
// если заданы атрибуты(амплификаторы), то будет жесткая проверка соответствия знака с учетом амплификаторов
// Настройка игнорирования полей в коде знака
// 4 символ "Принадлежность"
// 7 символ "Стан"
// 8 символ кода биты [ 0, 1, 2 ] - "Макет/хибній", "Пункт управління", "Угруповання"
const maskIgnore = [ 0, 0, 0, 7, 0, 0, 7, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
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

// поиск соответствующего тактического знака в справочном перечне тактических знаков
export const getIdSymbols = (searchTerms, searchFilter) => {
  const { code, attributes: amp, type } = searchTerms
  if (!code || !amp) {
    return null
  }
  let id = null
  const isTwoResults = symbols.some((parent, indexParent) => {
    // фильтрация тактических знаков в разделе по заданому фильтру, если он есть
    const sortedPart = (searchFilter && searchFilter !== '')
      ? parent.children.filter((it) => {
        return it.hint.toLowerCase().includes(searchFilter.toLowerCase()) || it.code.includes(searchFilter)
      })
      : parent.children
    // перебор элементов раздела
    return sortedPart.some((children, index) => {
      switch (type) {
        case entityKind.POINT: {
          if (!isMatchCode(children.code, code)) {
            return false // Коды не совпали
          }
          if (children.amp) {
            // перебор предустановленных амплификаторов тактического знака
            for (const key of Object.keys(children.amp)) {
              // eslint-disable-next-line no-prototype-builtins
              if (!amp.hasOwnProperty(key) || children.amp[key] !== amp[key]) {
                return false
              }
            }
          }
          break
        }
        case entityKind.RECTANGLE:
        case entityKind.POLYGON:
        case entityKind.AREA: {
          if (children.code !== code || !children.isSvg) {
            return false // Коды не совпали или это точечный знак
          }
          if (children.amp) {
            // установка возможных аттриутов для знака из перечня
            const buildAmps = {
              lineType: [ 'solid' ],
              fill: [ 'transparent', 'app6_transparent' ],
              hatch: [ 'none' ],
              pointAmplifier: { ...allAmpsDefault },
              intermediateAmplifier: { ...allAmpsDefault },
              intermediateAmplifierType: [ 'none' ],
              nodalPointIcon: [ 'none' ],
              direction: [ '' ],
              directionIntermediateAmplifier: [ directionAmps.ACROSS_LINE, '', null ],
            }
            const initialAmp = { ...children.amp }
            // перебор предустановленных амплификаторов тактического знака
            for (const key of Object.keys(initialAmp)) {
              if (Object.prototype.toString.call(initialAmp[key]) === '[object Object]') {
                const amplifiers = initialAmp[key]
                for (const key2 of Object.keys(amplifiers)) {
                  buildAmps[key][key2] = [ amplifiers[key2] ]
                }
              } else {
                buildAmps[key] = [ initialAmp[key] ]
              }
            }
            // сравнение тактических знаков
            for (const key of Object.keys(buildAmps)) {
              // eslint-disable-next-line no-prototype-builtins
              if (!amp.hasOwnProperty(key)) {
                return false // для сравнени не хватает атрибутов
              }
              if (!isMatchAttr(buildAmps[key], amp[key])) {
                console.log('!==', { build: buildAmps[key], amp: amp[key] })
                return false // не соответствие аттрибутов тактических знаков
              }
            }
          }
          break
        }
        case entityKind.SOPHISTICATED: {
          if (children.code !== code || !children.isSvg) {
            return false // Коды не совпали или это точечный знак
          }
          break
        }
        default: return false
      }
      if (id) {
        return true // имеем более одного совпадения, прекращаем перебор перечня
      }
      id = `${indexParent}_${index}`
      return false // продолжаем поиск
    })
  })
  if (isTwoResults) {
    return undefined // множественное совпадение
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
      const { hint, code, isSvg, amp } = symbol

      // фильтрация по типу знака
      if ((isSvg && amp.type !== type) || (type !== entityKind.POINT && !isSvg)) {
        return null
      }
      const elemToRender =
        <div className={'list'} >
          {(!isSvg)
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
      const { hint, code, isSvg, amp } = symbol

      const elemToRender = (!isSvg)
        ? <div
          className={listMode ? 'list' : ''}
          onDragStart={canEdit ? (e) => dragStartHandler(e, symbol, 'symbol') : null}
          draggable={canEdit}
        >
          {listMode ? <> <MilSymbol
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

ButtonComponent.propTypes = {
  children: PropTypes.string.isRequired,
  value: PropTypes.bool,
}

export default SymbolsTab
