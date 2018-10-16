import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import './style.css'
import FocusTrap from 'focus-trap-react'
import { shortcuts } from '../../../../constants'
import { HotKeysContainer, HotKey } from '../../../common/HotKeys'

const { default: Form, FormButtonCancel, FormButtonOk, FormItem } = components.form

export default class DeleteSelectionForm extends React.Component {
  static propTypes = {
    layerName: PropTypes.string,
    list: PropTypes.array,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  }

  render () {
    const { list, layerName } = this.props
    return (
      <Fragment>
        <div className="not-clickable-area"></div>
        <FocusTrap className="confirm-delete-overflow">
          <HotKeysContainer>
            <Form className="confirm-delete">
              <FormItem>
                <div className="confirm-icon-warning">!</div>
                <div>
                  <div className="confirm-title">Видалення знаків</div>
                  <div className="confirm-text">{`Шар: ${layerName}`}</div>
                  <div className="confirm-text">{`Кількість знаків: ${list.length}`}</div>
                </div>
              </FormItem>
              <FormItem>
                <HotKey selector={shortcuts.ENTER} onKey={this.props.onOk} />
                <FormButtonOk onClick={this.props.onOk} />
                <HotKey selector={shortcuts.ESC} onKey={this.props.onCancel} />
                <FormButtonCancel onClick={this.props.onCancel} />
              </FormItem>
            </Form>
          </HotKeysContainer>
        </FocusTrap>
      </Fragment>
    )
  }
}
