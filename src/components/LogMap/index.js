import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { Scrollbar, IconNames } from '@DZVIN/CommonComponents'
import { InputButton } from '../common'

import './style.css'
import i18n from '../../i18n'
import ItemList from './children/ItemList'

const LogMapTab = (props) => {
  const { wrapper: Wrapper = Fragment, userEvents, user } = props
  const [ search, onChange ] = useState('')

  const onChangeSearch = (value) => {
    onChange(value)
  }

  const filteredEvent = (search) => {
    if (search === '') {
      return userEvents
    } else {
      search = search.toLowerCase()
      return userEvents.filter(({ event }) => event.toLowerCase().includes(search))
    }
  }

  return <Wrapper
    icon={IconNames.SYMBOLS}
    title={i18n.LOG_MAP}
  >
    <div className='log-map-wrapper'>
      <div className='log-map-header'>
        <InputButton
          onChange={onChangeSearch}
          value={search}
          title={i18n.LOG_MAP}
        />
      </div>
      <Scrollbar>
        {filteredEvent(search).map(({ event, timestamp }, id) => (
          <ItemList
            key={id}
            time={timestamp}
            user={user}
            event={event}
          />))
        }
      </Scrollbar>
    </div>
  </Wrapper>
}

LogMapTab.propTypes = {
  wrapper: PropTypes.any,
  userEvents: PropTypes.object.isRequired,
  user: PropTypes.string.isRequired,
}

LogMapTab.displayName = 'LogMapTab'

export default LogMapTab
