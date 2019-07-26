import { connect } from 'react-redux'
import WebMap3DInner from '../components/WebMap3D'

const defaultCenter = { lat: 48.5, lng: 38 }
const defaultZoom = 14

const WebMap3DContainer = connect(
  (state) => ({
    objects: state.webMap.objects,
    center: state.webMap.center || defaultCenter,
    zoom: state.webMap.zoom || defaultZoom,
  }),
)(WebMap3DInner)
WebMap3DContainer.displayName = 'WebMap3D'

export default WebMap3DContainer
