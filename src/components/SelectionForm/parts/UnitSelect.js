import React from 'react'
import { OrgStructureSelect } from '@C4/MilSymbolEditor'
import { components } from '@C4/CommonComponents'
import i18n from '../../../i18n'

const { form: { FormRow } } = components

const UNIT_PATH = [ 'unit' ]

const UnitSelect = (Component) => class UnitSelectComponent extends Component {
  unitChangeHandler = (unit) => this.setResult((result) => result.setIn(UNIT_PATH, unit))

  renderOrgStructureSelect () {
    const canEdit = this.isCanEdit()
    const unit = this.getResult().getIn(UNIT_PATH)
    const orgStructures = this.getOrgStructures()
    return (
      <div
        className={canEdit ? 'org-structures-select-disabled' : 'org-structures-select-disabled org-structures-disabled'}>
        <FormRow label={i18n.MILITARY_FORMATION}>
          <OrgStructureSelect
            values={orgStructures}
            onChange={this.unitChangeHandler}
            id={unit}
            readOnly={!canEdit}
          />
        </FormRow>
      </div>
    )
  }
}

export default UnitSelect
