import React from 'react'
import PropTypes from 'prop-types'
import { default as ContextMenu, ContextMenuItem } from '../menu/ContextMenu'
import { getClickOutsideRef } from '../../utils/clickOutside'

export default class MapsSourcesList extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    sources: PropTypes.array,
    source: PropTypes.object,
    onSelect: PropTypes.func,
    onClose: PropTypes.func,
  }

  clickOutsideRef = getClickOutsideRef(() => this.props.onClose())

  clickHandler = (value) => {
    this.props.onSelect(value)
  }

  render () {
    const { visible, sources, source: currentSource } = this.props
    if (!visible) {
      return null
    }
    return (
      <ContextMenu ref={this.clickOutsideRef} >
        {sources.map((sourceObj, index) => {
          const { title } = sourceObj
          return (
            <ContextMenuItem
              key={ index }
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
