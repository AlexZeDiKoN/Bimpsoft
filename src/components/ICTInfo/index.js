import React from 'react'
import PropTypes from 'prop-types'
import Draggable from 'react-draggable'
import i18n from '../../i18n'

import './ICTInfo.css'

export default class extends React.PureComponent {
  static displayName = 'ICTInfo'

  static propTypes = {
    inICTMode: PropTypes.string,
    clearVariant: PropTypes.func,
  }

  closeCalc = () => {
    const { clearVariant } = this.props
    clearVariant && clearVariant()
  }

  render () {
    const { inICTMode } = this.props

    return inICTMode
      ? (
        <Draggable bounds="parent">
          <div className="non-blocking-popup">
            <p>
              {i18n.CREATE_FLEX_GRID_HINT}
              <br />
              <span onClick={this.closeCalc} className="__mini-button">
                Скасувати
              </span>
            </p>
          </div>
        </Draggable>
      )
      : null
  }
}
