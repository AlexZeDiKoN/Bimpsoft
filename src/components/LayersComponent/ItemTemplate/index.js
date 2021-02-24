import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import LayerItemComponent from '../LayerItemComponent'
import MapItemComponent from '../MapItemComponent'
import { catchErrors } from '../../../store/actions/asyncAction'
import { webMap } from '../../../store/actions'

const ItemTemplate = (props) =>
  props.data.id[0] === 'm' ? <MapItemComponent {...props} /> : <LayerItemComponent {...props}/>

const mapStateToProps = ({ maps: { byId } }, { data }) => {
  const isMapCOP = data.hasOwnProperty('isCOP') ? data.isCOP : byId[data.mapId].isCOP

  return {
    isMapCOP,
  }
}

const mapDispatchToProps = {
  onOpenReportMap: (dataMap) => webMap.toggleReportMapModal(true, dataMap),
}

export default connect(mapStateToProps, catchErrors(mapDispatchToProps))(ItemTemplate)

ItemTemplate.propTypes = {
  data: PropTypes.object,
}
