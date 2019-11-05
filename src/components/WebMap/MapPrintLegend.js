import React from 'react'
import PropTypes from 'prop-types'
import leaflet from 'leaflet'
import memoizeOne from 'memoize-one'
import { printLegend } from '../../utils'
import { MapPortal, renderZoomable } from './MapContext'

// TODO: заменить реальными данными
const signatories = [
  { position: `Начальник штабу`, role: `полковник`, name: `О.С. Харченко`, date: `21.12.18` },
  { position: `Начальник оперативного управління`, role: `полковник`, name: `І.І. Панас`, date: `22.12.18` },
]
const confirmDate = `22.12.18`

const crs = leaflet.CRS.EPSG3857

const getBounds = (southWest, northEast, zoom, offset) => {
  const { x: x1, y: y1 } = crs.latLngToPoint(southWest, zoom)
  const { x: x2, y: y2 } = crs.latLngToPoint(northEast, zoom)
  return {
    min: {
      x: Math.round(Math.min(x1, x2) - offset.x),
      y: Math.round(Math.min(y1, y2) - offset.y),
    },
    max: {
      x: Math.round(Math.max(x1, x2) - offset.x),
      y: Math.round(Math.max(y1, y2) - offset.y),
    },
  }
}

const getDimension = (printScale, selectedZone, zoom, animZoom, offset, animOffset) => {
  const { southWest, northEast } = selectedZone
  const bounds = getBounds(southWest, northEast, animZoom || zoom, animOffset || offset)
  const scaleFrom = crs.scale(zoom)
  const scaleTo = animZoom ? crs.scale(animZoom) : scaleFrom

  const scale = scaleTo / scaleFrom
  const width = (bounds.max.x - bounds.min.x) / scale
  const height = (bounds.max.y - bounds.min.y) / scale

  const widthMM = crs.distance(
    { lat: northEast.lat, lng: northEast.lng },
    { lat: northEast.lat, lng: southWest.lng },
  ) / printScale * 1000

  const heightMM = height * widthMM / width
  return { width, height, tx: bounds.min.x, ty: bounds.min.y, scale, widthMM, heightMM }
}

export default class MapPrintLegend extends React.Component {
  static propTypes = {
    center: PropTypes.object,
    printStatus: PropTypes.bool,
    selectedZone: PropTypes.object,
    requisites: PropTypes.object,
    printScale: PropTypes.number,
    securityClassification: PropTypes.object,
  }

  getDimension = memoizeOne(getDimension)

  renderByZoom = ({ zoom, animZoom, offset, animOffset }) => {
    const { selectedZone, requisites, printScale, securityClassification: { classified } } = this.props
    const { dpi } = requisites
    const { width, height, tx, ty, scale, widthMM, heightMM } =
      this.getDimension(printScale, selectedZone, zoom, animZoom, offset, animOffset)

    return <svg
      className="leaflet-zoom-animated"
      style={{ pointerEvents: 'none', width, height, transform: `translate(${tx}px,${ty}px) scale(${scale})` }}
      viewBox={`0 0 ${widthMM} ${heightMM}`}
    >
      {printLegend({ widthMM, heightMM, dpi, requisites, signatories, confirmDate, printScale, classified })}
    </svg>
  }

  render () {
    const { selectedZone, printScale, printStatus } = this.props
    if (!printStatus || selectedZone === null || !printScale) {
      return null
    }
    return <MapPortal>{renderZoomable(this.renderByZoom)}</MapPortal>
  }
}
