import React from 'react'
import PropTypes from 'prop-types'
import { MilSymbol } from '@DZVIN/MilSymbolEditor'
import { Dropdown, Tooltip } from 'antd'

export default class Item extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    code: PropTypes.string,
    template: PropTypes.object,
    selected: PropTypes.bool,
    onSelectTemplate: PropTypes.func,
    onEditTemplate: PropTypes.func,
    onRemoveTemplate: PropTypes.func,
  }

  selectHandler = () => {
    const { template: { id }, onSelectTemplate } = this.props
    onSelectTemplate(id)
  }

  removeHendler = () => {
    const { template: { id }, onRemoveTemplate } = this.props
    onRemoveTemplate(id)
  }

  editHendler = () => {
    const { template: { id }, onEditTemplate } = this.props
    onEditTemplate(id)
  }

  menu = (
    <div className="context-menu">
      <div className="context-menu-item" onClick={this.editHendler}>Редагувати</div>
      <div className="context-menu-item" onClick={this.removeHendler}>Видалити</div>
    </div>
  )

  render () {
    const { template: { title, code, amplifiers }, selected } = this.props
    const className = selected ? ' template-item-selected' : ''
    return (
      <Dropdown overlay={ this.menu } trigger={[ 'contextMenu' ]}>
        <Tooltip title={ title }>
          <div className={'template-item' + className}>
            <MilSymbol code={code} onClick={this.selectHandler} amplifiers={amplifiers} />
          </div>
        </Tooltip>
      </Dropdown>
    )
  }
}
