import React from 'react'
import PropTypes from 'prop-types'
import FocusTrap from 'react-focus-lock'
import {
  ButtonSave,
  ButtonCancel,
  MovablePanel,
  Input,
  FormColumnFloat,
  Checkbox,
  FormRow,
  ButtonDelete,
  components,
} from '@C4/CommonComponents'
import { compose } from 'recompose'
import i18n from '../../../i18n'
import { WithMilSymbol } from '../../SelectionForm/parts'
import { propTypes as MilSymbolPropTypes } from '../../SelectionForm/parts/WithMilSymbol'
import './style.css'

const { form: { default: Form } } = components

const HEIGHT_MODAL = 'calc(100vh - 80px)'
const WIDTH_MODAL = 825

const propTypes = {
  // redux modal data
  name: PropTypes.string,
  data: PropTypes.object,
  inCurrentLayer: PropTypes.bool,
  isNew: PropTypes.bool,

  // redux selectors
  ...MilSymbolPropTypes,
  layerData: PropTypes.object,
  wrapper: PropTypes.oneOf([ MovablePanel ]),

  // handlers
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  onRemove: PropTypes.func,
}

const Decorator = compose(WithMilSymbol)(React.Component)

export class MilSymbolFilterModal extends Decorator {
  static displayName = 'MilSymbolFilterModal'

  static propTypes = propTypes

  constructor (props) {
    super(props)
    this.state = {
      data: props?.data,
      name: props?.name,
      inCurrentLayer: props?.inCurrentLayer,
      errors: {},
    }
  }

  onSaveHandler = () => {
    const { data, name, inCurrentLayer } = this.state
    const res = this.props.onSave({ data, name, inCurrentLayer })
    res && res.errors && this.setState({ errors: res.errors })
  }

  setResult (resultFunc) {
    const data = resultFunc(this.state.data)
    if (data && this.state.data !== data) {
      this.setState({ data })
    }
  }

  getResult = () => this.state.data

  isCanEdit = () => true

  onChange = ({ target: { name, value } }) => this.setState({ [name]: value })

  render () {
    const { wrapper: Wrapper, onClose, isNew, onRemove, layerData } = this.props
    const { inCurrentLayer, name, errors } = this.state
    return <Wrapper
      title={i18n.STRAINER_MIL_SYMBOL}
      maxWidth={WIDTH_MODAL}
      minWidth={WIDTH_MODAL}
      minHeight={HEIGHT_MODAL}
      maxHeight={HEIGHT_MODAL}
      onClose={onClose}
    >
      <FocusTrap>
        <Form className="shape-form">
          <div className="mil-symbol-filter__content">
            <FormColumnFloat label={i18n.NAME_STRAINER} hasValue={Boolean(name)}>
              <Input name={'name'} errors={errors.name} value={name} onChange={this.onChange}/>
            </FormColumnFloat>
            <FormRow label={`${i18n.LAYER}: ${layerData?.name}`} alignLabel="right">
              <Checkbox name={'inCurrentLayer'} value={inCurrentLayer} onChange={this.onChange}/>
            </FormRow>
          </div>
          { this.renderMilSymbol() }
          <div className='footer-container'>
            <ButtonSave onClick={this.onSaveHandler}/>
            <ButtonCancel onClick={onClose}/>
            { !isNew && <ButtonDelete onClick={onRemove}/> }
          </div>
        </Form>
      </FocusTrap>
    </Wrapper>
  }
}
