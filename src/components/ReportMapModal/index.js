import React from 'react'
import PropTypes from 'prop-types'
import { MovablePanel, components } from '@C4/CommonComponents'
import { Input, DatePicker } from 'antd'
import moment from 'moment'
import { SIDEBAR_SIZE_DEFAULT } from '../../layouts/Sidebar'
import { DATE_TIME_FORMAT } from '../../constants/formats'

import i18n from '../../i18n'

import './style.css'
import { MAX_LENGTH_TEXT } from '../../constants/InputText'

const POPUP_WINDOW_WIDTH = 300

const { form: { ButtonYes, ButtonNo } } = components

export default class ReportMapModal extends React.Component {
  static propTypes = {
    wrapper: PropTypes.oneOf([ MovablePanel ]),
    reportMap: PropTypes.object,
    onClose: PropTypes.func,
    selectTopographicItem: PropTypes.func,
    serviceStatus: PropTypes.bool,
    saveCopReport: PropTypes.func.isRequired,
  }

  constructor (props) {
    super(props)
    this.state = {
      dateTimeMap: moment(Date.now()),
      nameMap: '',
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    const nameMap = this.props.reportMap?.dataMap?.name
    const timeInLocal = moment.utc(prevState.dateTimeMap).local().format(DATE_TIME_FORMAT)
    if (nameMap !== prevProps.reportMap?.dataMap?.name) {
      this.setState({ nameMap: `${i18n.REPORTING_CARD} ${nameMap} ${timeInLocal}` })
    }
  }

  onChangeDateTimeMap = (dateInMoment) => {
    this.setState({ dateTimeMap: dateInMoment })
  }

  onChangeNameMap = (e) => {
    this.setState({ nameMap: e.target.value })
  }

  onSaveReport = async () => {
    const mapName = this.state.nameMap
    const fromMapId = this.props.reportMap.dataMap.mapId
    const dateOn = this.state.dateTimeMap

    this.props.saveCopReport(mapName, fromMapId, dateOn)

    this.props.onClose()
  }

  isValidateFields = () => {
    const { dateTimeMap, nameMap } = this.state

    const isValidateNameMap = !!nameMap.trim().length
    const isValidatedDateTimeMap = !!dateTimeMap

    return isValidateNameMap && isValidatedDateTimeMap
  }

  render () {
    if (!this.props.reportMap.visible) {
      return null
    }

    const { dateTimeMap, nameMap } = this.state
    const { wrapper: Wrapper, onClose } = this.props

    return (
      <div className='log-map-container not-clickable-area'>
        <Wrapper
          title={i18n.CREATE_REPORT_MAP}
          onClose={onClose}
          defaultPosition={{
            x: window.screen.width - SIDEBAR_SIZE_DEFAULT - POPUP_WINDOW_WIDTH * 1.1,
            y: window.screen.height * 0.11,
          }}
        >
          <div className='content' style={{ width: `${POPUP_WINDOW_WIDTH}px` }}>
            <div className='input-name'>
              <div>{i18n.NAME_OF_DOCUMENT}</div>
              <Input
                value={nameMap}
                onChange={this.onChangeNameMap}
                maxLength={MAX_LENGTH_TEXT.NAME_REPORT_MAP}
              />
            </div>
            <div className='input-as-of'>
              <div>{i18n.AS_OF}</div>
              <DatePicker
                className='cop-date-picker'
                value={dateTimeMap}
                onChange={this.onChangeDateTimeMap}
                format={ DATE_TIME_FORMAT }
                showTime={{ defaultValue: moment('00:00', 'HH:mm') }}
              />
            </div>
            <div className='buttons'>
              <ButtonYes className='button' onClick={this.onSaveReport} disabled={!this.isValidateFields()} />
              <ButtonNo className='button' onClick={onClose} />
            </div>
          </div>
        </Wrapper>
      </div>
    )
  }
}
