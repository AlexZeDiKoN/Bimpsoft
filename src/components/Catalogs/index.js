import React from 'react'
import PropTypes from 'prop-types'
import { MilSymbol } from '@C4/MilSymbolEditor'
import ObjectCatalog from '../ObjectCatalog'
import { signCodes } from '../../constants/catalogs'
import i18n from '../../i18n'

const commonPointApp6Code = '10032500001313000000'

export const catalogSign = (catalogId) => {
  let app6Code = commonPointApp6Code
  let amplifiers = {}
  const signCode = signCodes[catalogId]
  if (signCode) {
    if (typeof signCode === 'object') {
      const { code, ...rest } = signCode
      app6Code = code || app6Code
      amplifiers = { ...amplifiers, ...rest }
    } else {
      app6Code = signCode || app6Code
    }
  }
  return [ app6Code, amplifiers ]
}

export default class Catalogs extends React.PureComponent {
  static displayName = 'Catalogs'

  componentDidMount () {
    const { preloadCatalogList } = this.props
    preloadCatalogList && preloadCatalogList()
  }

  toggleItem = (itemId, visible) => {
    const {
      onShow,
      onHide,
    } = this.props
    if (visible) {
      onHide(itemId)
    } else {
      onShow(itemId)
    }
  }

  milSymbolRenderer = ({ id }) => {
    const [ app6Code, amplifiers ] = catalogSign(id)
    return app6Code !== null && (
      <MilSymbol
        code={app6Code}
        amplifiers={amplifiers}
      />
    )
  }

  render () {
    const {
      byIds,
      shownIds,
    } = this.props

    Object.entries(byIds)
      .forEach(([ key, value ]) => (value.shown = Object.prototype.hasOwnProperty.call(shownIds, key)))
    return (
      <ObjectCatalog
        {...this.props}
        title={i18n.CATALOGS}
        onVisibleChange={this.toggleItem}
        milSymbolRenderer={this.milSymbolRenderer}
      />
    )
  }
}

Catalogs.propTypes = {
  canEdit: PropTypes.bool,
  roots: PropTypes.array.isRequired,
  byIds: PropTypes.object.isRequired,
  shownIds: PropTypes.object.isRequired,
  expandedIds: PropTypes.object,
  onExpand: PropTypes.func,
  onShow: PropTypes.func,
  onHide: PropTypes.func,
  onFilterTextChange: PropTypes.func,
  selectedId: PropTypes.any,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  preloadCatalogList: PropTypes.func,
}
