import React from 'react'
import PropTypes from 'prop-types'
import memoizeOne from 'memoize-one'
import { Tooltip } from 'antd'
import './style.css'
import {
  components,
  data,
  ColorTypes,
  IconNames,
  ButtonTypes,
  IButton,
} from '@C4/CommonComponents'
import { isEmpty } from 'ramda'
import { InputButton, IntervalControl, VisibilityButton } from '../common'
import i18n from '../../i18n'
import { MOUSE_ENTER_DELAY } from '../../constants/tooltip'
import { BlockHotKeyContainer } from '../common/HotKeys'
import { shortcuts } from '../../constants'
import LayersControlsComponent from './LayersControlsComponent'
import ItemTemplate from './ItemTemplate'

const { TextFilter } = data
const { common: { TreeComponent: { TreeComponentUncontrolled } } } = components

const getFilteredIds = TextFilter.getFilteredIdsFunc(
  (item) => item.name,
  (item) => item.id,
  (item) => item.parentId,
)

export default class LayersComponent extends React.Component {
  static displayName = 'LayersComponent'

  state = {
    showPeriod: false,
    showLayers: false,
    showSearch: false,
    showCloseForm: false,
    valueFilterLayers: '',
  }

  getCommonData = memoizeOne((selectedLayerId, textFilter) => {
    const {
      onSelectLayer,
      onChangeMapColor,
      onChangeMapVisibility,
      onCloseMap,
      onPrintMap,
      onUpdateMap,
      onUpdateLayer,
      onChangeLayerVisibility,
      onChangeLayerColor,
    } = this.props

    return {
      selectedLayerId,
      textFilter,
      onSelectLayer,
      onChangeMapColor,
      onChangeMapVisibility,
      onCloseMap,
      onPrintMap,
      onUpdateMap,
      onUpdateLayer,
      onChangeLayerVisibility,
      onChangeLayerColor,
    }
  })

  closeHandler = () => {
    this.setState({ showCloseForm: true })
    window.explorerBridge.cancelVariant()
  }

  cancelCloseHandler = () => this.setState({ showCloseForm: false })

  okCloseHandler = () => this.setState({ showCloseForm: false }, this.props.onCloseAllMaps)

  filterTextChangeHandler = (value) => {
    this.setState({ valueFilterLayers: value })
    this.props.onFilterTextChange(value.trim())
  }

  getFilteredIds = memoizeOne(getFilteredIds)

