import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import { data, components } from '@DZVIN/CommonComponents'
import { VisibilityButton } from '../../common'
import ColorPicker from '../../common/ColorPicker'
import i18n from '../../../i18n'
import DeleteMapForm from './DeleteMapForm'

const { TextFilter } = data
const { common: { expandIcon, TreeComponent, HighlightedText } } = components
const { names: iconNames, IconButton } = components.icons

export default class MapItemComponent extends React.Component {
  state = { showCloseForm: false }

  changeMapVisibilityHandler = () => {
    const { onChangeMapVisibility, data: { mapId, visible } } = this.props
    onChangeMapVisibility && onChangeMapVisibility(mapId, !visible)
  }

  changeColorHandler = (color) => {
    const { onChangeMapColor, data: { mapId } } = this.props
    onChangeMapColor && onChangeMapColor(mapId, color)
  }

  closeHandler = () => this.setState({ showCloseForm: true })

  cancelCloseHandler = () => this.setState({ showCloseForm: false })

  okCloseHandler = () => this.setState({ showCloseForm: false }, () => {
    const { onCloseMap, data: { mapId } } = this.props
    onCloseMap && onCloseMap(mapId)
  })

  onPrintMapHandler = () => {
    const { onPrintMap, data: { mapId, name } } = this.props
    onPrintMap && onPrintMap(mapId, name)
  }

  render () {
    const { showCloseForm } = this.state
    const {
      textFilter,
      data: { visible, name, color, breadCrumbs },
      tree: { expanded, canExpand, onExpand },
    } = this.props
    return (
      <div className="map-item-component">
        {expandIcon(expanded, canExpand, { onClick: onExpand })}
        {showCloseForm && (<DeleteMapForm
          name={name}
          onCancel={this.cancelCloseHandler}
          onOk={this.okCloseHandler}
        />)}
        <VisibilityButton
          title={i18n.MAP_VISIBILITY}
          className="map-item-component-control"
          visible={visible}
          isDark={true}
          onChange={this.changeMapVisibilityHandler}
        />
        <span className="map-item-component-title" title={breadCrumbs}>
          <HighlightedText text={name} textFilter={textFilter} />
        </span>
        <IconButton
          title={i18n.PRINT_BUTTON}
          className="map-item-component-control"
          icon={iconNames.MENU_PRINT_DEFAULT}
          onClick={this.onPrintMapHandler}
        />
        <ColorPicker
          title={i18n.LAYERS_HIGHLIGHT_COLOR}
          className="map-item-component-control"
          color={color}
          onChange={this.changeColorHandler}
        />
        <IconButton
          placement={'topRight'}
          title={i18n.LAYERS_CLOSE_CURRENT_MAP}
          className="map-item-component-control"
          icon={iconNames.DARK_CLOSE_ROUND_ACTIVE}
          onClick={this.closeHandler}
        />
      </div>
    )
  }
}

MapItemComponent.propTypes = {
  ...TreeComponent.itemPropTypes,
  data: PropTypes.object,
  textFilter: PropTypes.instanceOf(TextFilter),
  onChangeMapVisibility: PropTypes.func,
  onChangeMapColor: PropTypes.func,
  onCloseMap: PropTypes.func,
  onPrintMap: PropTypes.func,
}
