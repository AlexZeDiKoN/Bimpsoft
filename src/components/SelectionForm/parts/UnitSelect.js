import React from 'react'
import PropTypes from 'prop-types'
import { OrgStructureSelect } from '@DZVIN/MilSymbolEditor'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'

const { FormRow } = components.form

const UNIT_PATH = [ 'unit' ]

const UnitSelect = (Component) => class UnitSelectComponent extends Component {
  static propTypes = {
    orgStructures: PropTypes,
    elementsConfigs: PropTypes.object,
    canEdit: PropTypes.bool,
    data: PropTypes.object,
  }

  unitChangeHandler = (unit) => this.setResult((result) => result.setIn(UNIT_PATH, unit))

  renderOrgStructureSelect () {
    const { orgStructures, canEdit, data: { unit } } = this.props
    return (
      <FormRow label={i18n.UNIT}>
        <OrgStructureSelect
          values={orgStructures}
          onChange={this.unitChangeHandler}
          id={unit}
          readOnly={!canEdit}
        />
      </FormRow>
    )
  }
}

export default UnitSelect
