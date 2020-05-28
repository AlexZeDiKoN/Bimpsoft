import React from 'react'
import { Divider } from 'antd'

import { components, FormDivider } from '@DZVIN/CommonComponents'

// const { Divider } = components.form

const ItemList = (props) => {
  const { time, user, event } = props

  const vb = Date.now()

  // const options = {
  //   year: 'numeric',
  //   month: 'numeric',
  //   day: 'numeric',
  //   hour: 'numeric',
  //   minute: 'numeric',
  //   timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  // }

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

  var dateOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    timeZone,
  }

  var timeOptions = {
    hour: 'numeric',
    minute: 'numeric',
    timeZone,
  }
  // const formatted = date.toLocaleDateString('ru-RU', options)

  const f = new Date(time).toLocaleDateString(window.navigator.language, dateOptions)// .slice(-13, -5)// 'uk-UA'
  const f2 = new Date(time).toLocaleTimeString(window.navigator.language, timeOptions)// .slice(-13, -5)// 'uk-UA'

  console.log('---------------- time', f + ' ' + f2)

  return (
    <div className={'item-list-log'}>
      <div className={'time-user'}>
        <div className={'time'}>
          {f + ' ' + f2}
        </div>
        <div className={'user'}>
          <div>
            {user}
          </div>
        </div>
      </div>
      <div className={'event'}>
        {event}
      </div>
    </div>
  )
}

export default ItemList
