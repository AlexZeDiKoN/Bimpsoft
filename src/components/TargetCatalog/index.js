import React from 'react'
import PropTypes from 'prop-types'
import ObjectCatalog from '../ObjectCatalog'
import i18n from '../../i18n'
import { MilSymbol } from '@DZVIN/MilSymbolEditor'

export default class TargetCatalog extends React.PureComponent {
  render () {
    const roots = Object.keys(this.props.byIds)
    return (
      <ObjectCatalog
        {...this.props}
        roots={roots}
        expandedIds={{}}
        title={i18n.TARGETS}
        selectedId={this.props.selectedList[0]}
        milSymbolRenderer={({ code, attributes }) => <MilSymbol code={code} amplifiers={attributes}/>}
        onClick={(selectedId) => this.props.selectedList([ selectedId ])}
      />
    )
  }
}

TargetCatalog.propTypes = {
  wrapper: PropTypes.any,
  canEdit: PropTypes.bool,
  byIds: PropTypes.object.isRequired,
  onFilterTextChange: PropTypes.func,
  selectedId: PropTypes.number,
  onClick: PropTypes.func,
  selectedList: PropTypes.func,
}
