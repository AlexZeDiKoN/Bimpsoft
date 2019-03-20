import React from 'react'
import FocusTrap from 'react-focus-lock'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import { Switch, Button } from 'antd'
import i18n from '../../i18n'
import * as shortcuts from '../../constants/shortcuts'
import { HotKey, HotKeysContainer } from '../common/HotKeys'

const { form: { default: Form, FormRow, FormItem, buttonCancel } } = components

export default class extends React.PureComponent {
  static displayName = 'FlexGridFormComponent'

  static propTypes = {
    wrapper: PropTypes.any,
    directions: PropTypes.number,
    zones: PropTypes.bool,
    visible: PropTypes.bool,
    dropFlexGrid: PropTypes.func,
    setDirections: PropTypes.func,
    setZones: PropTypes.func,
    closeForm: PropTypes.func,
  }

  onDirectionsChange = ({ target: { value } }) => {
    const { setDirections } = this.props
    setDirections(Number(value))
  }

  render () {
    const {
      wrapper: Wrapper,
      visible,
      directions,
      zones,
      dropFlexGrid,
      setZones,
      closeForm,
    } = this.props

    if (!visible) {
      return null
    }

    return (
      <Wrapper title={i18n.FLEX_GRID}>
        <FocusTrap>
          <HotKeysContainer>
            <Form className="settings-form-group">
              <FormRow label={i18n.DIRECTIONS_AMOUNT}>
                <input type="number" defaultValue={directions} onChange={this.onDirectionsChange} />
              </FormRow>
              <FormRow label={i18n.DIRECTION_ZONES}>
                <Switch defaultChecked={zones} onChange={setZones}/>
              </FormRow>
              <FormItem>
                <Button onClick={dropFlexGrid} className="dzvin-button">
                  {i18n.CREATE}
                </Button>
                {buttonCancel(closeForm)}
                <HotKey onKey={closeForm} selector={shortcuts.ESC}/>
              </FormItem>
            </Form>
          </HotKeysContainer>
        </FocusTrap>
      </Wrapper>
    )
  }
}
