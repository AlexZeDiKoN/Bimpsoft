import React from 'react'
import PropTypes from 'prop-types'
import { MovablePanel, components } from '@DZVIN/CommonComponents'

import { Input, DatePicker } from 'antd'
import moment from 'moment'
import webmapApi from '../../server/api.webmap'

import i18n from '../../i18n'

import './style.css'

const { form: { ButtonYes, ButtonNo } } = components

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

  onSaveReport = async () => {
    const mapName = this.state.nameMap
    const fromMapId = this.props.reportMap.dataMap.mapId
    const dateOn = this.state.dateTimeMap

    const res = await webmapApi.createCOPReport(mapName, fromMapId, dateOn)
    console.log('-----------------666', res, fromMapId)

    //this.props.onClose()
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
              <ButtonYes onClick={this.onSaveReport} style={{ minWidth: '100px' }} />
              <ButtonNo onClick={onClose} style={{ minWidth: '100px' }} />
            </div>
          </div>
        </Wrapper>
      </div>
    )
  }
}
