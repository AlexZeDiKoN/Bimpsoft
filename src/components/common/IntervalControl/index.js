import React from 'react'
import { DatePicker } from 'antd'
import PropTypes from 'prop-types'
import './style.css'

const DATE_FORMAT = 'YYYY-MM-DD HH:mm'
const TIME_FORMAT = 'HH:mm'

export default class IntervalControl extends React.Component {

  render () {
    return (
      <div className="interval-control">
        <span className="interval-control-label">Період з</span>
        <DatePicker
          value={this.props.from}
          showTime={{ format: TIME_FORMAT }}
          format={DATE_FORMAT}
          onChange={this.props.onChangeFrom}
        />
        <span className="interval-control-label">до</span>
        <DatePicker
          value={this.props.to}
          showTime={{ format: TIME_FORMAT }}
          format={DATE_FORMAT}
          onChange={this.props.onChangeTo}
        />
      </div>
    )
  }
}

const dateType = PropTypes.oneOfType([ PropTypes.string, PropTypes.instanceOf(Date) ])

IntervalControl.propTypes = {
  from: dateType,
  to: dateType,
  onChangeFrom: PropTypes.func,
  onChangeTo: PropTypes.func,
}
