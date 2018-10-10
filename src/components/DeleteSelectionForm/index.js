import React from 'react'
import PropTypes from 'prop-types'

export default class DeleteSelectionForm extends React.Component {
  static propTypes = {
    showForm: PropTypes.bool,
    list: PropTypes.array,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  }

  render () {
    if (!this.props.showForm) {
      return null
    }
    const { list } = this.props
    return (
      <div>zzzzzzzzzzzzzz</div>
    )
  }
}