  render () {
    const {
      timelineFrom,
      timelineTo,
      onChangeTimeLineFrom,
      onChangeTimeLineTo,
      visible,
      onChangeVisibility,
      backOpacity,
      onChangeBackOpacity,
      hiddenOpacity,
      onChangeHiddenOpacity,
      byIds,
      roots,
      selectedLayerId,
      onExpand,
      expandedIds,
      textFilter,
      is3DMapMode,
      onCloseMapSections,
      isMapCOP,
    } = this.props

    const { showLayers, showPeriod, showCloseForm, valueFilterLayers } = this.state
    const mapsCollapsed = isEmpty(expandedIds) // все карты свернуты
    const filteredIds = this.getFilteredIds(textFilter, byIds)
    const expandedKeys = textFilter ? filteredIds : expandedIds
    const disabledControlButton = !roots?.length
    return (
      <div className="layers-component">
        <div className='container-layers'>
          <BlockHotKeyContainer hotKey={[ shortcuts.EDIT_KEY ]}>
            <InputButton title={i18n.LAYERS} initValue={valueFilterLayers} onChange={this.filterTextChangeHandler}/>
          </BlockHotKeyContainer>
          <div className='container-layers__btnContainer'>
            <Tooltip title={i18n.LAYERS_VISIBILITY} mouseEnterDelay={MOUSE_ENTER_DELAY} placement='topRight'>
              <IButton
                icon={IconNames.COLORS}
                colorType={ColorTypes.WHITE}
                type={ButtonTypes.WITH_BG}
                active={showLayers}
                disabled={is3DMapMode}
                onClick={() => this.setState((prev) => ({ showLayers: !prev.showLayers }))}
              />
            </Tooltip>
            {!isMapCOP && isMapCOP !== undefined &&
            <Tooltip mouseEnterDelay={MOUSE_ENTER_DELAY} title={i18n.DISPLAY_PERIOD} placement='topRight'>
              <IButton
                icon={IconNames.CALENDAR}
                colorType={ColorTypes.WHITE}
                type={ButtonTypes.WITH_BG}
                active={showPeriod}
                onClick={() => this.setState((prev) => ({ showPeriod: !prev.showPeriod }))}
              />
            </Tooltip>}
          </div>
        </div>
        {(!is3DMapMode) &&
          <div className={'container-layers-controls'} style={{ height: showLayers ? 46 : 0 }}>
            <LayersControlsComponent
              backOpacity={backOpacity}
              cancelCloseHandler={this.cancelCloseHandler}
              showCloseForm={showCloseForm}
              okCloseHandler={this.okCloseHandler}
              onChangeBackOpacity={onChangeBackOpacity}
              hiddenOpacity={hiddenOpacity}
              onChangeHiddenOpacity={onChangeHiddenOpacity}
            />
          </div>
        }
        <div className='interval-control-container' style={{ height: showPeriod ? 48 : 0 }}>
          <IntervalControl
            showPeriod={showPeriod}
            from={timelineFrom}
            to={timelineTo}
            onChangeFrom={onChangeTimeLineFrom}
            onChangeTo={onChangeTimeLineTo}
          />
        </div>
        <div className="tree-layers-container">
          <TreeComponentUncontrolled
            className="tree-layers"
            byIds={byIds}
            roots={roots}
            commonData={this.getCommonData(selectedLayerId, textFilter)}
            itemTemplate={ItemTemplate}
            expandedKeys={expandedKeys}
            filteredIds={filteredIds}
            onExpand={onExpand}
          />
        </div>
        <div className='control-button'>
          <VisibilityButton
            title={i18n.MAPS_VISIBILITY}
            className="layers-controls-control"
            visible={visible}
            disabled={disabledControlButton}
            onChange={onChangeVisibility}
          />
          <div className='divider'/>
          <Tooltip
            mouseEnterDelay={MOUSE_ENTER_DELAY}
            title={mapsCollapsed ? i18n.EXPAND_LAYERS : i18n.COLLAPSE_LAYERS}
            placement='topRight'>
            <IButton
              icon={mapsCollapsed ? IconNames.EXPAND_LAYER : IconNames.COLLAPSE_LAYER }
              colorType={ColorTypes.WITH_BG}
              disabled={disabledControlButton}
              type={ButtonTypes.WHITE}
              onClick={() => onCloseMapSections(mapsCollapsed)}
            />
          </Tooltip>
          <div className='divider'/>
          <Tooltip title={i18n.LAYERS_CLOSE_ALL_MAPS} mouseEnterDelay={MOUSE_ENTER_DELAY} placement='topRight'>
            <IButton
              disabled={disabledControlButton}
              icon={IconNames.CLOSE_MAP}
              onClick={this.closeHandler}
            />
          </Tooltip>
        </div>
      </div>
    )
  }
}

LayersComponent.propTypes = {
  wrapper: PropTypes.any,
  selectedLayerId: PropTypes.any,
  textFilter: PropTypes.instanceOf(TextFilter),
  byIds: PropTypes.object,
  roots: PropTypes.array,
  isMapCOP: PropTypes.bool,
  onSelectLayer: PropTypes.func,
  onChangeFrom: PropTypes.func,
  expandedIds: PropTypes.object.isRequired,
  onExpand: PropTypes.func,
  onChangeTo: PropTypes.func,
  onChangeMapColor: PropTypes.func,
  onChangeMapVisibility: PropTypes.func,
  onChangeLayerVisibility: PropTypes.func,
  onChangeLayerColor: PropTypes.func,
  onCloseMap: PropTypes.func,
  onPrintMap: PropTypes.func,
  onUpdateMap: PropTypes.func,
  onUpdateLayer: PropTypes.func,
  timelineFrom: PropTypes.any,
  timelineTo: PropTypes.any,
  onChangeTimeLineFrom: PropTypes.func,
  onChangeTimeLineTo: PropTypes.func,
  visible: PropTypes.bool,
  onChangeVisibility: PropTypes.func,
  backOpacity: PropTypes.number,
  onChangeBackOpacity: PropTypes.func,
  hiddenOpacity: PropTypes.number,
  onChangeHiddenOpacity: PropTypes.func,
  onCloseAllMaps: PropTypes.func,
  onCloseMapSections: PropTypes.func,
  onFilterTextChange: PropTypes.func,
  is3DMapMode: PropTypes.bool.isRequired,
}
