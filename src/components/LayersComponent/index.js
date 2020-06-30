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
} from '@DZVIN/CommonComponents'
import { InputButton, IntervalControl, VisibilityButton } from '../common'
import i18n from '../../i18n'
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

  getCommonData = memoizeOne((selectedLayerId, textFilter, isMapCOP) => {
    const {
      onSelectLayer,
      onChangeMapColor,
      onChangeMapVisibility,
      onCloseMap,
      onPrintMap,
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
      onChangeLayerVisibility,
      onChangeLayerColor,
      isMapCOP,
    }
  })

  closeHandler = () => this.setState({ showCloseForm: true })

  cancelCloseHandler = () => this.setState({ showCloseForm: false })

  okCloseHandler = () => this.setState({ showCloseForm: false }, this.props.onCloseAllMaps)

  filterTextChangeHandler = (value) => {
    this.setState({ valueFilterLayers: value })
    this.props.onFilterTextChange(value.trim())
  }

  getFilteredIds = memoizeOne(getFilteredIds)

  render () {
    const {
      wrapper: Wrapper = React.Fragment,
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

    const filteredIds = this.getFilteredIds(textFilter, byIds)
    const expandedKeys = textFilter ? filteredIds : expandedIds

    return (
      <Wrapper title={i18n.LAYERS} icon={IconNames.LAYERS}>
        <div className="layers-component">
          <div className='container-layers'>
            <InputButton title={i18n.LAYERS} initValue={valueFilterLayers} onChange={this.filterTextChangeHandler}/>
            <div className='container-layers__btnContainer'>
              <Tooltip title={i18n.LAYERS_VISIBILITY} placement='topRight'>
                <IButton
                  icon={IconNames.COLORS}
                  colorType={ColorTypes.WHITE}
                  type={ButtonTypes.WITH_BG}
                  active={showLayers}
                  disabled={is3DMapMode}
                  onClick={() => this.setState((prev) => ({ showLayers: !prev.showLayers }))}
                />
              </Tooltip>
              {!isMapCOP && <Tooltip title={i18n.DISPLAY_PERIOD} placement='topRight'>
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
              commonData={this.getCommonData(selectedLayerId, textFilter, isMapCOP)}
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
              onChange={onChangeVisibility}
            />
            <div className='divider'/>
            <Tooltip title={i18n.CLOSE_MAP_SECTIONS} placement='topRight'>
              <IButton
                icon={IconNames.HIDE_MAP}
                colorType={ColorTypes.WITH_BG}
                disabled={roots?.length === 0}
                type={ButtonTypes.WHITE}
                onClick={onCloseMapSections}
              />
            </Tooltip>
            <div className='divider'/>
            <Tooltip title={i18n.LAYERS_CLOSE_ALL_MAPS} placement='topRight'>
              <IButton
                disabled={roots?.length === 0}
                icon={IconNames.CLOSE_MAP}
                onClick={this.closeHandler}
              />
            </Tooltip>
          </div>
        </div>
      </Wrapper>
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
