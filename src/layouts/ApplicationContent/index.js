import React from 'react'
import PropTypes from 'prop-types'
import { ShortcutManager } from 'react-shortcuts'
import WebMap from '../../containers/WebMap'
import keymap from './keymap'

const shortcutManager = new ShortcutManager(keymap)

class ApplicationContent extends React.PureComponent {
  getChildContext = () => ({ shortcuts: shortcutManager })

  // TODO: запам'ятовувати попередній вигляд карти у localStorage
  render () {
    return (
      <WebMap
        center={[ 48.5, 38 ]}
        zoom={14}
      />
    )
  }
}

ApplicationContent.childContextTypes = {
  shortcuts: PropTypes.object.isRequired,
}

export default ApplicationContent
