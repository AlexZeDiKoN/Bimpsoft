import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import { Icon } from 'antd'
import HighlightedText from '../../common/HighlightedText'

export default class Item extends React.Component {
  render () {
    const { data, highlightText } = this.props
    const { Name: name } = data
    const icon = this.props.canExpand &&
      (<Icon type={this.props.expanded ? 'minus' : 'plus'} onClick={this.props.onExpand} />)

    return (
      <div className="org-structure-item">
        {icon}
        <HighlightedText text={name} highlight={highlightText}/>
      </div>
    )
  }
}

Item.propTypes = {
  onExpand: PropTypes.func,
  canExpand: PropTypes.bool.isRequired,
  expanded: PropTypes.bool.isRequired,
  highlightText: PropTypes.string,
  data: PropTypes.object.isRequired,
}
