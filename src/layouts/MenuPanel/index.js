import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'antd'
import './MenuPanel.css'

class MenuPanel extends React.PureComponent {
  static propTypes = {
    toggleSidebar: PropTypes.func.isRequired,
  }

  render () {
    return (
      <div className="menu_panel">
        <Button.Group className="menu_panel-button_group">
          <Button type="primary"><i className="icon icon-qwe1"/></Button>
          <Button type="primary"><i className="icon icon-qwe2"/></Button>
          <Button type="primary"><i className="icon icon-qwe3"/></Button>
          <Button type="primary">qwe4</Button>
          <Button type="primary">qwe5</Button>
          <Button type="primary">qwe6</Button>
          <Button type="primary">qwe7</Button>
        </Button.Group>
        <Button.Group className="menu_panel-button_group">
          <Button type="primary">qwe8</Button>
          <Button type="primary">qwe9</Button>
          <Button type="primary" onClick={this.props.toggleSidebar}>qwe10</Button>
        </Button.Group>
      </div>
    )
  }
}

export default MenuPanel
