import { Switch, Tooltip } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'
import { IButton, IconNames, ColorTypes } from '@DZVIN/CommonComponents'
import convertUnits from '../../utilsMarch/convertUnits'
import i18n from './../../../../../i18n'

const Header = (props) => {
  const { changeTimeDistanceView,
    timeDistanceView,
    time,
    distance,
    sendMarchToExplorer,
    closeMarch,
    isCoordFilled } = props

  const onSendMarchToExplorer = () => isCoordFilled && sendMarchToExplorer()

  return <>
    <div className={'march-title-top'}>
      <div className={'march-title'}>
        {i18n.MARCH_TITLE}
      </div>
      <Tooltip
        placement='top'
        title={isCoordFilled ? i18n.CREATE_BTN_TITLE : i18n.NOT_ALL_COORDINATES_ENTERED}
      >
        <IButton
          onClick={onSendMarchToExplorer}
          colorType={ColorTypes.WHITE}
          icon={IconNames.BAR_2_SAVE}
        />
      </Tooltip>
      <IButton
        onClick={closeMarch}
        colorType={ColorTypes.WHITE}
        icon={IconNames.DARK_CLOSE_ROUND} />
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
      <div className={'march-title-value'}>
        <span className={'title'}>{`${i18n.LENGTH_OF_MARCH}: `}</span>
        <span className={'value'}>{`${distance.toFixed(1)} ${i18n.ABBR_KILOMETERS}`}</span>
      </div>
      <div className={'march-title-value'}>
        <span className={'title'}>{`${i18n.TIME}: `}</span>
        <span className={'value'}>{convertUnits.msToTime(time)}</span>
      </div>
    </div>
  </>
}

Header.propTypes = {
  changeTimeDistanceView: PropTypes.func.isRequired,
  timeDistanceView: PropTypes.bool.isRequired,
  time: PropTypes.number.isRequired,
  distance: PropTypes.number.isRequired,
  sendMarchToExplorer: PropTypes.func.isRequired,
  closeMarch: PropTypes.func.isRequired,
  isCoordFilled: PropTypes.bool.isRequired,
}

export default React.memo(Header)
