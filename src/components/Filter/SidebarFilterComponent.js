import React from 'react'
import PropTypes from 'prop-types'
import { MilSymbol } from '@C4/MilSymbolEditor'
import { IButton, IconNames, ColorTypes, Scrollbar, data, HighlightedText } from '@C4/CommonComponents'
import { SidebarWrap } from '../common/Sidebar'
import i18n from '../../i18n'
import VisibilityButton from '../common/VisibilityButton'
import './style.css'

const { TextFilter } = data
const ARRAY = []
const buttonWrap = (node) => <div className="button_layers">{node}</div>

export const SidebarFilterComponent = ({
  items = ARRAY,
  search,
  onSearch,
  onChangeVisible,
  onOpen,
}) => {
  const textFilter = TextFilter.create(search)
  const onOpenFilter = ({ target: { value } }) => onOpen(value)
  return <SidebarWrap
    title={i18n.STRAINERS}
    onChangeSearch={onSearch}
    rightButtons={<IButton icon={IconNames.CREATE} colorType={ColorTypes.WHITE} onClick={onOpenFilter}/>}
  >
    <Scrollbar>
      {items.map(({ name, visible, data: { code } }, index) => (!textFilter || textFilter.test(name)) &&
        (<div key={index} className="sidebar__filter--list-item">
          <VisibilityButton visible={visible} onChange={(visible) => onChangeVisible(index, visible)}/>
          {buttonWrap(<IButton icon={IconNames.MAP_HEADER_ICON_MENU_EDIT} value={index} onClick={onOpenFilter}/>)}
          <span className="sidebar__filter--list-item--container">
            {code ? <MilSymbol code={code} /> : null}
            <span className="sidebar__filter--list-item--text">
              <HighlightedText text={name} textFilter={textFilter} />
            </span>
          </span>
        </div>
        ))}
    </Scrollbar>
  </SidebarWrap>
}

SidebarFilterComponent.displayName = 'SidebarFilterComponent'
SidebarFilterComponent.propTypes = {
  items: PropTypes.array,
  search: PropTypes.string,
  onSearch: PropTypes.func,
  onChangeVisible: PropTypes.func,
  onOpen: PropTypes.func,
}
