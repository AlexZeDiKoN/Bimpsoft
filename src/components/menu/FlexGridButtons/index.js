import React from 'react'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import MenuDivider from '../MenuDivider'
import { shortcuts } from '../../../constants'
import { HotKey } from '../../common/HotKeys'
import DivideDirectionForm from './DivideDirectionForm'
import CombineDirectionsForm from './CombineDirectionsForm'

const { names: iconNames, IconButton } = components.icons

// @TODO: КНОПКА!!!
export default class FlexGridButtons extends React.Component {
  static propTypes = {
    isEditMode: PropTypes.bool,
    visible: PropTypes.bool,
    showFlexGridOptions: PropTypes.func,
    hideFlexGrid: PropTypes.func,
    calcFlexGridUnits: PropTypes.func,
    showDivideDirForm: PropTypes.func,
    onModalCancel: PropTypes.func,
    selectDirection: PropTypes.func,
    deselectDirection: PropTypes.func,
    isShownDivideForm: PropTypes.bool,
    flexGrid: PropTypes.object,
    updateFlexGridDirections: PropTypes.func,
    //
    isShownCombineForm: PropTypes.bool,
    showCombineDirForm: PropTypes.func,
  }

  render () {
    const {
      isEditMode,
      visible,
      showFlexGridOptions,
      hideFlexGrid,
      calcFlexGridUnits,
      showDivideDirForm,
      isShownDivideForm,
      isShownCombineForm,
      showCombineDirForm,
      onModalCancel,
      selectDirection,
      deselectDirection,
      flexGrid,
      updateFlexGridDirections,
    } = this.props

    if (!isEditMode) {
      return null
    }

    const dropHandler = visible ? hideFlexGrid : showFlexGridOptions

    return (
      <>
        <MenuDivider />
        <HotKey selector={shortcuts.DROP_FLEX_GRID} onKey={dropHandler} />
        <IconButton
          title={`${i18n.FLEX_GRID} (${i18n.FLEX_GRID_SHORTCUT})`}
          icon={iconNames.MENU_OPERATING_AREA_DEFAULT}
          checked={visible}
          onClick={dropHandler}
        />
        <IconButton
          title={i18n.SEND_TO_ICT}
          icon={iconNames.MENU_CALCULATION_DEFAULT}
          disabled={!visible}
          onClick={calcFlexGridUnits}
        />
        <IconButton
          title={i18n.DIVIDE_DIRECTION}
          icon={iconNames.FOREGROUND_DEFAULT}
          disabled={!visible}
          onClick={showDivideDirForm}
        >{isShownDivideForm &&
          <DivideDirectionForm
            onCancel={onModalCancel}
            onOk={updateFlexGridDirections}
            select={selectDirection}
            deselect={deselectDirection}
            flexGrid={flexGrid}
          />}
        </IconButton>
        <IconButton
          title={'ОБЪЕДИНИТЬ!!!'}
          icon={iconNames.COPY_TABLE_DEFAULT}
          disabled={!visible}
          onClick={showCombineDirForm}
        >{isShownCombineForm &&
          <CombineDirectionsForm
            onCancel={onModalCancel}
            onOk={updateFlexGridDirections}
            select={selectDirection}
            deselect={deselectDirection}
            flexGrid={flexGrid}
          />}
        </IconButton>
      </>
    )
  }
}
