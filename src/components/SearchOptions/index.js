import React from 'react'
import PropTypes from 'prop-types'
import { components, data, HighlightedText } from '@C4/CommonComponents'
import { getClickOutsideRef } from '../../utils/clickOutside'

const { ContextMenu } = components.common

export default class SearchOptionsComponent extends React.PureComponent {
  static propTypes = {
    options: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string,
        sample: PropTypes.string,
      }),
    ),
    onSelect: PropTypes.func,
    onClose: PropTypes.func,
  }

  clickOutsideRef = getClickOutsideRef(() => {
    const { onClose } = this.props

    onClose && onClose()
  })

  clickHandler = (value) => {
    this.props.onSelect(value)
  }

  render () {
    const { options } = this.props
    if (!options) {
      return null
    }
    return (
      <ContextMenu ref={this.clickOutsideRef}>
        {options.map((option, index) => {
          const { text, sample } = option
          return (
            <ContextMenu.Item
              key={index}
              text={<HighlightedText text={text} textFilter={data.TextFilter.create(sample)}/>}
              value={index}
              onClick={this.clickHandler}
            />
          )
        })}
      </ContextMenu>
    )
  }
}
