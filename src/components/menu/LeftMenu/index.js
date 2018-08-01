import React from 'react'
import PropTypes from 'prop-types'
import CommandButton from '../CommandButton'
import './style.css'

export default class LeftMenu extends React.Component {
  static propTypes = {
    commands: PropTypes.object,
    onCommand: PropTypes.func,
    lineSignsList: PropTypes.node,
  }

  render () {
    const { commands, onCommand, lineSignsList } = this.props
    return (
      <div className='left-menu'>
        <CommandButton command={commands.toggleEditMode} onCommand={onCommand} />
        <CommandButton command={commands.togglePointSignsList} onCommand={onCommand} />
        <CommandButton command={commands.toggleLineSignsList} onCommand={onCommand} >
          {lineSignsList}
        </CommandButton>
        <CommandButton command={commands.toggleTextMode} onCommand={onCommand} />
      </div>
    )
  }
}
