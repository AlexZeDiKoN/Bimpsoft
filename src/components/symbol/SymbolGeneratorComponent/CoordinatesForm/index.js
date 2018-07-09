import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import Coordinates from './Coordinates'
import i18n from "../../i18n";

export default class CoordinatesForm extends React.Component {
  changeCoordinate = (o) => {
    const { coordinates = {} } = this.props
    this.props.onChange({ ...coordinates, ...o })
  }

  changeZHandler = (e) => this.changeCoordinate({ z: e.target.value })

  changeYHandler = (e) => this.changeCoordinate({ y: e.target.value })

  changeXHandler = (e) => this.changeCoordinate({ x: e.target.value })

  changeTypeHandler = (e) => this.changeCoordinate({ type: e.target.value })

  render () {
    const { coordinates = {} } = this.props
    const { type = null, x, y, z } = coordinates
    return (
      <div className="coordinate-form" >
        <div className="coordinate-form-title">{i18n.POSITION}</div>
        <div className="coordinate-form-controls">
          <label>{i18n.AMPLIFIER_ALTITUDE_DEPTH}</label>
          <input
            onChange = { this.changeZHandler }
            value={z}
          />
          <label>{i18n.AMPLIFIER_LOCATION}</label>
          <select
            onChange = { this.changeTypeHandler }
            value={type}
          >
            {type === null && (<option>------</option>)}
            <option value={Coordinates.types.WGS_84}>{i18n.WGS_84}</option>
            <option value={Coordinates.types.USK_2000}>{i18n.USK_2000}</option>
            <option value={Coordinates.types.MGRS}>{i18n.MGRS}</option>
          </select>
          <label>{i18n.LATITUDE_SHORT}</label>
          <input
            onChange = { this.changeYHandler }
            value={y}
          />
          <label>{i18n.LONGITUDE_SHORT}</label>
          <input
            onChange = { this.changeXHandler }
            value={x}
          />
        </div>
      </div>
    )
  }
}

CoordinatesForm.propTypes = {
  coordinates: PropTypes.object,
  onChange: PropTypes.func,
}
