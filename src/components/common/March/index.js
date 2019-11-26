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
    integrity: PropTypes.bool,
    setMarchParams: PropTypes.func,
    setIntegrity: PropTypes.func,
  }

  indicatorItemObj = (target, indicator) => {
    const activeItem = indicator.typeValues.filter((item) => item.id === Number(target))
    return {
      indicatorId: indicator.id,
      id: activeItem[ 0 ].id,
      name: activeItem[ 0 ].name,
    }
  }

  handleMarchType = (target, key) => {
    const { setMarchParams, indicators } = this.props
    const { MARCH_TEMPLATES, MARCH_INDICATORS_GROUP } = MarchKeys
    const template = MARCH_TEMPLATES[ target ].required
    const targetObj = this.indicatorItemObj(target,
      indicators[ MARCH_INDICATORS_GROUP.movementType ])
    setMarchParams({
      [ key ]: targetObj,
      template,
    })
  }

  createSelectChildren = (incomeData) => incomeData
    .map((item) => <Select.Option key={item.id}>{item.name}</Select.Option>)

  checkIntegrityOfMarch = () => {
    const { form, setIntegrity } = this.props
    form.validateFields((err) => setIntegrity(!err))
  }

  handleSubmitForm = (event) => {
    event.preventDefault()
    const { form, params } = this.props
    form.validateFields((err) => {
      if (!err) {
        const segments = this.setSegmentCoords()
        // TODO: send request to server, delete localStorage
        localStorage.setItem('march:storage', JSON.stringify({ ...params, segments }))
      }
    })
  }

  setSegmentCoords = () => {
    const { params: { segments } } = this.props
    const { FIELDS_TYPE } = MarchKeys
    return segments.reduce((acc, curr, i, seg) => {
      if (curr.type !== FIELDS_TYPE.POINT) {
        const { coordinate: coordStart } = seg[i - 1]
        const { coordinate: coordEnd } = seg[i + 1]
        return [ ...acc, { ...curr, coordStart, coordEnd } ]
      }
      return [ ...acc, curr ]
    }, [])
  }

  render () {
    const {
      form,
      form: { getFieldDecorator },
      indicators,
      setMarchParams,
      params: { segments },
      integrity,
    } = this.props
    const { FormRow } = components.form
    const { MARCH_KEYS, MARCH_INDICATORS_GROUP } = MarchKeys
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
            onBlur={this.checkIntegrityOfMarch}
            onSubmit={this.handleSubmitForm}
          >
            <div className="march_name">
              <div className="march_name-indicator">
                <Icon type="branches"
                  className={`march_icon-${integrity ? 'success' : 'error'}`}/>
              </div>
              <div className="march_name-form">
                <FormRow>
                  {getFieldDecorator(MARCH_KEYS.MARCH_NAME,
                    { rules: [ { required: true } ] })(
                    <Input
                      className="march_name-title"
                      placeholder={i18n.MARCH_NAME}
                      onChange={({ target }) =>
                        setMarchParams({
                          [ MARCH_KEYS.MARCH_NAME ]: target.value,
                        })
                      }
                    />,
                  )}
                </FormRow>
                <FormRow>
                  {getFieldDecorator(MARCH_KEYS.MARCH_TYPE,
                    { rules: [ { required: true } ] })(
                    <Select
                      placeholder={i18n.MARCH_TYPE}
                      onChange={(e) =>
                        this.handleMarchType(e, MARCH_KEYS.MARCH_TYPE)
                      }
                    >
                      {this.createSelectChildren(
                        indicators[ MARCH_INDICATORS_GROUP.movementType ].typeValues,
                      )}
                    </Select>,
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
                <SegmentContainer key={item.id} index={i} form={form}/>
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
