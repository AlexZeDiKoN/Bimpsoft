import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import i18n from '../../i18n'
import Coordinates from './Coordinates'

export default class CoordinatesForm extends React.Component {
  changeCoordinate = ({ target: { value, name } }) => {
    const { coordinates = {} } = this.props
    this.props.onChange({ ...coordinates, [name]: value })
  }

  render () {
    const { coordinates = {} } = this.props

    const getInputProps = (name) => ({ name, value: coordinates[name] || '', onChange: this.changeCoordinate })

    const isTypeDefined = coordinates[Coordinates.options.KEY_TYPE] === undefined

    return (
      <div className="coordinate-form" >
        <div className="coordinate-form-title">{i18n.POSITION}</div>
        <div className="coordinate-form-controls">
          <label>{i18n.AMPLIFIER_ALTITUDE_DEPTH}</label>
          <input { ...getInputProps(Coordinates.options.KEY_Z)} />
          <label>{i18n.AMPLIFIER_LOCATION}</label>
          <select { ...getInputProps(Coordinates.options.KEY_TYPE)} >
            {isTypeDefined && (<option value="">{i18n.UNDEFINED}</option>)}
            <option value={Coordinates.types.WGS_84}>{i18n.WGS_84}</option>
            <option value={Coordinates.types.USK_2000}>{i18n.USK_2000}</option>
            <option value={Coordinates.types.MGRS}>{i18n.MGRS}</option>
          </select>
          <label>{i18n.LATITUDE_SHORT}</label>
          <input {...getInputProps(Coordinates.options.KEY_Y)} />
          <label>{i18n.LONGITUDE_SHORT}</label>
          <input { ...getInputProps(Coordinates.options.KEY_X)} />
        </div>
      </div>
    )
  }
}

CoordinatesForm.propTypes = {
  coordinates: PropTypes.object,
  onChange: PropTypes.func,
}
