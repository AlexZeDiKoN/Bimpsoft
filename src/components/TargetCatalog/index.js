import React from 'react'
import memoizeOne from 'memoize-one'
import PropTypes from 'prop-types'
import { MilSymbol } from '@C4/MilSymbolEditor'
import ObjectCatalog from '../ObjectCatalog'
import i18n from '../../i18n'

const _expandedIds = {}

const _defaultTargetSymbolCode = '10032500001603000000'

export default class TargetCatalog extends React.PureComponent {
  static displayName = 'TargetCatalog'

  milSymbolRenderer = ({ code, attributes }) => (
    <MilSymbol code={code || _defaultTargetSymbolCode} amplifiers={attributes}/>
  )

  handleSelect = (selectedId) => this.props.setSelectedList([ selectedId ])

  getRoots = memoizeOne((byIds) => Object.keys(byIds))

  handleDoubleClick = () => this.props.setScaleToSelection(true)

  render () {
    return (
      <ObjectCatalog
        {...this.props}
        title={i18n.TARGETS}
        roots={this.getRoots(this.props.byIds)}
        expandedIds={_expandedIds}
        selectedId={this.props.selectedList[0]}
        milSymbolRenderer={this.milSymbolRenderer}
        onClick={this.handleSelect}
        onFilterTextChange={this.props.setFilterText}
        onDoubleClick={this.handleDoubleClick}
      />
    )
  }
}

TargetCatalog.propTypes = {
  canEdit: PropTypes.bool,
  byIds: PropTypes.object.isRequired,
  setFilterText: PropTypes.func,
  selectedList: PropTypes.array,
  onClick: PropTypes.func,
  setSelectedList: PropTypes.func,
  setScaleToSelection: PropTypes.func,
}
