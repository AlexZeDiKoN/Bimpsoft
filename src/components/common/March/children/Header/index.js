import { Switch, Tooltip } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'
import convertUnits from '../../utilsMarch/convertUnits'
import i18n from './../../../../../i18n'

const Header = (props) => {
  const { changeTimeDistanceView, timeDistanceView, time, distance, initMarch, sendMarchToExplorer } = props

  return <>
    <div className={'march-title-top'}>
      <div className={'march-title'}>
        {i18n.MARCH_TITLE}
      </div>
      <div onClick={sendMarchToExplorer} className={'march-save-button'}/>
    </div>
    <div className={'march-title-bottom'}>
      <Tooltip
        placement='left'
        title={timeDistanceView ? i18n.FROM_DEPARTURE_POINT : i18n.FROM_PREVIOUS_POINT}>
        <Switch
          checkedChildren='В'
          unCheckedChildren='П'
          size='small'
          checked={timeDistanceView}
          onChange={changeTimeDistanceView}
        />
      </Tooltip>
      <span className={'march-title-value'}>{i18n.LENGTH_OF_MARCH}: {distance.toFixed(1)} км</span>
      <span className={'march-title-value'}>{i18n.TIME}: {convertUnits.msToTime(time)}</span>
    </div>
  </>
}

Header.propTypes = {
  changeTimeDistanceView: PropTypes.func.isRequired,
  timeDistanceView: PropTypes.bool.isRequired,
  time: PropTypes.number.isRequired,
  distance: PropTypes.number.isRequired,
  sendMarchToExplorer: PropTypes.func.isRequired,
}

export default React.memo(Header)
