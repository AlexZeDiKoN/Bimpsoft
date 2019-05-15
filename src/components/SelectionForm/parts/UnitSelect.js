import React from 'react'
import PropTypes from 'prop-types'
import { OrgStructureSelect } from '@DZVIN/MilSymbolEditor'

const UnitSelect = (Component) => class UnitSelectComponent extends Component {
  static propTypes = {
    orgStructures: PropTypes,
    elementsConfigs: PropTypes.object,
    canEdit: PropTypes.bool,
  }

  renderOrgStructureSelect () {
    console.log(this.props)
    const { orgStructures, canEdit } = this.props
    return (
      <OrgStructureSelect
        values={orgStructures}
        onChange={(id) => console.log(id)}
        id={1600000000001542}
        readOnly={canEdit}
      />
    )
  }
}

export default UnitSelect
