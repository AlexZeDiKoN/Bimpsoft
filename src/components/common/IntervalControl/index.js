import React from 'react'
import PropTypes from 'prop-types'
import DatePicker from '@C4/CommonComponents/build/components/inputs/DatePicker'
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

  validDateAfter = (current) => {
    if (this.state.dateStart === null) {
      return true
    }
    if (this.state.dateEnd?.isValid && this.state.dateEnd.isValid()) {
      current.hour(this.state.dateEnd.hour())
      current.minute(this.state.dateEnd.minute())
    }
    return current.isAfter(this.state.dateStart)
  }

  validDateBefore = (current) => {
    if (this.state.dateEnd === null) {
      return true
    }
    if (this.state.dateStart?.isValid && this.state.dateStart.isValid()) {
      current.hour(this.state.dateStart.hour())
      current.minute(this.state.dateStart.minute())
    }
    return current.isBefore(this.state.dateEnd)
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
      <div className={'calendar-picker'}>
        <DatePicker
          title={i18n.PERIOD_START}
          value={this.state.dateStart}
          showTime={true}
          format={DATE_TIME_FORMAT}
          onChange={this.onChangeFrom}
          placeholder={''}
          isValidDate={this.validDateBefore}>
        </DatePicker>
      </div>
      <span>{i18n.PERIOD_TO}</span>
      <div className={'calendar-picker'}>
        <DatePicker
          title={i18n.PERIOD_END}
          value={this.state.dateEnd}
          style={{ minWidth: 'auto' }}
          showTime={true}
          format={DATE_TIME_FORMAT}
          onChange={this.onChangeTo}
          placeholder={''}
          isValidDate={this.validDateAfter}
        />
      </div>
    </div>
  }
}

IntervalControl.propTypes = {
  from: PropTypes.any,
  to: PropTypes.any,
  onChangeFrom: PropTypes.func,
  onChangeTo: PropTypes.func,
}
