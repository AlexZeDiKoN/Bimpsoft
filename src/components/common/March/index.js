import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Icon, Input } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import './style.css'

const { IconHovered } = components.icons
const { IndicatorDataMapping } = components.form
const { form } = components

class March extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    indicators: PropTypes.object.isRequired,
  }

  render () {
    const {
      form: { getFieldDecorator },
      indicators,
    } = this.props
    console.log(indicators)
    const { FormRow } = components.form
    return (
      <div className='march_container'>
        <div className='march_title'>
          {i18n.MARCH_TITLE}
        </div>
        <Form>
          <div className='march_name'>
            <div className='march_name-indicator'>
              <Icon type="branches" />
            </div>
            <div className='march_name-form'>
              <FormRow className='march_name-title'>
                <Input placeholder='placeholder' />
              </FormRow>
              <IndicatorDataMapping
                indicator={ indicators['МШВ001'] }
                onHandler={(e) => console.log(e)}
              />
            </div>
            <div className='march_name-load'> </div>
          </div>
        </Form>
      </div>
    )
  }
}

const WrappedMarch = Form.create()(March)

export default WrappedMarch
