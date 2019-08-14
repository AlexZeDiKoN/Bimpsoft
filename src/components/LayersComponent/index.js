import React from 'react'
import PropTypes from 'prop-types'
import memoizeOne from 'memoize-one'
import { Input } from 'antd'
import './style.css'
import { components, data } from '@DZVIN/CommonComponents'
import { IntervalControl } from '../common'
import i18n from '../../i18n'
import LayersControlsComponent from './LayersControlsComponent'
import MapItemComponent from './MapItemComponent'
import LayerItemComponent from './LayerItemComponent'

const { TextFilter } = data
const { common: { TreeComponent: { TreeComponentUncontrolled } } } = components

const ItemTemplate = (props) =>
  props.data.id[0] === 'm' ? <MapItemComponent {...props} /> : <LayerItemComponent {...props}/>

ItemTemplate.propTypes = {
  data: PropTypes.object,
}

const getFilteredIds = TextFilter.getFilteredIdsFunc(
  (item) => item.name,
  (item) => item.id,
  (item) => item.parentId
)

export default class LayersComponent extends React.Component {
  getCommonData = memoizeOne((selectedLayerId, textFilter) => {
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
    }
  })

  filterTextChangeHandler = ({ target: { value } }) => {
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
      onCloseAllMaps,
      byIds,
      roots,
      selectedLayerId,
      onExpand,
      expandedIds,
      textFilter,
      is3DMapMode,
    } = this.props

    const filteredIds = this.getFilteredIds(textFilter, byIds)
    const expandedKeys = textFilter ? filteredIds : expandedIds

    return (
      <Wrapper title={i18n.LAYERS}>
        <div className="layers-component">
          <Input.Search placeholder={ i18n.FILTER } onChange={this.filterTextChangeHandler} />
          <IntervalControl
            from={timelineFrom}
            to={timelineTo}
            onChangeFrom={onChangeTimeLineFrom}
            onChangeTo={onChangeTimeLineTo}
          />
          {!is3DMapMode &&
            <LayersControlsComponent
              visible={visible}
              onChangeVisibility={onChangeVisibility}
              backOpacity={backOpacity}
              onChangeBackOpacity={onChangeBackOpacity}
              hiddenOpacity={hiddenOpacity}
              onChangeHiddenOpacity={onChangeHiddenOpacity}
              onCloseAllMaps={onCloseAllMaps}
            />
          }
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
  onFilterTextChange: PropTypes.func,
  is3DMapMode: PropTypes.bool.isRequired,
}
