import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Scrollbar } from '@DZVIN/CommonComponents'
import { InputButton } from '../common'

import './style.css'
import i18n from '../../i18n'
import LogMapItem from './children/Item'

const LogMapTab = (props) => {
  const { highlightObject, clickObject, doubleClickObject, changeLog } = props
  const [ search, onChangeSearch ] = useState('')
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
        {changeLog && changeLog.map((change) => {
          const { objectId, changeType, changeDate, userName } = change
          return <LogMapItem
            key={`${changeDate}-${objectId}`}
            id={objectId}
            time={changeDate}
            user={userName}
            event={changeType}
            highlightObject={highlightObject}
            clickObject={clickObject}
            doubleClickObject={doubleClickObject}
            search={search}
          />
        })}
      </Scrollbar>
    </div>
  )
}

LogMapTab.propTypes = {
  changeLog: PropTypes.object,
  highlightObject: PropTypes.func.isRequired,
  clickObject: PropTypes.func.isRequired,
  doubleClickObject: PropTypes.func.isRequired,
}

LogMapTab.displayName = 'LogMapTab'

export default LogMapTab
