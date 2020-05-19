import React from 'react'
import PropTypes from 'prop-types'
import { MovablePanel } from '@DZVIN/CommonComponents'
import { Input, Button, DatePicker } from 'antd'
import moment from 'moment'
import i18n from '../../i18n'

import './style.css'

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
      nameMap: '',
    }
  }

  componentDidUpdate = (prevProps) => {
    const nameMap = this.props.reportMap?.dataMap?.name
    if (nameMap !== prevProps.reportMap?.dataMap?.name) {
      this.setState({ nameMap: `Звітна карта ${nameMap}` })
    }
  }

  onChangeDateTimeMap = (dateInMoment, d) => {
    this.setState({ dateTimeMap: dateInMoment })
  }

  onChangeNameMap = (e) => {
    this.setState({ nameMap: e.target.value })
  }

  render () {
    if (!this.props.reportMap.visible) {
      return null
    }

    const { dateTimeMap, nameMap } = this.state
    const { wrapper: Wrapper, onClose } = this.props

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
                showTime={{ defaultValue: moment('00:00', 'HH:mm') }}
                style={{ minWidth: '300px' }}
              />
            </div>
            <div className='buttons'>
              <Button onClick={onClose} style={{ minWidth: '100px' }}>{i18n.YES}</Button>
              <Button onClick={onClose} style={{ minWidth: '100px' }}>{i18n.NO}</Button>
            </div>
          </div>
        </Wrapper>
      </div>
    )
  }
}
