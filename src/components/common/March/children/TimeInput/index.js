import React from 'react'
import PropTypes from 'prop-types'
import { Input } from 'antd'
import utilsMarch from '../../utilsMarch'
const { msToTime, hoursToMs } = utilsMarch.convertUnits

const maxHours = 72

const hoursMinutesMask = (value) => {
  const reg = /^-?[0-9]*(:?)([0-9]{1,2})?$/

  return reg.test(value)
}

const getFilteredTime = (time) => {
  const inputString = time.toString()
  let formatTime = ''

  if (hoursMinutesMask(inputString)) {
    let [ hours, minutes ] = inputString.split(':')

    hours = hours || '00'
    minutes = minutes || '00'

    hours = +hours > maxHours ? `${maxHours}` : hours

    if (minutes.length > 2) {
      minutes = minutes.slice(0, 2)
    }

    hours = `0${hours}`.slice(-2)
    minutes = minutes.length < 2 ? minutes + '0' : minutes

    formatTime = `${hours}:${minutes}`
  }

  return formatTime
}

const timeToMs = (formatTime) => {
  let [ hours, minutes ] = formatTime.split(':')

  hours = hours || '00'
  minutes = minutes || '00'

  minutes = minutes.length > 2 ? minutes.slice(0, 2) : minutes

  const hoursInMs = hoursToMs(Number(hours))
  const minutesInMs = +minutes * 60000

  return hoursInMs + minutesInMs
}

const TimeInput = (props) => {
  const { value: millisecond } = props
  const time = msToTime(millisecond)

  const onBlur = (e) => {
    const milliseconds = +timeToMs(e.target.value)

    if (milliseconds >= 0) {
      props.onBlur(milliseconds)
    }
  }

  const onChange = (e) => {
    const milliseconds = Number(timeToMs(e.target.value))

    if (milliseconds >= 0) {
      props.onChange(milliseconds)
    }
  }

  return (
    <Input {...props} value={ getFilteredTime(time)} onBlur={onBlur} onChange={onChange}/>
  )
}

TimeInput.propTypes = {
  value: PropTypes.number.isRequired,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default React.memo(TimeInput)
