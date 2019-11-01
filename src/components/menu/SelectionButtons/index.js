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
import { determineGroupType } from '../../../store/utils'
import DeleteSelectionForm from './DeleteSelectionForm'

import './style.css'

const { names: iconNames, IconButton } = components.icons

export default class SelectionButtons extends React.Component {
  static propTypes = {
    isEditMode: PropTypes.bool,
    showDelForm: PropTypes.bool,
    layerName: PropTypes.string,
    list: PropTypes.array,
    clipboard: PropTypes.array,
    selectedTypes: PropTypes.arrayOf(
      PropTypes.number,
    ),
    selectedPoints: PropTypes.arrayOf(
      PropTypes.object,
    ),
    onCopy: PropTypes.func,
    onCut: PropTypes.func,
    onPaste: PropTypes.func,
    onDelete: PropTypes.func,
    onDeleteOk: PropTypes.func,
    onDeleteCancel: PropTypes.func,
    onMirrorImage: PropTypes.func,
    onContour: PropTypes.func,
    onDecontour: PropTypes.func,
    onGroup: PropTypes.func,
    onUngroup: PropTypes.func,
  }

  render () {
    const {
      isEditMode,
      showDelForm,
      list,
      clipboard,
      layerName,
      selectedTypes,
      selectedPoints,
      onCopy,
      onCut,
      onPaste,
      onDelete,
      onDeleteOk,
      onDeleteCancel,
      onMirrorImage,
      onContour,
      onDecontour,
      onGroup,
      onUngroup,
    } = this.props

    const nSelected = list.length
    const isSelected = Boolean(nSelected)
    const clipboardSize = clipboard ? clipboard.length : 0
    const isClipboardExist = Boolean(clipboardSize)
    const canContour = selectedTypes.length > 1 && selectedTypes.every((item) => entityKindOutlinable.includes(item))
    const canDecontour = selectedTypes.length === 1 && selectedTypes[0] === entityKind.CONTOUR
    const canGroup = selectedTypes.length >= 1 && selectedPoints.length === selectedTypes.length &&
      determineGroupType(selectedPoints)
    const canUngroup = selectedTypes.length === 1 && GROUPS.GROUPED.includes(selectedTypes[0])
    const deleteHandler = () => {
      if (window.webMap && window.webMap.map && window.webMap.map._container === document.activeElement) {
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
          <HotKey selector={shortcuts.PASTE} onKey={isClipboardExist ? onPaste : null} />
          <IconButton
            placement={'bottomLeft'}
            title={i18n.PASTE}
            icon={iconNames.PASTE_DEFAULT}
            disabled={!isClipboardExist}
            onClick={onPaste}
          >
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
          <IconButton
            placement={'bottomLeft'}
            title={i18n.GROUPPING}
            icon={iconNames.MAP_GROUP}
            disabled={!canGroup && !canUngroup}
            onClick={canGroup ? onGroup : onUngroup}
          />
        </>)}
      </>
    )
  }
}
