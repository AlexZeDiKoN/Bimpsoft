import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import { data, components, IconNames, IButton } from '@C4/CommonComponents'
import { Tooltip } from 'antd'
import moment from 'moment'
import { VisibilityButton } from '../../common'
import ColorPicker from '../../common/ColorPicker'
import i18n from '../../../i18n'
import { MOUSE_ENTER_DELAY, DBL_CLICK_TIME } from '../../../constants/tooltip'
import { DATE_TIME_FORMAT_FULL } from '../../../constants/formats'
import DeleteMapForm from './DeleteMapForm'

const { TextFilter } = data
const { common: { TreeComponent, HighlightedText } } = components

export default class MapItemComponent extends React.Component {
  state = {
    showCloseForm: false,
    showColor: false,
    clickTime: 0,
  }

  onHandlerColor = (value) => this.setState({ showColor: value })

  changeMapVisibilityHandler = () => {
    const { onChangeMapVisibility, data: { mapId, visible } } = this.props
    onChangeMapVisibility && onChangeMapVisibility(mapId, !visible)
  }

  changeColorHandler = (color) => {
    const { onChangeMapColor, data: { mapId } } = this.props
    onChangeMapColor && onChangeMapColor(mapId, color)
  }

  closeHandler = () => {
    const { cancelVariant, openedVariantMapId } = window.explorerBridge
    this.setState({ showCloseForm: true })
    if (this.props.data.mapId === openedVariantMapId) {
      cancelVariant()
    }
  }

  cancelCloseHandler = () => this.setState({ showCloseForm: false })

  okCloseHandler = () => this.setState({ showCloseForm: false }, () => {
    const { onCloseMap, data: { mapId } } = this.props
    onCloseMap && onCloseMap(mapId)
  })

  onPrintMapHandler = () => {
    const { onPrintMap, data: { mapId, name } } = this.props
    const currentDateTime = moment(Date.now()).format(DATE_TIME_FORMAT_FULL)
    onPrintMap && onPrintMap(mapId, `${name}[${currentDateTime}]`)
  }

  updateMap = () => {
    const { onUpdateMap, data: { mapId } } = this.props
    onUpdateMap && onUpdateMap(mapId)
  }

  onUpdateMapHandler = () => {
    const { clickTime } = this.state
    const now = Date.now()
    if (clickTime && now - clickTime < DBL_CLICK_TIME) {
      this.setState({ clickTime: 0 }, this.updateMap)
    } else {
      this.setState({ clickTime: now })
    }
  }

  onShowReportMapModal = (dataMap) => {
    this.props.onOpenReportMap(dataMap)
  }

  render () {
    const { showCloseForm, showColor } = this.state
    const {
      textFilter,
      data: { visible, name, color, breadCrumbs },
      tree: { expanded, canExpand, onExpand },
    } = this.props

    return (
      <div className={'map-item-component ' + (showColor ? 'map-item-component-hover' : '')}>
        <div className={'color-container'} style={{ border: `6px solid ${color}` }}>
          <VisibilityButton
            title={i18n.MAP_VISIBILITY}
            className="map-item-component-control"
            visible={visible}
            isDark={true}
            onChange={this.changeMapVisibilityHandler}
          />
        </div>
        <div className={expanded ? 'expand-icon-collapse expand-icon' : 'expand-icon expand-icon-expanded'}>
          <IButton
            title={expanded ? i18n.LAYERS_ROLL_UP : i18n.LAYERS_ROLL_DOWN}
            icon={IconNames.NEXT}
            onClick={onExpand}
            disabled={!canExpand}
          />
        </div>
        {showCloseForm && (<DeleteMapForm
          name={name}
          onCancel={this.cancelCloseHandler}
          onOk={this.okCloseHandler}
        />)}
        <div className='map-item-component-icon'>
          <IButton icon={IconNames.OPEN_MAP}/>
        </div>
        <span className="map-item-component-title" title={breadCrumbs} onClick={this.onUpdateMapHandler}>
          <HighlightedText
            text={name}
            textFilter={textFilter}
          />
        </span>
        <div className='color-picker-hover'>
          <Tooltip title={i18n.CREATE_REPORT_MAP} mouseEnterDelay={MOUSE_ENTER_DELAY} placement='topRight'>
            <IButton
              icon={IconNames.BAR_2_SAVE}
              onClick={() => this.onShowReportMapModal(this.props.data)}
            />
          </Tooltip>
          <Tooltip title={i18n.PRINT_BUTTON} mouseEnterDelay={MOUSE_ENTER_DELAY} placement='topRight'>
            <IButton
              icon={IconNames.MENU_PRINT}
              onClick={this.onPrintMapHandler}
            />
          </Tooltip>
          <ColorPicker
            onHandlerColor={(value) => this.onHandlerColor(value)}
            icon={IconNames.PALETTE}
            title={i18n.LAYERS_HIGHLIGHT_COLOR}
            className="map-item-component-control"
            color={color}
            onChange={this.changeColorHandler}
          />
          <Tooltip title={i18n.LAYERS_CLOSE_CURRENT_MAP} mouseEnterDelay={MOUSE_ENTER_DELAY} placement='topRight'>
            <IButton
              icon={IconNames.CLOSE_MAP}
              onClick={this.closeHandler}
            />
          </Tooltip>
        </div>
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
  onUpdateMap: PropTypes.func,
}
