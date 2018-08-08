import React from 'react'
import PropTypes from 'prop-types'
import { default as ContextMenu, ContextMenuItem } from '../menu/ContextMenu'

export default class MapsSourcesList extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    sources: PropTypes.array,
    source: PropTypes.object,
    onSelect: PropTypes.func,
  }

  clickHandler = (value) => {
    this.props.onSelect(value)
  }

  getItemProps = (value) => ({
    value,
    checked: this.props.source === value,
    onClick: this.clickHandler,
  })

  render () {
    const { visible, sources, source: currentSource } = this.props
    if (!visible) {
      return null
    }
    return (
      <ContextMenu>
        {sources.map((sourceObj) => {
          const { source, title } = sourceObj
          return (
            <ContextMenuItem
              key={ source }
              text={ title }
              checked={sourceObj === currentSource}
              value={ sourceObj }
              onClick={this.clickHandler}
            />
          )
        })}
      </ContextMenu>
    )
  }
}
