import React from 'react'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import IconButton from '../IconButton'
import './style.css'
import i18n from '../../../i18n'
import MenuDivider from '../MenuDivider'
import CountLabel from '../../common/CountLabel'
import { shortcuts } from '../../../constants'
import { HotKey } from '../../common/HotKeys'
import DeleteSelectionForm from './DeleteSelectionForm'

const iconNames = components.icons.names

export default class SelectionButtons extends React.Component {
  static propTypes = {
    isEditMode: PropTypes.bool,
    showDelForm: PropTypes.bool,
    layerName: PropTypes.string,
    list: PropTypes.array,
    clipboard: PropTypes.array,
    onCopy: PropTypes.func,
    onCut: PropTypes.func,
    onPaste: PropTypes.func,
    onDelete: PropTypes.func,
    onDeleteOk: PropTypes.func,
    onDeleteCancel: PropTypes.func,
  }

  render () {
    const {
      isEditMode,
      showDelForm,
      list,
      clipboard,
      layerName,
      onCopy,
      onCut,
      onPaste,
      onDelete,
      onDeleteOk,
      onDeleteCancel,
    } = this.props

    if (!isEditMode) {
      return null
    }

    const nSelected = list.length
    const isSelected = Boolean(nSelected)
    const clipboardSize = clipboard ? clipboard.length : 0
    const isClipboardExist = Boolean(clipboardSize)

    return (
      <>
        <MenuDivider />
        {isSelected && <CountLabel title={i18n.NUM_SELECTED_SIGNS(nSelected)}>{nSelected}</CountLabel>}
        <HotKey selector={shortcuts.CUT} onKey={isSelected ? onCut : null} />
        <IconButton
          title={i18n.CUT}
          icon={iconNames.CUT_DEFAULT}
          disabled={!isSelected}
          onClick={onCut}
        />
        <HotKey selector={shortcuts.COPY} onKey={isSelected ? onCopy : null} />
        <IconButton
          title={i18n.COPY}
          icon={iconNames.COPY_DEFAULT}
          disabled={!isSelected}
          onClick={onCopy}
        />
        <HotKey selector={shortcuts.PASTE} onKey={isClipboardExist ? onPaste : null} />
        <IconButton
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
        <HotKey selector={shortcuts.DELETE} onKey={isSelected ? onDelete : null} />
        <IconButton
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
      </>
    )
  }
}
