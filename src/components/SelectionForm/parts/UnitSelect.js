import React from 'react'
import { OrgStructureSelect } from '@DZVIN/MilSymbolEditor'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'

const { form: { FormRow }, icons: { names: iconNames, IconButton } } = components

const UNIT_PATH = [ 'unit' ]

const UnitSelect = (Component) => class UnitSelectComponent extends Component {
  unitChangeHandler = (unit) => this.setResult((result) => result.setIn(UNIT_PATH, unit))

  renderOrgStructureSelect () {
    const canEdit = this.isCanEdit()
    const { unit } = this.getResult()
    const orgStructures = this.getOrgStructures()
    return (
      <FormRow label={i18n.UNIT}>
        <OrgStructureSelect
          values={orgStructures}
          onChange={this.unitChangeHandler}
          id={unit}
          readOnly={!canEdit}
        />
        {canEdit && (
          <IconButton
            className='orgStructureBottom'
            icon={iconNames.DROP_DOWN_DEFAULT}
          />
        )}
      </FormRow>
    )
  }
}

export default UnitSelect
