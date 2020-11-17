import React from 'react'
import { Select } from 'antd'
import { components } from '@C4/CommonComponents'
import { IDENTITY_LIST } from '../../../utils/affiliations'
import i18n from '../../../i18n'
const { FormRow } = components.form

export const PATH = [ 'affiliation' ]

const WithAffiliation = (Component) => class AffiliationComponent extends Component {
  affiliationHandler = (id) => this.setResult((result) => result.setIn(PATH, id))

  renderAffiliation () {
    const currentAffiliation = this.getResult().getIn(PATH)
    const canEdit = this.isCanEdit()
    return (
      <FormRow label={i18n.IDENTITY}>
        <Select
          value={currentAffiliation}
          className={!canEdit ? 'modals-input-disabled' : ''}
          onChange={this.affiliationHandler}
          disabled={!canEdit}>
          {IDENTITY_LIST.map(({ id, title }) => (
            <Select.Option key={id} value={id}>{title}</Select.Option>
          ))}
        </Select>
      </FormRow>
    )
  }
}

export default WithAffiliation
