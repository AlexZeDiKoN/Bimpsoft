import React from 'react'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import IconButton from '../menu/IconButton'
import ContextMenu, { ContextMenuItem } from '../menu/ContextMenu'
import { getClickOutsideRef } from '../../utils/clickOutside'
import i18n from '../../i18n'

const iconNames = components.icons.names

export default class MapSourceSelect extends React.Component {
  static propTypes = {
    onClickMapSource: PropTypes.func,
    isShowSources: PropTypes.bool,
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
    const { isShowSources, sources, source, onClickMapSource } = this.props
    return (
      <IconButton
        title={i18n.MAP_SOURCE}
        icon={iconNames.MAP_DEFAULT}
        checked={isShowSources}
        onClick={onClickMapSource}
      >
        {isShowSources && (<ContextMenu ref={this.clickOutsideRef} >
          {sources.map((sourceObj, index) => {
            const { title } = sourceObj
            return (
              <ContextMenuItem
                key={ index }
                text={ title }
                checked={sourceObj === source}
                value={ sourceObj }
                onClick={this.clickHandler}
              />
            )
          })}
        </ContextMenu>)}
      </IconButton>
    )
  }
}
