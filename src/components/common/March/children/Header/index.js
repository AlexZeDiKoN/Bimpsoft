import { Switch, Tooltip } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'

const Header = (props) => {
  const { changeTimeDistanceView, timeDistanceView, marchDetails } = props
  const { totalMarchTime, totalMarchDistance } = marchDetails

  const hour = totalMarchTime.toFixed(0)
  const minutes = ((totalMarchTime % 1) * 60).toFixed(0)
  const formatTotalTime = totalMarchTime === Infinity ? 'неможливо вирахувати' : `${hour}:${minutes} годин`

  return <>
    <div className={'march-title-top'}>
      <div className={'march-title'}>
        Маршрут переміщення
      </div>
      <div className={'march-save-button'}/>
    </div>
    <div className={'march-title-bottom'}>
      <Tooltip
        placement='left'
        title={timeDistanceView ? 'Час та відстань: від пункту відправлення'
          : 'Час та відстань: від попереднього пункту'}>
        <Switch
          checkedChildren='В'
          unCheckedChildren='П'
          size='small'
          checked={timeDistanceView}
          onChange={changeTimeDistanceView}
        />
      </Tooltip>
      <span className={'march-title-value'}>Довжина маршруту: {totalMarchDistance.toFixed(1)} км</span>
      <span className={'march-title-value'}>час: {formatTotalTime}</span>
    </div>
  </>
}

Header.propTypes = {
  marchDetails: PropTypes.shape({
    totalMarchTime: PropTypes.number.isRequired,
    totalMarchDistance: PropTypes.number.isRequired,
  }).isRequired,
  changeTimeDistanceView: PropTypes.func.isRequired,
  timeDistanceView: PropTypes.bool.isRequired,
}

export default Header
