import React from 'react'
import PropTypes from 'prop-types'
import FocusTrap from 'react-focus-lock'
import { MovablePanel } from '@DZVIN/CommonComponents'
import { Select, Input, Button, DatePicker } from 'antd'
import moment from 'moment'
import i18n from '../../i18n'

import { TopoObj } from '../../constants'

import './style.css'

function range (start, end) {
  const result = []
  for (let i = start; i < end; i++) {
    result.push(i)
  }
  return result
}

function disabledDate (current) {
  // Can not select days before today and today
  return current && current < moment().endOf('day')
}

function disabledDateTime () {
  return {
    disabledHours: () => range(0, 24).splice(4, 20),
    disabledMinutes: () => range(30, 60),
    disabledSeconds: () => [ 55, 56 ],
  }
}

function disabledRangeTime (_, type) {
  if (type === 'start') {
    return {
      disabledHours: () => range(0, 60).splice(4, 20),
      disabledMinutes: () => range(30, 60),
      disabledSeconds: () => [ 55, 56 ],
    }
  }
  return {
    disabledHours: () => range(0, 60).splice(20, 4),
    disabledMinutes: () => range(0, 31),
    disabledSeconds: () => [ 55, 56 ],
  }
}

export default class ReportMapModal extends React.Component {
  static propTypes = {
    wrapper: PropTypes.oneOf([ MovablePanel ]),
    reportMap: PropTypes.object,
    onClose: PropTypes.func,
    selectTopographicItem: PropTypes.func,
    serviceStatus: PropTypes.bool,
  }

  constructor (props) {
    super(props)
    this.state = {
      dateTimeMap: moment(Date.now()),
      nameMap: 'test',
    }
  }

  onChangeDateTimeMap = (dateInMoment, d) => {
    this.setState({ dateTimeMap: dateInMoment })
  }

  onChangeNameMap = (e) => {
    this.setState({ nameMap: e.target.value })
  }

  // dateString = moment(Date.now())

  render () {
    if (!this.props.reportMap.visible /* || !this.props.serviceStatus */) {
      return null
    }

    const { dateTimeMap, nameMap } = this.state

    const {
      wrapper: Wrapper,
      onClose,
    //   reportMap: {
    //     features,
    //     location,
    //     selectedItem,
    //   },
    //   selectTopographicItem,
    } = this.props
    // const objectsCount = features ? features.length : undefined
    return (
      <div className='topographicCard'>
        <Wrapper
          title={i18n.CREATE_REPORT_MAP}
          onClose={onClose}
        >

          <div className='content'>
            <div className='input-name'>
              <div>{i18n.NAME_OF_DOCUMENT}</div>
              <Input value={nameMap} onChange={this.onChangeNameMap}/>
            </div>

            <div className='input-as-of'>
              <div>{i18n.AS_OF}</div>
              <DatePicker
                value={dateTimeMap}
                onChange={this.onChangeDateTimeMap}
                format="DD.MM.YYYY HH:mm"
                // disabledDate={disabledDate}
                // disabledTime={disabledDateTime}
                showTime={{ defaultValue: moment('00:00', 'HH:mm') }}
                style={{ minWidth: '300px' }}
              />
            </div>

            <div className='buttons'>
              <Button style={{ minWidth: '100px' }}>{i18n.YES}</Button>
              <Button style={{ minWidth: '100px' }}>{i18n.NO}</Button>
            </div>
          </div>
        </Wrapper>
      </div>
    )
  }
}
