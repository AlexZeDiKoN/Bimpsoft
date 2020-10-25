import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Scrollbar } from '@DZVIN/CommonComponents'
import { Button } from 'antd'

import { InputButton } from '../common'
import ElevationProfileModal from '../ElevationProfileModal'

import './style.css'
import i18n from '../../i18n'
import LogMapItem from './children/Item'
import {connect} from "react-redux";
import {catchErrors} from "../../store/actions/asyncAction";
import {setShowModalState} from "../../store/actions/elevationProfile";

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

const mapDispatchToProps = {
  openElevationModal: () => (dispatch) => {
    dispatch(setShowModalState(true))
  },
}

export default connect(
  null,
  catchErrors(mapDispatchToProps),
)(LogMapTab)
// export default LogMapTab
