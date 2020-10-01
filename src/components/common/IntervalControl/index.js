import React from 'react'
import { Tooltip } from 'antd'
import PropTypes from 'prop-types'
import DatePicker from '@DZVIN/CommonComponents/build/components/inputs/DatePicker'
import { DATE_TIME_FORMAT } from '../../../constants/formats'
import i18n from '../../../i18n'

import './style.css'

export default class IntervalControl extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      dateStart: this.props.from,
      dateEnd: this.props.to,
    }
  }

  ValidDateAfter = (current) => {
    if (this.state.dateStart === null) {
      return true
    }

    return current.isAfter(this.state.dateEnd)
  }

  ValidDateBefore = (current) => {
    if (this.state.dateEnd === null) {
      return true
    }

    return current.isBefore(this.state.dateStart)
  }

  onChangeFrom = (e) => {
    this.setState({ dateStart: e.target.value })
    this.props.onChangeFrom(e.target.value)
  }

  onChangeTo = (e) => {
    this.setState({ dateEnd: e.target.value })
    this.props.onChangeTo(e.target.value)
  }

  render () {
    return <div className='interval-control'>
      <span>{i18n.PERIOD_FROM}</span>
      <Tooltip
        title={i18n.PERIOD_START}
        placement='topRight'>
        <div className={'calendar-picker'}>
          <DatePicker
            value={this.state.dateStart}
            showTime={true}
            format={DATE_TIME_FORMAT}
            onChange={this.onChangeFrom}
            placeholder={''}
            isValidDate={this.ValidDateBefore}>
          </DatePicker>
        </div>
      </Tooltip>
      <span>{i18n.PERIOD_TO}</span>
      <Tooltip
        title={i18n.PERIOD_END}
        placement='topRight'
      >
        <div className={'calendar-picker'}>
          <DatePicker
            value={this.state.dateEnd}
            style={{ minWidth: 'auto' }}
            showTime={true}
            format={DATE_TIME_FORMAT}
            onChange={this.onChangeTo}
            placeholder={''}
            isValidDate={this.ValidDateAfter}
          />
        </div>
      </Tooltip>
    </div>
  }
}

IntervalControl.propTypes = {
  from: PropTypes.any,
  to: PropTypes.any,
  onChangeFrom: PropTypes.func,
  onChangeTo: PropTypes.func,
}
