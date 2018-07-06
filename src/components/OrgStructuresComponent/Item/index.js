import React from 'react'
import './style.css'
import { Icon } from 'antd'
import PropTypes from 'prop-types'
import { TreeComponent, HighlightedText } from '../../common'
import TextFilter from '../../common/TextFilter'

export default class Item extends React.Component {
  render () {
    const { tree, textFilter, data } = this.props
    const { Name: name } = data
    const icon = tree.canExpand &&
      (<Icon type={tree.expanded ? 'minus' : 'plus'} onClick={tree.onExpand} />)

    return (
      <div className="org-structure-item">
        {icon}
        <HighlightedText text={name} textFilter={textFilter}/>
      </div>
    )
  }
}

Item.propTypes = {
  ...TreeComponent.itemPropTypes,
  data: PropTypes.shape({
    Name: PropTypes.string,
  }),
  textFilter: PropTypes.instanceOf(TextFilter),
}
