import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import moment from 'moment'
import { Tooltip } from 'antd'
import { components, data, IconNames } from '@DZVIN/CommonComponents'
import { VisibilityButton } from '../../common'
import { DATE_TIME_FORMAT } from '../../../constants/formats'
import ColorPicker from '../../common/ColorPicker'
import i18n from '../../../i18n'

const { TextFilter } = data
const { icons: { Icon, names: iconNames }, common: { TreeComponent, HighlightedText } } = components

export default class LayerItemComponent extends React.Component {
  state = {
    showColor: false,
  }

  onHandlerColor = (value) => this.setState({ showColor: value })

  selectHandler = () => {
    const { onSelectLayer, data: { layerId } } = this.props
    onSelectLayer && onSelectLayer(layerId)
  }

  changeVisibilityHandler = (isVisible) => {
    const { onChangeLayerVisibility, data: { layerId } } = this.props
    onChangeLayerVisibility && onChangeLayerVisibility(layerId, isVisible)
  }

  changeColorHandler = (color) => {
    const { onChangeLayerColor, data: { layerId } } = this.props
    onChangeLayerColor && onChangeLayerColor(layerId, color)
  }

  render () {
    const {
      selectedLayerId,
      textFilter,
      data: { visible, name, readOnly, color, dateFor = null, breadCrumbs, layerId },
    } = this.props
    const dateString = dateFor !== null ? moment(dateFor).format(DATE_TIME_FORMAT) : ''
    const isSelected = selectedLayerId === layerId
    return (
      <div
        className='layer-item-component-container'
        onClick={this.selectHandler}
      >
        <div className='layer-color-icon' style={{ background: color }}>
          <VisibilityButton
            title={i18n.LAYER_VISIBILITY}
            visible={visible}
            isDark={isSelected}
            className="layer-item-component-control"
            onChange={this.changeVisibilityHandler}
          />
        </div>
        <div className={'layer-item-component ' + (isSelected ? 'layer-item-component-selected ' : ' ') +
          (this.state.showColor ? 'layer-item-component-hover' : '')}>
          <div className="layer-item-component-title">
            <Tooltip title={breadCrumbs} placement='topLeft'>
              <div className="layer-name"><HighlightedText text={name} textFilter={textFilter}/></div>
            </Tooltip>
            <div className="layer-date">{dateString}</div>
          </div>
          <div className='color-picker-hover'>
            <ColorPicker
              onHandlerColor={(value) => this.onHandlerColor(value)}
              icon={IconNames.PALETTE}
              title={i18n.LAYERS_HIGHLIGHT_COLOR}
              className="map-item-component-control"
              color={color}
              onChange={this.changeColorHandler}
            />
          </div>
          {readOnly && <div title={i18n.ACCESS_READONLY}>
            <Icon
              className="layer-item-component-control"
              icon={iconNames.LOCK_ACTIVE}
            />
          </div>}
        </div>
      </div>
    )
  }
}

LayerItemComponent.propTypes = {
  ...TreeComponent.itemPropTypes,
  selectedLayerId: PropTypes.string,
  textFilter: PropTypes.instanceOf(TextFilter),
  data: PropTypes.object,
  onSelectLayer: PropTypes.func,
  onChangeLayerVisibility: PropTypes.func,
  onChangeLayerColor: PropTypes.func,
}
