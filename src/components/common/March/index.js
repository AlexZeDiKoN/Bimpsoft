import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Icon, Input } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import './style.css'
import IconButton from '../../menu/IconButton'
import { OPEN_MARCH_FILE } from '../../../i18n/ua'

const iconNames = components.icons.names
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
        <Form className='march_form'>
          <div className='march_name'>
            <div className='march_name-indicator'>
              <Icon type="branches" />
            </div>
            <div className='march_name-form'>
              <FormRow>
                <Input
                  className='march_name-title'
                  placeholder='placeholder'
                />
              </FormRow>
              <FormRow>
                <IndicatorDataMapping
                  indicator={ indicators['МШВ001'] }
                  onHandler={(e) => console.info(e)}
                />
              </FormRow>
            </div>
            <div className='march_name-load'>
              <IconButton
                title={OPEN_MARCH_FILE}
                icon={iconNames.PACK_DEFAULT}
                hoverIcon={iconNames.PACK_HOVER}
                onClick={() => console.info('open file')}
              />
            </div>
          </div>
          <div className='march_track'>
            <div className='march_points'>
              
            </div>
            <div className='march_segment'>

            </div>
          </div>
        </Form>
      </div>
    )
  }
}

const WrappedMarch = Form.create()(March)

export default WrappedMarch
