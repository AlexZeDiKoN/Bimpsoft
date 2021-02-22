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
  Tree,
} from '@C4/CommonComponents'
import { MilSymbol } from '@C4/MilSymbolEditor'
import {
  List,
  Record,
  Set,
} from 'immutable'
import {
  symbols,
  directionAmps,
  CompatibilityTacticalSymbol,
} from '../../constants/symbols'
import './style.css'
import i18n from '../../i18n'
import { InputButton } from '../common'
import { MOUSE_ENTER_DELAY } from '../../constants/tooltip'
import entityKind from '../WebMap/entityKind'
import { extractLineCode } from '../WebMap/patch/Sophisticated/utils'
import {
  colors,
  shortcuts,
} from '../../constants'
import { objectIsObject } from '../../utils/whatIsIt'
import { BlockHotKeyContainer } from '../common/HotKeys'
import { evaluateColor } from '../../constants/colors'
import { STATUSES } from '../SelectionForm/parts/WithStatus'
import { LineAmplifier } from '../../store/reducers/webMap'
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

// определение id в списке тактических знаков по заданым условиям ------------------------------------
// Проверяем атрибуты с возможными значениями по умолчанию

const isMatchAttr = (attr1, attr2) => {
  if (List.isList(attr1)) { // по умолчанию возможны варианты
    return attr1.includes(attr2)
  }
  if (Array.isArray(attr1)) {
    if (!Array.isArray(attr2) || attr1.length !== attr2.length) {
      return false
    }
    // сравниваем массивы, значения должны быть в обоих массивах
    for (let ind = 0; ind < attr1.length; ind++) {
      if (attr2.indexOf(attr1[ind]) < 0) {
        return false
      }
    }
    return true
  }

  if (objectIsObject(attr1) && objectIsObject(attr2)) {
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
  return attr1 === attr2 || (
    (attr1 === null || attr1 === undefined || attr1 === '') &&
    (attr2 === null || attr2 === undefined || attr2 === '')
  )
}
//
// Для точечного знака
// если заданы атрибуты(амплификаторы), то будет жесткая проверка соответствия знака с учетом амплификаторов
// Настройка игнорирования полей в коде знака
// 4 символ "Принадлежность"
// 7 символ "Стан"
// 8 символ кода биты [ 0, 1, 2 ] - "Макет/хибній", "Пункт управління", "Угруповання"
const maskIgnore = [ 0, 0, 0, 7, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
const isMatchCode = (code1, code2, isPoint = false) => {
  let maxIndex = 20
  if (isPoint) {
    if (code1.length !== code2.length || code1.length !== 20) {
      return false
    }
  } else {
    maxIndex = Math.min(code1.length, code2.length, 20) || 0
  }
  for (let i = 0; i < maxIndex; i++) {
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

const attributesInitValues = {
  // name: null,
  // template: '',
  // color: evaluateColor(colors.BLACK),
  fill: colors.TRANSPARENT,
  lineType: 'solid',
  // strokeWidth: LINE_WIDTH,
  hatch: 'none',
  intermediateAmplifierType: 'none',
  intermediateAmplifier: LineAmplifier(),
  directionIntermediateAmplifier: directionAmps.ACROSS_LINE,
  shownIntermediateAmplifiers: Set(),
  shownNodalPointAmplifiers: Set(),
  pointAmplifier: LineAmplifier(),
  textAmplifiers: {},
  // sectorsInfo: List(),
  params: {},
  left: 'none',
  right: 'none',
  nodalPointIcon: 'none',
  // texts: List(),
  // z: null,
  // taskId: null,
  // lineClassifier: UNDEFINED_CLASSIFIER,
  status: STATUSES.EXISTING,
  // uniqueDesignation1: '',
  // catalogAttributes: {},
  // direction: '',
}
const symbolAttributes = Record(attributesInitValues)

// поиск соответствующего тактического знака в перечне тактических знаков
export const getIdSymbols = (searchTerms, searchFilter) => {
  const { code, attributes: amp, type, coordinatesSize } = searchTerms
  if (!code || !amp) {
    return null
  }
  let id = null
  const ids = []
  const isTwoResults = symbols.some((parent, indexParent) => {
    // фильтрация тактических знаков в разделе по заданому фильтру, если он есть
    const sortedPart = (searchFilter && searchFilter !== '')
      ? parent.children.filter((it) => {
        return it.hint.toLowerCase().includes(searchFilter.toLowerCase()) || it.code.includes(searchFilter)
      })
      : parent.children
    // перебор элементов раздела
    return sortedPart.some((children, index) => {
      const childrenType = children.amp.type ? children.amp.type : entityKind.POINT
      if (type !== childrenType) {
        return false
      }
      switch (type) {
        case entityKind.POINT: {
          if (!isMatchCode(children.code, code, true)) {
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
        case entityKind.POLYLINE: {
          // для незамкнутых линий проверяем количество опорных точек, = 2
          if (!isMatchCode(code, children.code) || coordinatesSize !== 2) {
            return false
          }
        }
        // eslint-disable-next-line no-fallthrough
        case entityKind.CURVE:
        case entityKind.RECTANGLE:
        case entityKind.POLYGON:
        case entityKind.AREA: {
          if (children.code !== code) {
            return false // Коды не совпали
          }
          // проверка на критическое изменение амплификаторов
          if (children.amp) {
            // установка по умолчанию проверяемых аттриутов для знака из перечня
            const buildAmps = symbolAttributes(children.amp).toJS()
            // сравнение тактических знаков
            for (const key of Object.keys(buildAmps)) {
              // eslint-disable-next-line no-prototype-builtins
              if (!amp.hasOwnProperty(key)) {
                return false // для сравнения не хватает атрибутов
              }
              if (key === 'color' || key === 'fill') {
                if (!isMatchAttr(evaluateColor(buildAmps[key]), evaluateColor(amp[key]))) {
                  return false
                }
              } else if (!isMatchAttr(buildAmps[key], amp[key])) {
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
        default:
          return false
      }
      // if (id) {
      //   return true // имеем более одного совпадения, прекращаем перебор перечня
      // }
      id = `${indexParent}_${index}`
      ids.push(id)
      return false // продолжаем поиск
    })
  })
  if (!id) { // (isTwoResults) {
    return id // не найдены совпадения undefined// множественное совпадение
  }
  return ids
}

// сборка списка тактических знаков для поиска соответствия на карточках тактических знаков
export const getPartsSymbols = (type, code, search) => {
  return symbols.map((part, indexParent) => {
    const sortedPart = (search !== '')
      ? part.children.filter((it) => it.hint.toLowerCase().includes(search.toLowerCase()) || it.code.includes(search))
      : part.children

    // заголовок группы
    const parentToRender = (filter) => (
      <Tree.HighlightItem
        data={part}
        filter={{ textFilter: filter }}
        titleSelector={(data) => data.name}
        showTooltip={true}
      />)
    const parent = {
      id: `${indexParent}`,
      name: part.name,
      render: parentToRender,
    }

    const thisCode = extractLineCode(code)
    const indexCompatibility = type === entityKind.SOPHISTICATED
      ? CompatibilityTacticalSymbol.findIndex((sublist) => {
        return sublist.indexOf(thisCode) > -1
      })
      : -2
    const symbolJSX = sortedPart.map((symbol, index) => {
      const { hint, code, isSvg, amp } = symbol
      const symbolType = amp.type || entityKind.POINT
      // фильтрация по типу знака
      if (symbolType !== type) {
        return null
      }
      // фильтрация по совместимости знаков
      const symbolCode = extractLineCode(code)
      if (type === entityKind.SOPHISTICATED && thisCode !== symbolCode) {
        if (indexCompatibility === 0) { // несовместимый знак
          return null
        }
        if (indexCompatibility !== CompatibilityTacticalSymbol.findIndex((spisok) => spisok.indexOf(symbolCode) > -1)) {
          return null // знак из перечня не совместим с текущим
        }
      }
      // элемент группы
      const elemToRender = (filter) => {
        return <div className={'compilation-list'}>
          {(!isSvg)
            ? <MilSymbol
              code={code}
              amplifiers={amp}
              className={'symbol'}
            />
            : <div className='symbol'>
              <SymbolSvg
                name={`${code}`}
              />
            </div>
          }
          <div><HighlightedText text={hint} textFilter={filter}/></div>
        </div>
      }

      return {
        id: `${indexParent}_${index}`,
        name: hint,
        parentID: `${indexParent}`,
        selectable: true,
        data: JSON.stringify(symbol),
        render: elemToRender,
      }
    }).filter(Boolean)

    return [ parent, symbolJSX ]
  }).flat(Infinity)
}

// -----------------------------------------------------------------------------------------------------
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
        <BlockHotKeyContainer hotKey={[ shortcuts.EDIT_KEY ]}>
          <InputButton
            onChange={onChangeSearch}
            initValue={search}
            title={i18n.SYMBOLS}
          />
        </BlockHotKeyContainer>
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
