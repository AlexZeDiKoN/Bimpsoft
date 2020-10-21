import { connect } from 'react-redux'
import WrappedMarch from '../components/common/March'
import { march, webMap } from '../store/actions'
import { catchErrors } from '../store/actions/asyncAction'

const mapStateToProps = ({ march: {
  indicators,
  segments,
  integrity,
  pointsTypes,
  time,
  distance,
  isCoordFilled,
  geoLandmarks,
  readOnly,
  isChanged }, webMap }) => ({
  indicators,
  segmentList: segments,
  integrity,
  pointsTypes,
  time,
  distance,
  isCoordFilled,
  coordTypeSystem: webMap.get('coordinatesType'),
  geoLandmarks,
  readOnly,
  isChanged,
})

const mapDispatchToProps = {
  setMarchParams: march.setMarchParams,
  setIntegrity: march.setIntegrity,
  editFormField: march.editFormField,
  addSegment: march.addSegment,
  deleteSegment: march.deleteSegment,
  addChild: march.addChild,
  deleteChild: march.deleteChild,
  setCoordMode: march.setCoordMode,
  setRefPointOnMap: march.setRefPointOnMap,
  openMarch: march.openMarch,
  sendMarchToExplorer: march.sendMarchToExplorer,
  closeMarch: march.closeMarch,
  toggleGeoLandmarkModal: webMap.toggleGeoLandmarkModal,
  toggleDeleteMarchPointModal: webMap.toggleDeleteMarchPointModal,
  setGeoLandmarks: march.setGeoLandmarks,
  getRoute: march.getRoute,
  setActivePoint: march.setActivePoint,
}

const MarchContainer = connect(
  mapStateToProps,
  catchErrors(mapDispatchToProps),
)(WrappedMarch)

export default MarchContainer
