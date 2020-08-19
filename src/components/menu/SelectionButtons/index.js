import React from 'react'
import PropTypes from 'prop-types'
import { debounce } from 'lodash/function'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import MenuDivider from '../MenuDivider'
import CountLabel from '../../common/CountLabel'
import { shortcuts } from '../../../constants'
import { HotKey } from '../../common/HotKeys'
import entityKind, { entityKindOutlinable, GROUPS } from '../../WebMap/entityKind'
import { determineGroupType, emptyParent } from '../../../store/utils'
import SaveMilSymbolForm from '../../SelectionForm/forms/MilSymbolForm/SaveMilSymbolForm'
import SelectionTypes from '../../../constants/SelectionTypes'
import { sameObjects } from '../../../store/selectors'
import { errorSymbol } from '../../../store/actions/selection'
import DeleteSelectionForm from './DeleteSelectionForm'
import './style.css'

const { names: iconNames, IconButton } = components.icons

const ALLOW_GROUP = true

export default class SelectionButtons extends React.Component {
  static propTypes = {
    isEditMode: PropTypes.bool,
    showDelForm: PropTypes.bool,
    showErrorPasteForm: PropTypes.bool,
    layerName: PropTypes.string,
    layerId: PropTypes.string,
    list: PropTypes.array,
    clipboard: PropTypes.array,
    orgStructures: PropTypes.object,
    objectsMap: PropTypes.object,
    selectedTypes: PropTypes.arrayOf(
      PropTypes.number,
    ),
    selectedPoints: PropTypes.arrayOf(
      PropTypes.object,
    ),
    doubleObjects: PropTypes.array,
    onCopy: PropTypes.func,
    onCut: PropTypes.func,
    onPaste: PropTypes.func,
    onPasteError: PropTypes.func,
    onPasteOk: PropTypes.func,
    onPasteCancel: PropTypes.func,
    onDelete: PropTypes.func,
    onDeleteOk: PropTypes.func,
    onDeleteCancel: PropTypes.func,
    onMirrorImage: PropTypes.func,
    onContour: PropTypes.func,
    onDecontour: PropTypes.func,
    onGroup: PropTypes.func,
    onGroupRegion: PropTypes.func,
    onUngroup: PropTypes.func,
  }

  // проверка объекта при вставке на дублирование
  onPasteObject = () => {
    const { onPasteError, onPaste, clipboard, objectsMap, layerId, orgStructures } = this.props
    const doubleObjects = clipboard.map((object) => {
      const { code, unit, type } = object
      if (type === SelectionTypes.POINT) {
        const symbols = sameObjects({ code, unit, type, layerId }, objectsMap)
        if (symbols.size > 0) {
          return {
            code,
            unit: orgStructures.byIds && orgStructures.byIds[unit] ? orgStructures.byIds[unit].fullName : '',
          }
        }
      }
      return null
    }).filter(Boolean)
    if (doubleObjects.length > 0) {
      onPasteError(doubleObjects) // передаем список объектов уже существующих на слое
    } else {
      onPaste()
    }
  }

  errorPasteForm = () => {
    const { onPasteOk, onPasteCancel, doubleObjects } = this.props
    return <SaveMilSymbolForm
      doubleObjects={doubleObjects}
      errorCode={errorSymbol.duplication}
      onApply={onPasteOk}
      onCancel={onPasteCancel}
    />
  }

