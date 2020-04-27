import { Switch, Tooltip } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'
import convertUnits from '../../utilsMarch/convertUnits'
import i18n from './../../../../../i18n'

const Header = (props) => {
  const { changeTimeDistanceView, timeDistanceView, totalMarchTime, totalMarchDistance } = props

  return <>
    <div className={'march-title-top'}>
      <div className={'march-title'}>
        {i18n.MARCH_TITLE}
      </div>
      <div className={'march-save-button'}/>
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
      <span className={'march-title-value'}>{i18n.LENGTH_OF_MARCH}: {totalMarchDistance.toFixed(1)} км</span>
      <span className={'march-title-value'}>{i18n.TIME}: {convertUnits.msToTime(totalMarchTime)}</span>
    </div>
  </>
}

Header.propTypes = {
  changeTimeDistanceView: PropTypes.func.isRequired,
  timeDistanceView: PropTypes.bool.isRequired,
  totalMarchTime: PropTypes.number.isRequired,
  totalMarchDistance: PropTypes.number.isRequired,
}

export default React.memo(Header)
