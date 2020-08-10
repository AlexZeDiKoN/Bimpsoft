import React, { useState } from 'react'
import PropTypes from 'prop-types'

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

const dateOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  timeZone,
}

const timeOptions = {
  hour: 'numeric',
  minute: 'numeric',
  timeZone,
}

const locales = window.navigator.language

const ItemList = (props) => {
  const { time, user, event, highlightObject, object, id } = props
  const [ baseColor ] = useState(object ? object.attributes.color : null)
  const onMouseOver = baseColor === null ? null : () => highlightObject(id)
  const onMouseOut = baseColor === null ? null : () => highlightObject(id, baseColor)

  const formatDate = new Date(time).toLocaleDateString(locales, dateOptions)
  const formatTime = new Date(time).toLocaleTimeString(locales, timeOptions)

  return (
    <div className={'item-list-log'}>
      <div className={'time-user'}>
        <div className={'time'}>
          {`${formatDate} ${formatTime}`}
        </div>
        <div className={'user'}>
          <div>
            {user}
          </div>
        </div>
      </div>
      <div
        className={'event'}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
      >
        {event}
      </div>
    </div>
  )
}

ItemList.propTypes = {
  time: PropTypes.number.isRequired,
  event: PropTypes.string.isRequired,
  user: PropTypes.string.isRequired,
  highlightObject: PropTypes.func.isRequired,
  object: PropTypes.object,
  id: PropTypes.string.isRequired,
}

export default ItemList