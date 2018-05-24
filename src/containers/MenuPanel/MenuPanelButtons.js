import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'recompose'
import { AutoComplete, Button, Input, Tooltip } from 'antd' // TODO <---------------------------------------------------
import { withAntdControls } from '../../hocs'
import './MenuPanelButtons.css'

class MenuPanelButtons extends React.PureComponent {
  static propTypes = {
    isMapEditMode: PropTypes.bool.isRequired,
    isPointMarkMode: PropTypes.bool.isRequired,
    isSidebarCollapsed: PropTypes.bool.isRequired,
    renderButton: PropTypes.func.isRequired,
    renderDropdownButton: PropTypes.func.isRequired,
    renderSwitcherButton: PropTypes.func.isRequired,
    toggleEditMode: PropTypes.func.isRequired,
    togglePointMarkEditMode: PropTypes.func.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
  }

  render () {
    const {
      isMapEditMode,
      isPointMarkMode,
      isSidebarCollapsed,
      renderButton,
      renderDropdownButton,
      renderSwitcherButton,
      toggleEditMode,
      togglePointMarkEditMode,
      toggleSidebar,
    } = this.props

    const mapEditButtonParams = {
      isActive: isMapEditMode,
      onClick: toggleEditMode,
      title: 'Режим роботи',
      buttonClassName: 'menu_panel-button',
      activeButtonClassName: 'menu_panel-button menu_panel-button--active ant-btn--active',
      iconClassName: 'menu_panel-button_icon icon icon-qwe1',
      activeIconClassName: 'menu_panel-button_icon icon icon-qwe2',
      tooltipPlacement: 'topLeft',
    }
    const pointMarkButtonParams = {
      isActive: isPointMarkMode,
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
        { iconClassName: 'menu_panel-button_icon icon icon-qwe1', title: 'qweqwqwe' },
        { iconClassName: 'menu_panel-button_icon icon icon-qwe1', title: 'qweqwqwe2' },
        { iconClassName: 'menu_panel-button_icon icon icon-qwe1', title: 'qweqwqwe42' },
      ],
    }
    const textButtonParams = {
      title: 'Надпис',
      buttonClassName: 'menu_panel-button',
      iconClassName: 'menu_panel-button_icon icon icon-qwe1',
      onClick: (e) => {},
      tooltipPlacement: 'topLeft',
    }
    const cartographyInfoButtonParams = {
      title: 'Джерело картографічної інформації',
      buttonClassName: 'menu_panel-button',
      iconClassName: 'menu_panel-button_icon icon icon-qwe1',
      onClick: (e) => {},
      tooltipPlacement: 'topLeft',
    }
    const situationDetailingButtonParams = {
      title: 'Деталізація обстановки',
      buttonClassName: 'menu_panel-button',
      iconClassName: 'menu_panel-button_icon icon icon-qwe1',
      onClick: (e) => {},
      tooltipPlacement: 'topLeft',
    }
    const printButtonParams = {
      title: 'Друк',
      buttonClassName: 'menu_panel-button',
      iconClassName: 'menu_panel-button_icon icon icon-qwe1',
      onClick: (e) => {},
      tooltipPlacement: 'topLeft',
    }
    // TODO <-----------------------------------------------------------------------------------------------------------
    // const searchInputParams = {
    //   button: (
    //     <Tooltip placement="topRight" title="Пошук">
    //       <Button className="menu_panel-button">
    //         <i className="menu_panel-button_icon icon icon-qwe1"/>
    //       </Button>
    //     </Tooltip>
    //   ),
    //   //  ...
    // }
    const timelineButtonParams = {
      isActive: false,
      onClick: () => {},
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
                {renderButton(textButtonParams)}
              </Fragment>
            )
          }

          {renderButton(cartographyInfoButtonParams)}
          {renderButton(situationDetailingButtonParams)}
          {renderButton(printButtonParams)}
        </Button.Group>

        {/* TODO <-------------------------------------------------------------------------------------------------> */}
        <div className="menu_panel-search_input_wrapper">
          <AutoComplete
            className="menu_panel-autocomplete_wrapper"
            placeholder="Пошук"
          >
            <Input spellCheck="false" suffix={(
              <Tooltip placement="topRight" title="Пошук">
                <Button className="menu_panel-button">
                  <i className="menu_panel-button_icon icon icon-qwe1"/>
                </Button>
              </Tooltip>
            )}/>
          </AutoComplete>
        </div>

        <Button.Group className="menu_panel-button_group">
          {renderSwitcherButton(timelineButtonParams)}
          {renderSwitcherButton(sidebarTogglerButtonParams)}
        </Button.Group>
      </Fragment>
    )
  }
}

export default compose(
  withAntdControls(),
)(MenuPanelButtons)

export {
  MenuPanelButtons,
}
