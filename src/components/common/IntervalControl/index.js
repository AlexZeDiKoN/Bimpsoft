import React from 'react'
import { DatePicker } from 'antd'
import PropTypes from 'prop-types'
import './style.css'
import { TIME_FORMAT, DATE_TIME_FORMAT } from '../../../constants/formats'

export default class IntervalControl extends React.Component {
  render () {
    return (
      <div className="interval-control">
        <span className="interval-control-label">Період з</span>
        <DatePicker
          value={this.props.from}
          showTime={{ format: TIME_FORMAT }}
          format={DATE_TIME_FORMAT}
          onChange={this.props.onChangeFrom}
        />
        <span className="interval-control-label">до</span>
        <DatePicker
          value={this.props.to}
          showTime={{ format: TIME_FORMAT }}
          format={DATE_TIME_FORMAT}
          onChange={this.props.onChangeTo}
        />
      </div>
    )
  }
}

IntervalControl.propTypes = {
  from: PropTypes.any,
  to: PropTypes.any,
  onChangeFrom: PropTypes.func,
  onChangeTo: PropTypes.func,
}
