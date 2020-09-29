import React from 'react'
import { DatePicker, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import { TIME_FORMAT, DATE_TIME_FORMAT } from '../../../constants/formats'
import i18n from '../../../i18n'

import './style.css'

const idStart = 'dataPickerStart'
const idEnd = 'dataPickerEnd'

export default class IntervalControl extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      dateStart: this.props.from,
      dateEnd: this.props.to,
    }
  }

  disabledDateAfter = (current) => {
    if (this.state.dateEnd === null) {
      return false
    }

    return current.isAfter(this.state.dateEnd)
  }

  disabledDateBefore = (current) => {
    if (this.state.dateStart === null) {
      return false
    }

    return current.isBefore(this.state.dateStart)
  }

  onChangeFrom = (e) => {
    e && e.second && e.second(0) // сброс секунд при выборе интервала
    this.setState({ dateStart: e })
    this.props.onChangeFrom(e)
  }

  onChangeTo = (e) => {
    this.setState({ dateEnd: e })
    this.props.onChangeTo(e)
  }

  onOkFrom = () => {
    var event = new MouseEvent('mouseout', {
      'bubbles': true,
      'cancelable': true,
    })
    var cb = document.getElementById('dataPickerFrom')
    cb.dispatchEvent(event)
  }

  onOk = (id) => {
    var event = new MouseEvent('mouseout', {
      'bubbles': true,
      'cancelable': true,
    })
    const cb = document.getElementById(id)
    if (cb) {
      cb.dispatchEvent(event)
    }
  }

  render () {
    return (
      <div className='interval-control'>
        <span>{i18n.PERIOD_FROM}</span>
        <Tooltip title={i18n.PERIOD_START} placement='topRight'>
          <DatePicker
            id={idStart}
            value={this.state.dateStart}
            style={{ minWidth: 'auto' }}
            showTime={{ format: TIME_FORMAT }}
            format={DATE_TIME_FORMAT}
            onChange={this.onChangeFrom}
            onOk={() => this.onOk(idStart)}
            placeholder={''}
            disabledDate={this.disabledDateAfter}
          />
        </Tooltip>
        <span>{i18n.PERIOD_TO}</span>
        <Tooltip
          title={i18n.PERIOD_END}
          placement='topRight'
        >
          <DatePicker
            id={idEnd}
            value={this.state.dateEnd}
            style={{ minWidth: 'auto' }}
            showTime={{ format: TIME_FORMAT }}
            format={DATE_TIME_FORMAT}
            onChange={this.onChangeTo}
            onOk={() => this.onOk(idEnd)}
            placeholder={''}
            disabledDate={this.disabledDateBefore}
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
