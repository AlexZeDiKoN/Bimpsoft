import React from 'react'
import PropTypes from 'prop-types'
import { Input } from 'antd'
import { debounce } from 'lodash/function'
import { components, utils } from '@DZVIN/CommonComponents'
import SearchOptions from '../../../containers/SearchOptionsContainer'
import i18n from '../../../i18n'
import PrintFilesContainer from '../../../containers/PrintFiles'

import './style.css'

const throttle1000 = (func) => debounce(func, 2000)

const {
  icons: { names: iconNames, IconButton },
} = components

const { Coordinates: Coord } = utils

export default class RightMenu extends React.Component {
  static propTypes = {
    isSettingsShow: PropTypes.bool,
    isSidebarShow: PropTypes.bool,
    isVolumeMap: PropTypes.bool,
    searchFailed: PropTypes.bool,
    onClickSettings: PropTypes.func,
    onClickSidebar: PropTypes.func,
    onClick3D: PropTypes.func,
    onSearch: PropTypes.func,
    onCoordinates: PropTypes.func,
    onSelectSearchOption: PropTypes.func,
    onClearSearchError: PropTypes.func,
    onCloseSearch: PropTypes.func,
    onManyCoords: PropTypes.func,
    printFiles: PropTypes.object,
  }

  search = (sample) => {
    const { onSearch, onCoordinates, onManyCoords } = this.props
    const query = sample.toUpperCase().trim()
    if (query.length) {
      const parsed = Coord.parse(query)
      if (parsed && (parsed.length > 1 || (parsed.lng !== undefined && parsed.lat !== undefined))) {
        if (parsed.length > 1) {
          onManyCoords(parsed.map(({ lng, lat, type }) => ({
            point: { lng, lat },
            text: `${query} (${Coord.names[type]})`,
          })))
        } else {
          onCoordinates(query, parsed)
        }
      } else {
        onSearch(query)
      }
    }
  }

  searchClearError = () => {
    const { searchFailed, onClearSearchError } = this.props
    if (searchFailed) {
      onClearSearchError()
    }
  }

  searchBlur = () => {
    const { onCloseSearch } = this.props
    onCloseSearch && setTimeout(() => onCloseSearch(), 333)
  }

  render () {
    const {
      isSettingsShow, isSidebarShow, onClickSettings, onClickSidebar, searchFailed, printFiles, isVolumeMap, onClick3D,
    } = this.props
    return (
      <div className='left-menu'>
        <IconButton
          placement={'bottomRight'}
          title={'3D View'}
          icon={iconNames.MENU_LEFT_MENU_DEFAULT}
          checked={isVolumeMap}
          onClick={throttle1000(onClick3D)}
        />
        {Object.keys(printFiles).length !== 0 && (
          <PrintFilesContainer/>
        )}
        <Input.Search
          placeholder={i18n.SEARCH}
          style={{ width: 200 }}
          onBlur={this.searchBlur}
          onSearch={this.search}
          onChange={this.searchClearError}
          className={searchFailed ? 'search-failed' : ''}
          disabled={isVolumeMap}

        />
        <div className="search-options-sub-panel search-options-sub-panel-right">
          <SearchOptions />
        </div>
        <IconButton
          placement={'bottomRight'}
          title={i18n.TOGGLE_SIDEBAR}
          icon={iconNames.MENU_LEFT_MENU_DEFAULT}
          checked={isSidebarShow}
          onClick={onClickSidebar}
          disabled={isVolumeMap}

        />
        <IconButton
          placement={'bottomRight'}
          title={i18n.SETTINGS}
          icon={iconNames.SETTING_DEFAULT}
          checked={isSettingsShow}
          onClick={onClickSettings}
          disabled={isVolumeMap}

        />
      </div>
    )
  }
}
