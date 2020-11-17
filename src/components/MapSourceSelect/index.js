import React from 'react'
import PropTypes from 'prop-types'
import { ButtonTypes, ColorTypes, IButton, IconNames } from '@C4/CommonComponents'
import { Tooltip } from 'antd'
import ContextMenu, { ContextMenuItem } from '../menu/ContextMenu'
import { getClickOutsideRef } from '../../utils/clickOutside'
import i18n from '../../i18n'
import { MOUSE_ENTER_DELAY } from '../../constants/tooltip'

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
    const filteredSources = sources.filter(({ isTerrain, title }) => !isTerrain && title)
    return (
      <div className='btn-context-container'>
        <Tooltip title={i18n.MAP_SOURCE} mouseEnterDelay={MOUSE_ENTER_DELAY} placement='bottomLeft'>
          <IButton
            type={ButtonTypes.WITH_BG}
            colorType={ColorTypes.MAP_HEADER_GREEN}
            icon={IconNames.MAP_HEADER_ICON_OPEN_MAP}
            active={isShowSources}
            onClick={onClickMapSource}
          />
        </Tooltip>
        {isShowSources && (<ContextMenu ref={this.clickOutsideRef} >
          {filteredSources.map((sourceObj, index) => {
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
      </div>
    )
  }
}
