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
  onOpenCreateLayer,
  isSaveActive,
}) => {
  const isItemExists = Boolean(items.length)
  const textFilter = TextFilter.create(search)
  const isAllItemsVisible = isItemExists && items.every(({ visible }) => visible)
  const isAnyItemsVisible = isItemExists && items.some(({ visible }) => visible)

  const onOpenFilter = ({ target: { value } }) => onOpen(value)
  const onChangeAllVisible = () => onChangeVisible(!isAllItemsVisible)

  return <SidebarWrap
    title={i18n.STRAINERS}
    onChangeSearch={onSearch}
    rightButtons={<>
      <VisibilityButton
        visible={isAllItemsVisible}
        disabled={isItemExists}
        onChange={onChangeAllVisible}
        colorType={ColorTypes.WHITE}
      />
      <IButton
        icon={IconNames.CREATE}
        colorType={ColorTypes.WHITE}
        onClick={onOpenFilter}
      />
      {isSaveActive && isAnyItemsVisible &&
        <IButton
          icon={IconNames.BAR_2_SAVE}
          colorType={ColorTypes.WHITE}
          onClick={onOpenCreateLayer}
        />
      }
    </>
    }
  >
    <Scrollbar>
      {items.map(({ name, visible, data: { code } }, index) => (!textFilter || textFilter.test(name)) &&
        (<div key={index} className="sidebar__filter--list-item">
          <VisibilityButton visible={visible} onChange={(visible) => onChangeVisible(visible, index)}/>
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
  onOpenCreateLayer: PropTypes.func,
  onOpen: PropTypes.func,
  isSaveActive: PropTypes.bool,
}
