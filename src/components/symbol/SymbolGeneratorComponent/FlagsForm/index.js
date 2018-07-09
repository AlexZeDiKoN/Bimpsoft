import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import i18n from '../../i18n'
import * as app6 from '../../model/APP6Code'
import SymbolFlag from '../SymbolFlag'

export default class FlagsForm extends React.Component {
  constructor (props) {
    super(props)

    this.setHQ = this.setCodePartHOF(app6.setHQ)
    this.setTaskForce = this.setCodePartHOF(app6.setTaskForce)
    this.setDummy = this.setCodePartHOF(app6.setDummy)

    this.setPreviewHQ = this.setPreviewCodePartHOF(app6.setHQ)
    this.setPreviewTaskForce = this.setPreviewCodePartHOF(app6.setTaskForce)
    this.setPreviewDummy = this.setPreviewCodePartHOF(app6.setDummy)
  }

  setCodePartHOF = (app6Reducer) => (key) => {
    this.props.onChange(app6Reducer(this.props.code, key))
  }

  setPreviewCodePartHOF = (app6Reducer) => (key) => {
    this.props.onPreviewStart(app6Reducer(this.props.code, key))
  }

  render () {
    const { code, onPreviewEnd } = this.props

    return (
      <div className="flags-form">
        <SymbolFlag
          label={i18n.FEINT_DUMMY}
          onChange={this.setDummy}
          onPreviewStart={this.setPreviewDummy}
          checked={app6.isDummy(code)}
          onPreviewEnd={onPreviewEnd}
        />
        <SymbolFlag
          label={i18n.TASK_FORCE}
          onChange={this.setTaskForce}
          onPreviewStart={this.setPreviewTaskForce}
          checked={app6.isTaskForce(code)}
          onPreviewEnd={onPreviewEnd}
        />
        <SymbolFlag
          label={i18n.HEADQUARTERS}
          onChange={this.setHQ}
          onPreviewStart={this.setPreviewHQ}
          checked={app6.isHQ(code)}
          onPreviewEnd={onPreviewEnd}
        />
      </div>
    )
  }
}

FlagsForm.propTypes = {
  code: PropTypes.string,
  onChange: PropTypes.func,
  onPreviewStart: PropTypes.func,
  onPreviewEnd: PropTypes.func,
}
