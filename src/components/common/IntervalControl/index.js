import React from 'react'
import { DatePicker, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import { TIME_FORMAT, DATE_TIME_FORMAT } from '../../../constants/formats'
import i18n from '../../../i18n'

import './style.css'

export default class IntervalControl extends React.Component {
  render () {
    const { from, to, onChangeFrom, onChangeTo } = this.props
    return (
      <div className='interval-control'>
        <span>{i18n.PERIOD_FROM}</span>
        <Tooltip title={i18n.PERIOD_START} placement='topRight'>
          <DatePicker
            value={from}
            style={{ width: 'auto', minWidth: 'auto' }}
            showTime={{ format: TIME_FORMAT }}
            format={DATE_TIME_FORMAT}
            onChange={onChangeFrom}
            placeholder={''}
          />
        </Tooltip>
        <span>{i18n.PERIOD_TO}</span>
        <Tooltip title={i18n.PERIOD_END} placement='topRight'>
          <DatePicker
            value={to}
            style={{ width: 'auto', minWidth: 'auto' }}
            showTime={{ format: TIME_FORMAT }}
            format={DATE_TIME_FORMAT}
            onChange={onChangeTo}
            placeholder={''}
          />
        </Tooltip>
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
