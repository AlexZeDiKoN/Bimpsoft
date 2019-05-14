import React from 'react'
import PropTypes from 'prop-types'
import { Input } from 'antd'
import { components, utils } from '@DZVIN/CommonComponents'
import SearchOptions from '../../../containers/SearchOptionsContainer'
import './style.css'
import i18n from '../../../i18n'
import PrintFilesContainer from '../../../containers/PrintFiles'

const {
  icons: { names: iconNames, IconButton },
} = components

const { Coordinates: Coord } = utils

export default class RightMenu extends React.Component {
  static propTypes = {
    isSettingsShow: PropTypes.bool,
    isSidebarShow: PropTypes.bool,
    searchFailed: PropTypes.bool,
    onClickSettings: PropTypes.func,
    onClickSidebar: PropTypes.func,
    onSearch: PropTypes.func,
    onCoordinates: PropTypes.func,
    onSelectSearchOption: PropTypes.func,
    onClearSearchError: PropTypes.func,
    printFiles: PropTypes.object,
  }

  search = (sample) => {
    const { onSearch, onCoordinates } = this.props
    const query = sample.toUpperCase().trim()
    if (query.length) {
      const parsed = Coord.parse(query)
      if (parsed && parsed.lng !== undefined && parsed.lat !== undefined) {
        onCoordinates(query, parsed)
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

  render () {
    const {
      isSettingsShow, isSidebarShow, onClickSettings, onClickSidebar, searchFailed, printFiles,
    } = this.props
    return (
      <div className='left-menu'>
        {Object.keys(printFiles).length !== 0 && (
          <PrintFilesContainer/>
        )}
        <Input.Search
          placeholder={i18n.SEARCH}
          style={{ width: 200 }}
          onSearch={this.search}
          onChange={this.searchClearError}
          className={searchFailed ? 'search-failed' : ''}
        />
        <div className="search-options-sub-panel">
          <SearchOptions />
        </div>
        <IconButton
          title={i18n.TOGGLE_SIDEBAR}
          icon={iconNames.LEFT_MENU_DEFAULT}
          checked={isSidebarShow}
          onClick={onClickSidebar}
        />
        <IconButton
          title={i18n.SETTINGS}
          icon={iconNames.SETTING_DEFAULT}
          checked={isSettingsShow}
          onClick={onClickSettings}
        />
      </div>
    )
  }
}
