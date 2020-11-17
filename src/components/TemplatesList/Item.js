import React from 'react'
import PropTypes from 'prop-types'
import { MilSymbol } from '@C4/MilSymbolEditor'
import { components } from '@C4/CommonComponents'
import { Dropdown, Tooltip } from 'antd'
import ContextMenu, { ContextMenuItem } from '../menu/ContextMenu'
import i18n from '../../i18n'
import { MOUSE_ENTER_DELAY } from '../../constants/tooltip'

const { names } = components.icons

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
    const { template, onSelectTemplate } = this.props
    onSelectTemplate(template)
  }

  removeHandler = () => {
    const { template: { id }, onRemoveTemplate } = this.props
    onRemoveTemplate(id)
  }

  editHandler = () => {
    const { template: { id }, onEditTemplate } = this.props
    onEditTemplate(id)
  }

  contextMenuHandler = (f) => f()

  menu = (<ContextMenu>
    <ContextMenuItem
      text={i18n.EDIT}
      icon={names.BAR_2_EDIT_DEFAULT}
      hoverIcon={names.BAR_2_EDIT_HOVER}
      onClick={this.editHandler}
    />
    <ContextMenuItem
      text={i18n.REMOVE}
      icon={names.BAR_2_DELETE_DEFAULT}
      hoverIcon={names.BAR_2_DELETE_HOVER}
      onClick={this.removeHandler}
    />
  </ContextMenu>)

  render () {
    const { template: { name, code, amplifiers }, selected } = this.props
    const className = selected ? ' template-item-selected' : ''
    return (
      <Dropdown overlay={ this.menu } trigger={[ 'contextMenu' ]}>
        <Tooltip mouseEnterDelay={MOUSE_ENTER_DELAY} title={ name } placement="bottomLeft">
          <div className={'template-item' + className}>
            <MilSymbol code={code} onClick={this.selectHandler} amplifiers={amplifiers} />
          </div>
        </Tooltip>
      </Dropdown>
    )
  }
}
