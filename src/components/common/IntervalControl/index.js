import React from 'react'
import { DatePicker } from 'antd'
import PropTypes from 'prop-types'
import { TIME_FORMAT, DATE_TIME_FORMAT } from '../../../constants/formats'
import i18n from '../../../i18n'

import './style.css'

export default class IntervalControl extends React.Component {
  render () {
    return (
      <div className="interval-control">
        <span className="interval-control-label">{i18n.PERIOD_FROM}</span>
        <DatePicker
          value={this.props.from}
          style={{ width: 'auto', minWidth: 'auto' }}
          showTime={{ format: TIME_FORMAT }}
          format={DATE_TIME_FORMAT}
          onChange={this.props.onChangeFrom}
          placeholder={i18n.DATE}
        />
        <span className="interval-control-label">{i18n.PERIOD_TO}</span>
        <DatePicker
          value={this.props.to}
          style={{ width: 'auto', minWidth: 'auto' }}
          showTime={{ format: TIME_FORMAT }}
          format={DATE_TIME_FORMAT}
          onChange={this.props.onChangeTo}
          placeholder={i18n.DATE}
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
