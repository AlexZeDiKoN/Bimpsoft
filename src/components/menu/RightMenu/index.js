import React from 'react'
import PropTypes from 'prop-types'
import { Input } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import IconButton from '../IconButton'
import SearchOptions from '../../../containers/SearchOptionsContainer'
import coordinates from '../../../utils/coordinates'
import './style.css'
import i18n from '../../../i18n'
import PrintFilesContainer from '../../../containers/PrintFiles'

const iconNames = components.icons.names

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
      const parsed = coordinates.parse(query)
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
        {(Object.keys(printFiles).length !== 0) && <PrintFilesContainer/>}
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
          icon={isSidebarShow ? iconNames.LEFT_MENU_ACTIVE : iconNames.LEFT_MENU_DEFAULT}
          hoverIcon={iconNames.LEFT_MENU_HOVER}
          onClick={onClickSidebar}
        />
        <IconButton
          title={i18n.SETTINGS}
          icon={isSettingsShow ? iconNames.SETTING_ACTIVE : iconNames.SETTING_DEFAULT}
          hoverIcon={iconNames.SETTING_HOVER}
          onClick={onClickSettings}
        />
      </div>
    )
  }
}
