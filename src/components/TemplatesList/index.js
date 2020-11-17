import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from 'antd'
import { components } from '@C4/CommonComponents'
import i18n from '../../i18n'
import './style.css'
import Item from './Item'
import { MOUSE_ENTER_DELAY } from '../../constants/tooltip'

const { IconHovered, names } = components.icons

export default class TemplatesList extends React.Component {
  static propTypes = {
    templates: PropTypes.object,
    selectedTemplateId: PropTypes.string,
    onAddTemplate: PropTypes.func,
    onSelectTemplate: PropTypes.func,
    onEditTemplate: PropTypes.func,
    onRemoveTemplate: PropTypes.func,
    visible: PropTypes.bool,
  }

  render () {
    const { templates, visible, selectedTemplateId } = this.props
    const { byIds } = templates
    return visible ? (
      <div className="templates-list">
        { Object.values(byIds).map((template) => (
          <Item
            key={template.id}
            template={template}
            selected={selectedTemplateId === template.id}
            onSelectTemplate={this.props.onSelectTemplate}
            onRemoveTemplate={this.props.onRemoveTemplate}
            onEditTemplate={this.props.onEditTemplate}
          />
        ))}
        <Tooltip mouseEnterDelay={MOUSE_ENTER_DELAY} title={i18n.ADD_POINT_SIGN_TEMPLATE} >
          <IconHovered
            icon={names.ADD_TABLE_DEFAULT}
            hoverIcon={names.ADD_TABLE_HOVER}
            onClick={this.props.onAddTemplate}
          />
        </Tooltip>
      </div>
    ) : null
  }
}
