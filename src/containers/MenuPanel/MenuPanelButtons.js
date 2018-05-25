import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { compose, pure } from 'recompose'
import { Button, Tooltip } from 'antd'
import { withAntdControls } from '../../hocs'
import './MenuPanelButtons.css'

const MenuPanelButtons = (props) => {
  const {
    isMapEditMode,
    isPointMarkEditMode,
    isSidebarCollapsed,
    isTextMarkEditMode,
    isTimelineEditMode,
    renderAutocompleteInput,
    renderButton,
    renderDropdownButton,
    renderSwitcherButton,
    toggleMapEditMode,
    togglePointMarkEditMode,
    toggleSidebar,
    toggleTextMarkEditMode,
    toggleTimelineEditMode,
  } = props

  const mapEditButtonParams = {
    isActive: isMapEditMode,
    onClick: toggleMapEditMode,
    title: 'Режим роботи',
    buttonClassName: 'menu_panel-button',
    activeButtonClassName: 'menu_panel-button menu_panel-button--active ant-btn--active',
    iconClassName: 'menu_panel-button_icon icon icon-qwe1',
    activeIconClassName: 'menu_panel-button_icon icon icon-qwe2',
    tooltipPlacement: 'topLeft',
  }
  const pointMarkButtonParams = {
    isActive: isPointMarkEditMode,
    onClick: togglePointMarkEditMode,
    title: 'Точковий знак',
    buttonClassName: 'menu_panel-button',
    activeButtonClassName: 'menu_panel-button menu_panel-button--active ant-btn--active',
    iconClassName: 'menu_panel-button_icon icon icon-qwe1',
    activeIconClassName: 'menu_panel-button_icon icon icon-qwe2',
    tooltipPlacement: 'topLeft',
  }
  const segmentMarkButtonParams = {
    title: 'Відрізковий знак',
    iconClassName: 'menu_panel-button_icon icon icon-qwe1',
    options: [
      { iconClassName: 'menu_panel-button_icon icon icon-qwe1', title: 'qweqwqwe', onClick: () => {} },
      { iconClassName: 'menu_panel-button_icon icon icon-qwe1', title: 'qweqwqwe2' },
      { iconClassName: 'menu_panel-button_icon icon icon-qwe1', title: 'qweqwqwe42' },
    ],
  }
  const polygonMarkButtonParams = {
    title: 'Полілінійний/полігональний знак',
    iconClassName: 'menu_panel-button_icon icon icon-qwe1',
    options: [
      { iconClassName: 'menu_panel-button_icon icon icon-qwe1', title: 'qweqwqwe', onClick: () => {} },
      { iconClassName: 'menu_panel-button_icon icon icon-qwe1', title: 'qweqwqwe2' },
      { iconClassName: 'menu_panel-button_icon icon icon-qwe1', title: 'qweqwqwe42' },
    ],
  }
  const textEditButtonParams = {
    isActive: isTextMarkEditMode,
    onClick: toggleTextMarkEditMode,
    title: 'Надпис',
    buttonClassName: 'menu_panel-button',
    activeButtonClassName: 'menu_panel-button menu_panel-button--active ant-btn--active',
    iconClassName: 'menu_panel-button_icon icon icon-qwe1',
    tooltipPlacement: 'topLeft',
  }
  const cartographyInfoButtonParams = {
    title: 'Джерело картографічної інформації',
    iconClassName: 'menu_panel-button_icon icon icon-qwe1',
    options: [
      { iconClassName: 'menu_panel-button_icon icon icon-qwe1', title: 'qweqwqwe' },
      { iconClassName: 'menu_panel-button_icon icon icon-qwe1', title: 'qweqwqwe2', onClick: () => {} },
      { iconClassName: 'menu_panel-button_icon icon icon-qwe1', title: 'qweqwqwe42' },
    ],
  }
  const situationDetailingButtonParams = {
    title: 'Деталізація обстановки',
    iconClassName: 'menu_panel-button_icon icon icon-qwe1',
    options: [
      { iconClassName: 'menu_panel-button_icon icon icon-qwe1', title: 'qweqwqwe' },
      { iconClassName: 'menu_panel-button_icon icon icon-qwe1', title: 'qweqwqwe2' },
      { iconClassName: 'menu_panel-button_icon icon icon-qwe1', title: 'qweqwqwe42', onClick: () => {} },
    ],
  }
  const printButtonParams = {
    title: 'Друк',
    buttonClassName: 'menu_panel-button',
    iconClassName: 'menu_panel-button_icon icon icon-qwe1',
    // onClick: (e) => {},
    tooltipPlacement: 'topLeft',
  }
  const searchInputParams = {
    // TODO Finish autocomplete <-------------------------------------------------------------------------------------
    autocomplete: {
      className: 'menu_panel-autocomplete_wrapper',
      placeholder: 'Пошук',
    },
    input: {
      spellCheck: 'false',
      suffix: (
        <Tooltip placement="topRight" title="Пошук">
          <Button className="menu_panel-button">
            <i className="menu_panel-button_icon icon icon-qwe1"/>
          </Button>
        </Tooltip>
      ),
    },
    wrapper: { className: 'menu_panel-search_input_wrapper' },
  }
  const timelineButtonParams = {
    isActive: isTimelineEditMode,
    onClick: toggleTimelineEditMode,
    title: 'Відобразити/сховати шкалу часу',
    buttonClassName: 'menu_panel-button',
    activeButtonClassName: 'menu_panel-button menu_panel-button--active ant-btn--active',
    iconClassName: 'menu_panel-button_icon icon icon-qwe1',
    activeIconClassName: 'menu_panel-button_icon icon icon-qwe2',
    tooltipPlacement: 'topRight',
  }
  const sidebarTogglerButtonParams = {
    isActive: !isSidebarCollapsed,
    onClick: toggleSidebar,
    title: 'Відобразити/сховати праву панель',
    buttonClassName: 'menu_panel-button',
    activeButtonClassName: 'menu_panel-button menu_panel-button--active ant-btn--active',
    iconClassName: 'menu_panel-button_icon icon icon-qwe1',
    activeIconClassName: 'menu_panel-button_icon icon icon-qwe2',
    tooltipPlacement: 'topRight',
  }

  return (
    <Fragment>
      <Button.Group className="menu_panel-button_group">
        {renderSwitcherButton(mapEditButtonParams)}

        {
          !isMapEditMode && (
            <Fragment>
              {renderSwitcherButton(pointMarkButtonParams)}
              {renderDropdownButton(segmentMarkButtonParams)}
              {renderDropdownButton(polygonMarkButtonParams)}
              {renderSwitcherButton(textEditButtonParams)}
            </Fragment>
          )
        }

        {renderDropdownButton(cartographyInfoButtonParams)}
        {renderDropdownButton(situationDetailingButtonParams)}
        {renderButton(printButtonParams)}
      </Button.Group>

      <Button.Group className="menu_panel-button_group">
        {renderAutocompleteInput(searchInputParams)}
      </Button.Group>

      <Button.Group className="menu_panel-button_group">
        {renderSwitcherButton(timelineButtonParams)}
        {renderSwitcherButton(sidebarTogglerButtonParams)}
      </Button.Group>
    </Fragment>
  )
}
MenuPanelButtons.propTypes = {
  isMapEditMode: PropTypes.bool.isRequired,
  isPointMarkEditMode: PropTypes.bool.isRequired,
  isSidebarCollapsed: PropTypes.bool.isRequired,
  isTextMarkEditMode: PropTypes.bool.isRequired,
  isTimelineEditMode: PropTypes.bool.isRequired,
  renderAutocompleteInput: PropTypes.func.isRequired,
  renderButton: PropTypes.func.isRequired,
  renderDropdownButton: PropTypes.func.isRequired,
  renderSwitcherButton: PropTypes.func.isRequired,
  toggleMapEditMode: PropTypes.func.isRequired,
  togglePointMarkEditMode: PropTypes.func.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  toggleTextMarkEditMode: PropTypes.func.isRequired,
  toggleTimelineEditMode: PropTypes.func.isRequired,
}

export default compose(
  pure,
  withAntdControls(),
)(MenuPanelButtons)

export {
  MenuPanelButtons,
}
