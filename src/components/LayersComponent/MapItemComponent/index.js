import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import { data, components } from '@DZVIN/CommonComponents'
import { VisibilityButton } from '../../common'
import ColorPicker from '../../common/ColorPicker'
import i18n from '../../../i18n'
import DeleteMapForm from './DeleteMapForm'

const { TextFilter } = data
const { icons: { IconHovered, names: iconNames }, common: { expandIcon, TreeComponent } } = components

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

  render () {
    const { showCloseForm } = this.state
    const { data: { visible, name, color, breadCrumbs }, tree: {
      expanded,
      canExpand,
      onExpand,
    } } = this.props
    return (
      <div className="map-item-сomponent">
        {expandIcon(expanded, canExpand, { onClick: onExpand })}
        {showCloseForm && (<DeleteMapForm
          name={breadCrumbs}
          onCancel={this.cancelCloseHandler}
          onOk={this.okCloseHandler}
        />)}
        <VisibilityButton
          title={i18n.LAYERS_VISIBILITY}
          className="map-item-сomponent-control"
          visible={visible}
          isDark={true}
          onChange={this.changeMapVisibilityHandler}
        />
        <span className="map-item-сomponent-title" title={breadCrumbs}>{name}</span>
        <ColorPicker
          title={i18n.LAYERS_HIGHLIGHT_COLOR}
          className="map-item-сomponent-control"
          color={color}
          onChange={this.changeColorHandler}
        />
        <IconHovered
          title={i18n.LAYERS_CLOSE_CURRENT_MAP}
          className="map-item-сomponent-control"
          icon={iconNames.DARK_CLOSE_ROUND_ACTIVE}
          hoverIcon={iconNames.DARK_CLOSE_ROUND_HOVER}
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
}
