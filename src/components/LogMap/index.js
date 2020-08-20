import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Scrollbar } from '@DZVIN/CommonComponents'
import { InputButton } from '../common'

import './style.css'
import i18n from '../../i18n'
import ItemList from './children/ItemList'

const LogMapTab = (props) => {
  const { userEvents, user, highlightObject } = props
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

  return (
    <div className='log-map-wrapper'>
      <div className='log-map-header'>
        <InputButton
          onChange={onChangeSearch}
          value={search}
          title={i18n.LOG_MAP}
        />
      </div>
      <Scrollbar>
        {filteredEvent(search).map(({ event, timestamp, id, object }) => (
          <ItemList
            key={id}
            id={id}
            time={timestamp}
            user={user}
            event={event}
            object={object}
            highlightObject={highlightObject}
          />))
        }
      </Scrollbar>
    </div>
  )
}

LogMapTab.propTypes = {
  userEvents: PropTypes.object.isRequired,
  user: PropTypes.string.isRequired,
  highlightObject: PropTypes.func.isRequired,
}

LogMapTab.displayName = 'LogMapTab'

export default LogMapTab
