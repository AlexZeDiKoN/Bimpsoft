import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Icon, Input, Button, Select } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import { MarchKeys } from '../../../constants'
import './style.css'
import SegmentContainer from './children/Segment'

const { names: iconNames, IconButton } = components.icons

class March extends Component {
    static propTypes = {
      form: PropTypes.object.isRequired,
      indicators: PropTypes.object,
      params: PropTypes.object,
      setMarchParams: PropTypes.func,
    }

    indicatorItemObj = (target, indicator) => {
      const activeItem = indicator.typeValues.filter((item) => item.id === +target)
      return {
        indicatorId: indicator.id,
        id: activeItem[ 0 ].id,
        name: activeItem[ 0 ].name,
      }
    }

    handleMarchType = (target, key) => {
      const { setMarchParams, indicators } = this.props
      const template = MarchKeys.MARCH_TYPES_TEMPLATES[ target ]
      const targetObj = this.indicatorItemObj(target, indicators['МШВ001'])
      setMarchParams({
        [key]: targetObj,
        template,
      })
    }

    createSelectChildren = (incomeData) => incomeData
      .map((item) => <Select.Option key={item.id}>{item.name}</Select.Option>)

    render () {
      const {
        form,
        form: { getFieldDecorator },
        indicators,
        setMarchParams,
        params: { segments },
      } = this.props
      const { FormRow } = components.form
      const { MARCH_KEYS } = MarchKeys
      return (
        <div className="march_container">
          <div className="march_title">{i18n.MARCH_TITLE}</div>
          <div className="march_link-bl">
            <a href="#/" title="Варіант маршруту">
              {i18n.MARCH_LINK} -{' '}
            </a>
          </div>
          {indicators && (
            <Form
              className="march_form"
            >
              <div className="march_name">
                <div className="march_name-indicator">
                  <Icon type="branches" />
                </div>
                <div className="march_name-form">
                  <FormRow>
                    {getFieldDecorator(MARCH_KEYS.MARCH_NAME)(
                      <Input
                        className="march_name-title"
                        placeholder={i18n.MARCH_NAME}
                        onChange={({ target }) =>
                          setMarchParams({
                            [MARCH_KEYS.MARCH_NAME]: target.value,
                          })
                        }
                      />
                    )}
                  </FormRow>
                  <FormRow>
                    {getFieldDecorator(MARCH_KEYS.MARCH_TYPE)(
                      <Select
                        placeholder={i18n.MARCH_TYPE}
                        onChange={(e) =>
                          this.handleMarchType(e, MARCH_KEYS.MARCH_TYPE)
                        }
                      >
                        {this.createSelectChildren(
                          indicators['МШВ001'].typeValues
                        )}
                      </Select>
                    )}
                  </FormRow>
                </div>
                <div className="march_name-load">
                  <IconButton
                    title={i18n.OPEN_MARCH_FILE}
                    icon={iconNames.PACK_DEFAULT}
                    hoverIcon={iconNames.PACK_HOVER}
                    onClick={() => console.info('open file')}
                  />
                </div>
              </div>
              <div className="march_track">
                {segments.map((item, i) => (
                  <SegmentContainer key={item.id} index={i} form={form} />
                ))}
              </div>
              <div className="march_total_distance">{i18n.MARCH_DISTANCE}: {0} км</div>
              <div className="march_buttonBlock">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="march_button-submit"
                >
                  {i18n.CREATE_BTN_TITLE}
                </Button>
                <Button
                  htmlType="reset"
                  className="march_button-cancel"
                  onClick={() => console.info('cancel')}
                >
                  {i18n.CANCEL_BTN_TITLE}
                </Button>
              </div>
            </Form>
          )}
        </div>
      )
    }
}

const WrappedMarch = Form.create()(March)

export default WrappedMarch
