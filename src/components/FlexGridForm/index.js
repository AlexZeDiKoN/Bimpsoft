import React from 'react'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import { Switch, Button } from 'antd'
import i18n from '../../i18n'

const { form: { default: Form, FormRow } } = components

export default class extends React.PureComponent {
  static displayName = 'FlexGridFormComponent'

  static propTypes = {
    wrapper: PropTypes.any,
    directions: PropTypes.number,
    zones: PropTypes.bool,
    visible: PropTypes.bool,
    dropFlexGrid: PropTypes.func,
    setFlexGridOptions: PropTypes.func,
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
      dropFlexGrid,
    } = this.props

    if (!visible) {
      return null
    }

    return (
      <Wrapper title={i18n.FLEX_GRID}>
        <Form className="settings-form-group">
          <FormRow label={i18n.DIRECTIONS_AMOUNT}>
            <input defaultValue={directions} onChange={this.onDirectionsChange} />
          </FormRow>
          <FormRow label={i18n.DIRECTION_ZONES}>
            <Switch defaultValue={zones !== 1} onChange={this.onZonesChange}/>
          </FormRow>
          <Button onClick={dropFlexGrid}>
            {i18n.CREATE}
          </Button>
        </Form>
      </Wrapper>
    )
  }
}