  render () {
    const {
      isEditMode,
      showDelForm,
      showErrorPasteForm,
      list,
      clipboard,
      layerName,
      selectedTypes,
      selectedPoints,
      onCopy,
      onCut,
      onDelete,
      onDeleteOk,
      onDeleteCancel,
      onMirrorImage,
      onContour,
      onDecontour,
      onGroup,
      onGroupRegion,
      onUngroup,
    } = this.props

    const nSelected = list.length
    const isSelected = Boolean(nSelected)
    const clipboardSize = clipboard ? clipboard.length : 0
    const isClipboardExist = Boolean(clipboardSize)
    const canContour = selectedTypes.length > 1 && selectedTypes.every((item) => entityKindOutlinable.includes(item))
    const canDecontour = selectedTypes.length === 1 && selectedTypes[0] === entityKind.CONTOUR
    const canGroup = selectedTypes.length > 1 && selectedPoints.length === selectedTypes.length &&
      determineGroupType(selectedPoints)
    const canGroupRegion = selectedTypes.length > 1 && selectedPoints.length === selectedTypes.length &&
      emptyParent(selectedPoints)
    const canUngroup = selectedTypes.length === 1 && GROUPS.GENERALIZE.includes(selectedTypes[0])
    const deleteHandler = () => {
      if ((window.webMap && window.webMap.map && window.webMap.map._container === document.activeElement) ||
        document.activeElement.id === 'main'
      ) {
        onDelete()
      }
    }

    return (
      <>
        <MenuDivider />
        {isSelected && <CountLabel title={i18n.NUM_SELECTED_SIGNS(nSelected)}>{nSelected}</CountLabel>}
        {isEditMode && (<>
          <HotKey selector={shortcuts.CUT} onKey={isSelected ? onCut : null} />
          <IconButton
            placement={'bottomLeft'}
            title={i18n.CUT}
            icon={iconNames.CUT_DEFAULT}
            disabled={!isSelected}
            onClick={onCut}
          />
        </>)}
        <HotKey selector={shortcuts.COPY} onKey={isSelected ? onCopy : null} />
        <IconButton
          placement={'bottomLeft'}
          title={i18n.COPY}
          icon={iconNames.COPY_DEFAULT}
          disabled={!isSelected}
          onClick={onCopy}
        />
        {isEditMode && (<>
          <HotKey selector={shortcuts.PASTE} onKey={isClipboardExist ? this.onPasteObject : null} />
          <IconButton
            placement={'bottomLeft'}
            title={i18n.PASTE}
            icon={iconNames.PASTE_DEFAULT}
            disabled={!isClipboardExist}
            onClick={this.onPasteObject}
          >
            {showErrorPasteForm && this.errorPasteForm()}
            {isClipboardExist && (
              <CountLabel className="clipboard-size" title={i18n.NUM_BUFFERED_SIGNS(clipboardSize)}>
                {clipboardSize}
              </CountLabel>
            )}
          </IconButton>
        </>)}
        {isEditMode && (<>
          <HotKey selector={shortcuts.DELETE} onKey={isSelected ? deleteHandler : null} />
          <IconButton
            placement={'bottomLeft'}
            title={i18n.DELETE}
            icon={iconNames.DELETE_DEFAULT}
            disabled={!isSelected}
            onClick={onDelete}
          >
            {showDelForm && (
              <DeleteSelectionForm
                layerName={layerName}
                list={list}
                onOk={onDeleteOk}
                onCancel={onDeleteCancel}
              />
            )}
          </IconButton>
        </>)}
        {isEditMode && (<>
          <MenuDivider />
          <IconButton
            placement={'bottomLeft'}
            title={i18n.MIRROR_IMAGE}
            icon={iconNames.MENU_MIRROR_DEFAULT}
            disabled={!isSelected || nSelected > 1}
            onClick={debounce(onMirrorImage, 350)}
          />
          <IconButton
            placement={'bottomLeft'}
            title={i18n.CONTOUR}
            icon={iconNames.MENU_CONTOUR_DEFAULT}
            disabled={!canContour && !canDecontour}
            onClick={canContour ? onContour : onDecontour}
          />
          {ALLOW_GROUP && <IconButton
            placement={'bottomLeft'}
            title={canGroup ? i18n.GROUPING : canUngroup ? i18n.UNGROUPING : `${i18n.GROUPING} / ${i18n.UNGROUPING}`}
            icon={iconNames.GROUP_UNIT_2}
            checked={!canGroup && canUngroup}
            disabled={!canGroup && !canUngroup}
            onClick={canGroup ? onGroup : canUngroup ? onUngroup : undefined}
          />}
          <IconButton
            placement={'bottomLeft'}
            title={i18n.GROUPING_REGION}
            icon={iconNames.POSITION_AREA_UNIT}
            disabled={!canGroupRegion}
            onClick={onGroupRegion}
          />
        </>)}
      </>
    )
  }
}
