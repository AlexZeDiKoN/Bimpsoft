import React from 'react'
import PropTypes from 'prop-types'
import FocusTrap from 'react-focus-lock'
import { MovablePanel, FormBlock, Input, FormRow, NotClickableArea, ButtonSave, ButtonCancel, HotKey, HotKeysContainer } from '@DZVIN/CommonComponents'
import { shortcuts } from '../../constants'
import i18n from '../../i18n'

const DEFAULT_STATE = 1.7
const DEFAULT_ANGLE = 45
const HEIGHT_SETTING_MODAL = 200
const WIDTH_SETTING_MODAL = 300

const inputWrap = {
  width: 80,
}

const heightTarget = 'heightTarget'
const heightObserver = 'heightObserver'
const angle = 'angle'

const defaultState = {
  [heightTarget]: DEFAULT_STATE,
  [heightObserver]: DEFAULT_STATE,
  [angle]: DEFAULT_ANGLE,
}

export default class ZoneVisionModal extends React.Component {
  static propTypes = {
    wrapper: PropTypes.oneOf([ MovablePanel ]),
    onClose: PropTypes.func,
    onClear: PropTypes.func,
    onSave: PropTypes.func,
    selectTopographicItem: PropTypes.func,
    serviceStatus: PropTypes.bool,
    visible: PropTypes.bool,
  }

  state = defaultState

  onClose = () => {
    this.props.onClear()
    this.props.onClose()
    this.setState(defaultState)
  }

  onChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value })
  }

  handleSave = () => {
    const isOk = this.props.onSave(this.state)
    isOk && this.onClose()
  }

  getProps = (name) => ({
    name,
    value: this.state[name] ?? '',
    onChange: this.onChange,
    min: 0,
  })

  render () {
    if (!this.props.visible) {
      return null
    }

    const {
      wrapper: Wrapper,
    } = this.props
    return (
      <>
        <NotClickableArea />
        <Wrapper
          title={i18n.TOPOGRAPHIC_OBJECT_CARD}
          minWidth={WIDTH_SETTING_MODAL}
          minHeight={HEIGHT_SETTING_MODAL}
          onClose={this.onClose}
        >
          <FocusTrap>
            <HotKeysContainer>
              <FormBlock vertical marginH paddingV>
                <FormBlock vertical paddingV>
                  <FormRow label={i18n.HEIGHT_OBSERVER} paddingV>
                    <div style={inputWrap}>
                      <Input.Number step={0.1} {...this.getProps(heightObserver)} />
                    </div>
                  </FormRow>
                  <FormRow label={i18n.HEIGHT_TARGET} paddingV>
                    <div style={inputWrap}>
                      <Input.Number step={0.1} {...this.getProps(heightTarget)} />
                    </div>
                  </FormRow>
                  <FormRow label={i18n.ANGLE} paddingV>
                    <div style={inputWrap}>
                      <Input.Number min={0} {...this.getProps(angle)} />
                    </div>
                  </FormRow>
                </FormBlock>
                <FormBlock>
                  <ButtonSave onClick={this.handleSave} />
                  <ButtonCancel onClick={this.onClose} />
                  <HotKey onKey={this.onClose} selector={shortcuts.ESC} />
                  <HotKey onKey={this.handleSave} selector={shortcuts.ENTER} />
                </FormBlock>
              </FormBlock>
            </HotKeysContainer>
          </FocusTrap>
        </Wrapper>
      </>
    )
  }
}
