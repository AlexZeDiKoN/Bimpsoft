import React from 'react'
import { AutoComplete, Button, Dropdown, Input, Menu, Tooltip } from 'antd'

export const withAntdControls = (options) => (WrappedComponent) => {
  class AntdControls extends React.Component {
    renderButton = (params = {}) => {
      //  See:  http://ant.design/components/button/#components-button-demo-basic
      const {
        title,
        buttonClassName,
        iconClassName,
        onClick,
        tooltipPlacement = 'top',
      } = params

      return (
        <Tooltip placement={tooltipPlacement} title={title}>
          <Button className={buttonClassName} onClick={onClick}>
            <i className={iconClassName}/>
          </Button>
        </Tooltip>
      )
    }

    renderSwitcherButton = (params = {}) => {
      //  See:  http://ant.design/components/button/#components-button-demo-basic
      const {
        isActive = false,
        buttonClassName,
        activeButtonClassName,
        iconClassName,
        activeIconClassName,
        onClick,
        title,
        tooltipPlacement = 'top',
      } = params

      return (
        <Tooltip placement={tooltipPlacement} title={title}>
          <Button
            className={(isActive && activeButtonClassName) ? activeButtonClassName : buttonClassName}
            onClick={onClick}
          >
            <i className={(isActive && activeIconClassName) ? activeIconClassName : iconClassName}/>
          </Button>
        </Tooltip>
      )
    }

    renderDropdownButton = (params = {}) => {
      //  See:  http://ant.design/components/button/#components-button-demo-multiple
      const {
        title,
        buttonClassName,
        iconClassName,
        options = [],
        onClick,
      } = params

      const menu = (
        <Menu>
          <Menu.ItemGroup title={title}>
            {options.map(this.renderDropdownButtonOption)}
          </Menu.ItemGroup>
        </Menu>
      )

      return (
        <Dropdown overlay={menu}>
          <Button className={buttonClassName} onClick={onClick}>
            <i className={iconClassName}/>
          </Button>
        </Dropdown>
      )
    }

    renderDropdownButtonOption = (option) => {
      const {
        title,
        iconClassName,
        ...restProps
      } = option
      return (
        <Menu.Item {...restProps} key={title}>
          <i className={iconClassName}/>
          <span>{title}</span>
        </Menu.Item>
      )
    }

    renderAutocompleteInput = (options) => {
      //  See:  http://ant.design/components/auto-complete/#components-auto-complete-demo-uncertain-category
      const {
        autocomplete: {
          ...restAutocompleteProps
        },
        input: inputProps,
        wrapper: wrapperProps,
      } = options

      // TODO Finish autocomplete <-------------------------------------------------------------------------------------

      return (
        <div {...wrapperProps}>
          <AutoComplete{...restAutocompleteProps}>
            <Input {...inputProps}/>
          </AutoComplete>
        </div>
      )
    }

    render () {
      return (
        <WrappedComponent
          {...this.props}
          renderAutocompleteInput={this.renderAutocompleteInput}
          renderButton={this.renderButton}
          renderSwitcherButton={this.renderSwitcherButton}
          renderDropdownButton={this.renderDropdownButton}
        />
      )
    }
  }

  return AntdControls
}
