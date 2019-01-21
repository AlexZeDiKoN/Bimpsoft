import React from 'react'
import PropTypes from 'prop-types'
import { Switch } from 'antd'
import i18n from '../../i18n'

export default class extends React.PureComponent {
  static displayName = 'FlexGridFormComponent'

  static propTypes = {
    wrapper: PropTypes.any,
    directions: PropTypes.number,
    zones: PropTypes.bool,
    visible: PropTypes.bool,
    onConfirm: PropTypes.func,
  }

  onZonesChange (e) {
    console.log(`onZonesChange`, e)
  }

  onDirectionsChange (e) {
    console.log(`onDirectionsChange`, e)
  }

  render () {
    const {
      wrapper: Wrapper,
      visible,
      directions,
      zones,
    } = this.props

    if (!visible) {
      return null
    }

    return (
      <Wrapper title={i18n.FLEX_GRID}>
        <input value={directions} onChange={this.onDirectionsChange} />
        <br />
        <Switch checked={zones !== 1} onChange={this.onZonesChange}/>
      </Wrapper>
    )
  }
}
