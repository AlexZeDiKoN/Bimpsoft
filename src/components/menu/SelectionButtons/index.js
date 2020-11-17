import React from 'react'
import PropTypes from 'prop-types'
import { debounce } from 'lodash/function'
import { ButtonTypes, ColorTypes, IButton, IconNames } from '@C4/CommonComponents'
import { Tooltip } from 'antd'
import i18n from '../../../i18n'
import MenuDivider from '../MenuDivider'
import CountLabel from '../../common/CountLabel'
import { shortcuts } from '../../../constants'
import { HotKey } from '../../common/HotKeys'
import entityKind, {
  entityKindCanMirror,
  entityKindOutlinable,
  GROUPS,
} from '../../WebMap/entityKind'
import {
  determineGroupType,
  emptyParent, objectsSameLayer,
  sameLayer,
} from '../../../store/utils'
import SaveMilSymbolForm from '../../SelectionForm/forms/MilSymbolForm/SaveMilSymbolForm'
import SelectionTypes from '../../../constants/SelectionTypes'
import { sameObjects } from '../../../store/selectors'
import { errorSymbol } from '../../../store/actions/selection'
import DeleteSelectionForm from './DeleteSelectionForm'
import './style.css'
import { MOUSE_ENTER_DELAY } from '../../../constants/tooltip'

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
    isShowForm: PropTypes.bool,
    selectedTypes: PropTypes.arrayOf(
      PropTypes.number,
    ),
    selectedPoints: PropTypes.arrayOf(
      PropTypes.object,
    ),
    doubleObjects: PropTypes.array,
    flexGridSelected: PropTypes.bool,
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
  // из проверки исключаются объекты не привязанные к подрпзделению
  onPasteObject = () => {
    const { onPasteError, onPaste, clipboard, objectsMap, layerId, orgStructures, isShowForm } = this.props
    if (isShowForm) {
      return null
    }
    const doubleObjects = clipboard.map((object) => {
      const { code, unit, type } = object
      if (type === SelectionTypes.POINT && objectsMap && unit !== null) {
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
      isShowForm,
      showDelForm,
      showErrorPasteForm,
      list,
      clipboard,
      layerName,
      selectedTypes,
      selectedPoints,
      layerId,
      objectsMap,
      flexGridSelected,
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
    const isAllSelectedOnActiveLayer = objectsSameLayer(list, objectsMap, layerId)
    const canContour = selectedTypes.length > 1 &&
      selectedTypes.every((item) => entityKindOutlinable.includes(item)) &&
      isAllSelectedOnActiveLayer
    const canDecontour = selectedTypes.length === 1 && selectedTypes[0] === entityKind.CONTOUR
    const canGroup = selectedTypes.length > 1 && selectedPoints.length === selectedTypes.length &&
      determineGroupType(selectedPoints)
    const canGroupRegion = selectedTypes.length > 1 && selectedPoints.length === selectedTypes.length &&
      emptyParent(selectedPoints) && sameLayer(selectedPoints, layerId)
    const canUngroup = selectedTypes.length === 1 && GROUPS.GENERALIZE.includes(selectedTypes[0])
    const isNotDeleted = selectedTypes.some((types) => (GROUPS.GROUPED_NOT_DELETED.includes(types)))
    const isNotCopyable = flexGridSelected || selectedTypes.some((types) => (GROUPS.NOT_COPY.includes(types)))
    const deleteHandler = () => {
      !isShowForm && onDelete()
    }

    const isEnableCopy = isSelected && !isNotCopyable
    const isEnableMirror = selectedTypes.length === 1 && entityKindCanMirror.includes(selectedTypes[0])
    const isEnableDelete = (isSelected && !isNotDeleted && isAllSelectedOnActiveLayer) || flexGridSelected
    const isEnableCut = isEnableCopy && isEnableDelete

    return (
      <>
        <MenuDivider />
        {isSelected &&
          <CountLabel
            className={isShowForm ? 'block-selected' : null}
            title={i18n.NUM_SELECTED_SIGNS(nSelected)}>{nSelected}
          </CountLabel>
        }
        {isEditMode && (<>
          <HotKey selector={shortcuts.CUT} onKey={(isEnableCut && !isShowForm) ? onCut : null} />
          <Tooltip title={i18n.CUT} mouseEnterDelay={MOUSE_ENTER_DELAY} placement='bottomLeft'>
            <IButton
              type={ButtonTypes.WITH_BG}
              colorType={ColorTypes.MAP_HEADER_GREEN}
              icon={IconNames.MAP_HEADER_ICON_MENU_CUT}
              disabled={!isEnableCut}
              onClick={onCut}
            />
          </Tooltip>
        </>)}
        <HotKey selector={shortcuts.COPY} onKey={(isEnableCopy && !isShowForm) ? onCopy : null} />
        <Tooltip title={i18n.COPY} mouseEnterDelay={MOUSE_ENTER_DELAY} placement='bottomLeft'>
          <IButton
            type={ButtonTypes.WITH_BG}
            colorType={ColorTypes.MAP_HEADER_GREEN}
            icon={IconNames.MAP_HEADER_ICON_MENU_COPY}
            disabled={!isEnableCopy}
            onClick={onCopy}
          />
        </Tooltip>
        {isEditMode && (<>
          <HotKey selector={shortcuts.PASTE} onKey={isClipboardExist ? this.onPasteObject : null} />
          <div className='btn-context-container'>
            <Tooltip title={i18n.PASTE} mouseEnterDelay={MOUSE_ENTER_DELAY} placement='bottomLeft'>
              <IButton
                type={ButtonTypes.WITH_BG}
                colorType={ColorTypes.MAP_HEADER_GREEN}
                icon={IconNames.MAP_HEADER_ICON_MENU_PASTE}
                disabled={!isClipboardExist}
                onClick={this.onPasteObject}
              />
            </Tooltip>
            {showErrorPasteForm && this.errorPasteForm()}
            {isClipboardExist && (
              <CountLabel className="clipboard-size" title={i18n.NUM_BUFFERED_SIGNS(clipboardSize)}>
                {clipboardSize}
              </CountLabel>
            )}
          </div>
        </>)}
        {isEditMode && (<>
          <HotKey selector={shortcuts.DELETE} onKey={isEnableDelete ? deleteHandler : null} />
          <div className='btn-context-container'>
            <Tooltip title={i18n.DELETE} mouseEnterDelay={MOUSE_ENTER_DELAY} placement='bottomLeft'>
              <IButton
                type={ButtonTypes.WITH_BG}
                colorType={ColorTypes.MAP_HEADER_GREEN}
                icon={IconNames.MAP_HEADER_ICON_MENU_DELETE}
                disabled={!isEnableDelete}
                onClick={onDelete}
              />
            </Tooltip>
            {showDelForm && (
              <DeleteSelectionForm
                layerName={layerName}
                list={list}
                onOk={onDeleteOk}
                onCancel={onDeleteCancel}
              />
            )}
          </div>
        </>)}
        {isEditMode && (<>
          <MenuDivider />
          <Tooltip title={i18n.MIRROR_IMAGE} mouseEnterDelay={MOUSE_ENTER_DELAY} placement='bottomLeft'>
            <IButton
              type={ButtonTypes.WITH_BG}
              colorType={ColorTypes.MAP_HEADER_GREEN}
              icon={IconNames.MAP_HEADER_ICON_MENU_MIRROR}
              disabled={!isEnableMirror}
              onClick={debounce(onMirrorImage, 350)}
            />
          </Tooltip>
          <Tooltip title={i18n.CONTOUR} mouseEnterDelay={MOUSE_ENTER_DELAY} placement='bottomLeft'>
            <IButton
              type={ButtonTypes.WITH_BG}
              colorType={ColorTypes.MAP_HEADER_GREEN}
              icon={IconNames.MAP_HEADER_ICON_MENU_CONTOUR}
              disabled={!canContour && !canDecontour}
              onClick={canContour ? onContour : onDecontour}
            />
          </Tooltip>
          {ALLOW_GROUP &&
          <Tooltip
            mouseEnterDelay={MOUSE_ENTER_DELAY}
            title={canGroup ? i18n.GROUPING : canUngroup ? i18n.UNGROUPING : `${i18n.GROUPING} / ${i18n.UNGROUPING}`}
            placement='bottomLeft'>
            <IButton
              type={ButtonTypes.WITH_BG}
              colorType={ColorTypes.MAP_HEADER_GREEN}
              icon={canGroup ? IconNames.MAP_HEADER_ICON_GROUP_UNIT_2 : IconNames.MAP_HEADER_ICON_GROUP_UNIT_1}
              active={!canGroup && canUngroup}
              disabled={!canGroup && !canUngroup}
              onClick={canGroup ? onGroup : canUngroup ? onUngroup : undefined}
            /></Tooltip>}
          <Tooltip title={i18n.GROUPING_REGION} mouseEnterDelay={MOUSE_ENTER_DELAY} placement='bottomLeft'>
            <IButton
              type={ButtonTypes.WITH_BG}
              colorType={ColorTypes.MAP_HEADER_GREEN}
              icon={IconNames.MAP_HEADER_ICON_POSITION_AREA_UNIT}
              disabled={!canGroupRegion}
              onClick={onGroupRegion}
            />
          </Tooltip>
        </>)}
      </>
    )
  }
}
