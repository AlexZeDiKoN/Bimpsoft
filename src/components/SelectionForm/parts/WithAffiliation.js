import React from 'react'
import { Select } from 'antd'
import { components } from '@C4/CommonComponents'
import { IDENTITY_LIST } from '../../../utils/affiliations'
import i18n from '../../../i18n'
import { AFFILIATION_COLOR } from '../../../constants/colors'
const { FormRow } = components.form

export const PATH = [ 'affiliation' ]
export const PATH_COLOR = [ 'attributes', 'color' ]

const WithAffiliation = (Component) => class AffiliationComponent extends Component {
  affiliationHandler = (colorNotSet) => (id) => {
    this.setResult((result) => {
      const resultAffiliation = result.setIn(PATH, id)
      // установка цвета линии в соответствии принадлежностью
      return (AFFILIATION_COLOR[id] && !colorNotSet)
        ? resultAffiliation.setIn(PATH_COLOR, AFFILIATION_COLOR[id])
        : resultAffiliation
    })
  }

  renderAffiliation (colorNotSet) {
    const currentAffiliation = this.getResult().getIn(PATH)
    const canEdit = this.isCanEdit()
    return (
      <FormRow label={i18n.IDENTITY}>
        <Select
          value={currentAffiliation}
          className={!canEdit ? 'modals-input-disabled' : ''}
          onChange={this.affiliationHandler(colorNotSet)}
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
