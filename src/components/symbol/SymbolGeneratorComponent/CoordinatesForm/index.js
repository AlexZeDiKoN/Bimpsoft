import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import Coordinates from './Coordinates'

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
        <div className="coordinate-form-title">Розташування</div>
        <div className="coordinate-form-controls">
          <label>Висота (глибина)</label>
          <input
            onChange = { this.changeZHandler }
            value={z}
          />
          <label>Координати</label>
          <select
            onChange = { this.changeTypeHandler }
            value={type}
          >
            {type === null && (<option>Виберіть</option>)}
            <option value={Coordinates.types.WGS_84}>WGS-84</option>
            <option value={Coordinates.types.USK_2000}>УСК-2000</option>
            <option value={Coordinates.types.MJRS}>MJRS</option>
          </select>
          <label>Ш</label>
          <input
            onChange = { this.changeYHandler }
            value={y}
          />
          <label>Д</label>
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
