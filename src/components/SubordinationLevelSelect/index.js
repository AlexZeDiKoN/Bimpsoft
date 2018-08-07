import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import i18n from '../../i18n'
import { SubordinationLevel } from '../../constants'

const Option = Select.Option

export default class SubordinationLevelSelect extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
  }

  render () {
    const { value, onChange } = this.props
    return (
      <Select value={ value } onChange={onChange}>
        <Option value={SubordinationLevel.TEAM_CREW}>{i18n.TEAM_CREW}</Option>
        <Option value={SubordinationLevel.SQUAD}>{i18n.SQUAD}</Option>
        <Option value={SubordinationLevel.SECTION}>{i18n.SECTION}</Option>
        <Option value={SubordinationLevel.PLATOON_DETACHMENT}>{i18n.PLATOON_DETACHMENT}</Option>
        <Option value={SubordinationLevel.COMPANY_BATTERY_TROOP}>{i18n.COMPANY_BATTERY_TROOP}</Option>
        <Option value={SubordinationLevel.BATTALION_SQUADRON}>{i18n.BATTALION_SQUADRON}</Option>
        <Option value={SubordinationLevel.REGIMENT_GROUP}>{i18n.REGIMENT_GROUP}</Option>
        <Option value={SubordinationLevel.BRIGADE}>{i18n.BRIGADE}</Option>
        <Option value={SubordinationLevel.DIVISION}>{i18n.DIVISION}</Option>
        <Option value={SubordinationLevel.CORPS_MEF}>{i18n.CORPS_MEF}</Option>
        <Option value={SubordinationLevel.ARMY}>{i18n.ARMY}</Option>
        <Option value={SubordinationLevel.ARMY_GROUP_FRONT}>{i18n.ARMY_GROUP_FRONT}</Option>
        <Option value={SubordinationLevel.REGION_THEATER}>{i18n.REGION_THEATER}</Option>
        <Option value={SubordinationLevel.COMMAND}>{i18n.COMMAND}</Option>
      </Select>
    )
  }
}
