import React from 'react'
import memoizeOne from 'memoize-one'
import PropTypes from 'prop-types'
import { MilSymbol } from '@DZVIN/MilSymbolEditor'
import ObjectCatalog from '../ObjectCatalog'
import i18n from '../../i18n'

const _expandedIds = {}

export default class TargetCatalog extends React.PureComponent {
  milSymbolRenderer = ({ code, attributes }) => <MilSymbol code={code} amplifiers={attributes}/>

  handleSelect = (selectedId) => this.props.selectedList([ selectedId ])

  getRoots = memoizeOne((byIds) => Object.keys(byIds))

  render () {
    return (
      <ObjectCatalog
        {...this.props}
        roots={this.getRoots(this.props.byIds)}
        expandedIds={_expandedIds}
        title={i18n.TARGETS}
        selectedId={this.props.selectedList[0]}
        milSymbolRenderer={this.milSymbolRenderer}
        onClick={this.handleSelect}
        onFilterTextChange={this.props.setFilterText}
      />
    )
  }
}

TargetCatalog.propTypes = {
  wrapper: PropTypes.any,
  canEdit: PropTypes.bool,
  byIds: PropTypes.object.isRequired,
  setFilterText: PropTypes.func,
  selectedId: PropTypes.number,
  onClick: PropTypes.func,
  selectedList: PropTypes.func,
}
