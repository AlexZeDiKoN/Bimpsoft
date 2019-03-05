import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Icon, Input } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import './style.css'

const { IconHovered } = components.icons

class March extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    indicators: PropTypes.array,
  }

  clickHandler = (e) => {
    console.log(e)
  }

  render () {
    const {
      form: { getFieldDecorator },
      indicators,
    } = this.props
    const { FormRow } = components.form
    console.log(indicators)
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
              {/*<IndicatorDataMapping*/}
                {/*indicator={ indicators[0] }*/}
                {/*label='test'*/}
                {/*onHandler={this.clickHandler}*/}
                {/*disable={false}*/}
              {/*/>*/}
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
