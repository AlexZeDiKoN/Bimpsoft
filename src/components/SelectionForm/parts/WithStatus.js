import React from 'react'
import { Select } from 'antd'
import { components } from '@C4/CommonComponents'
import i18n from '../../../i18n'

const { FormRow } = components.form

export const PATH = [ 'attributes', 'status' ]

export const STATUSES = {
  EXISTING: '0',
  PLANNED: '1',
}

export const STATUS_LIST = [
  { id: STATUSES.EXISTING, text: i18n.EXISTING },
  { id: STATUSES.PLANNED, text: `${i18n.PLANNED}/${i18n.EXPECTED}/${i18n.PROBABLE}` },
]

const WithStatus = (Component) => class StatusComponent extends Component {
  statusHandler = (id) => this.setResult((result) => result.setIn(PATH, id))

  renderStatus () {
    const currentAffiliation = this.getResult().getIn(PATH)
    const canEdit = this.isCanEdit()
    return (
      <FormRow label={i18n.STATUS}>
        <Select
          value={currentAffiliation}
          className={!canEdit ? 'modals-input-disabled' : ''}
          onChange={this.statusHandler}
          disabled={!canEdit}>
          {STATUS_LIST.map(({ id, text }) => (
            <Select.Option key={id} value={id}>{text}</Select.Option>
          ))}
        </Select>
      </FormRow>
    )
  }
}

export default WithStatus
