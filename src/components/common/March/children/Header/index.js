import { Switch, Tooltip } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'
import convertUnits from '../../utilsMarch/convertUnits'
import utilsMarch from '../../utilsMarch'
import i18n from './../../../../../i18n'

const { getDefaultMetric, getDefaultLoadUploadData, defaultChild, defaultSegment, uuid } = utilsMarch.reducersHelpers

const initDataSegments = [
  {
    id: uuid(),
    name: 'Пункт відправлення',
    refPoint: 'База',
    segmentType: 41, // Своїм ходом
    terrain: 69, // Рівнинна
    velocity: 30,
    coordinate: {},
    required: true,
    editableName: false,
    metric: getDefaultMetric(),
    children: [
      {
        id: uuid(),
        type: 5, // Вихідний рубіж
        lineType: '',
        coordinate: {},
        refPoint: '',
        required: true,
        editableName: true,
        restTime: 0,
        metric: {
          time: 0,
          distance: 0,
        },
      },
    ],
    loading: getDefaultLoadUploadData(),
    uploading: getDefaultLoadUploadData(),
  },
  {
    id: uuid(),
    segmentType: 0,
    coordinate: {},
    name: 'Пункт призначення',
    required: true,
    editableName: false,
    metric: getDefaultMetric(true),
  },
]

const Header = (props) => {
  const { changeTimeDistanceView, timeDistanceView, time, distance, initMarch } = props

  return <>
    <div className={'march-title-top'}>
      <div className={'march-title'}>
        {i18n.MARCH_TITLE}
      </div>
      <div onClick={() => initMarch({ segments: initDataSegments })} className={'march-save-button'}/>
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
}

export default React.memo(Header)
