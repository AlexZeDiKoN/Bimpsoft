import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Scrollbar } from '@DZVIN/CommonComponents'
import { connect } from 'react-redux'
import { InputButton } from '../common'

import './style.css'
import i18n from '../../i18n'
import { catchErrors } from '../../store/actions/asyncAction'
import { setShowModalState } from '../../store/actions/elevationProfile'
import LogMapItem from './children/Item'

const LogMapTab = (props) => {
  const { highlightObject, clickObject, doubleClickObject, changeLog, openElevationModal } = props
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
