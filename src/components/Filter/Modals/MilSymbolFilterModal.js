import React from 'react'
import PropTypes from 'prop-types'
import FocusTrap from 'react-focus-lock'
import { model } from '@C4/MilSymbolEditor'
import {
  ButtonSave,
  ButtonCancel,
  MovablePanel,
  Input,
  FormColumnFloat,
  Checkbox,
  FormRow,
  ButtonDelete,
  FilterInput,
  components,
} from '@C4/CommonComponents'
import { compose } from 'recompose'
import memoize from 'memoize-one'
import i18n from '../../../i18n'
import { WithMilSymbol } from '../../SelectionForm/parts'
import { propTypes as MilSymbolPropTypes } from '../../SelectionForm/parts/WithMilSymbol'
import './style.css'

const { form: { default: Form } } = components
const { credibilities, symbolOptions } = model
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

const fixConfig = memoize((config) => ({ ...config, CREDIBILITY: { hidden: true } }))
const Decorator = compose(WithMilSymbol)(React.Component)

const INFORMATION = 'INFORMATION'
const SOURCE = 'SOURCE'
const informationKeys = credibilities.informationValues.map(({ id }) => id).filter(Boolean)
const sourceKeys = credibilities.sourceValues.map(({ id }) => id).filter(Boolean)

export class MilSymbolFilterModal extends Decorator {
  static displayName = 'MilSymbolFilterModal'

  static propTypes = propTypes

  constructor (props) {
    super(props)
    const dataState = props?.data?.attributes?.[symbolOptions.evaluationRating]
    const [ sourceState = '', informationState = '' ] = (dataState ?? '').split('')
    const source = sourceKeys.includes(sourceState) ? sourceState : ''
    const information = informationKeys.includes(sourceState)
      ? sourceState
      : informationKeys.includes(informationState)
        ? informationState
        : ''
    this.state = {
      data: props?.data,
      name: props?.name,
      inCurrentLayer: props?.inCurrentLayer,
      errors: {},
      [INFORMATION]: information,
      [SOURCE]: source,
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

  fixElementsConfig = fixConfig

  onChangeCredibility = (target) => {
    const { target: { name, value } } = target
    this.onChange(target)
    const source = name === SOURCE ? value : this.state[SOURCE]
    const information = name === INFORMATION ? value : this.state[INFORMATION]
    this.setResult((result) => {
      return result.updateIn([ 'attributes' ], (attributes) => attributes.set(symbolOptions.evaluationRating, source + information))
    })
  }

  getValueState = (key) => this.state[key]

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
        <Form className="shape-form mil-symbol-filter--wrap">
          <div className="mil-symbol-filter__content">
            <FormColumnFloat label={i18n.NAME_STRAINER} hasValue={Boolean(name)}>
              <Input name={'name'} errors={errors.name} value={name} onChange={this.onChange}/>
            </FormColumnFloat>
            <FormRow label={`${i18n.LAYER}: ${layerData?.name}`} alignLabel="right">
              <Checkbox name={'inCurrentLayer'} value={inCurrentLayer} onChange={this.onChange}/>
            </FormRow>
          </div>
          { this.renderMilSymbol() }
          <div className="mil-symbol-filter__content--footer">
            <FormColumnFloat label={i18n.SOURCE} hasValue>
              <FilterInput
                values={credibilities.sourceValues}
                value={this.getValueState(SOURCE)}
                name={SOURCE}
                onChange={this.onChangeCredibility}
              />
            </FormColumnFloat>
            <FormColumnFloat label={i18n.INFORMATION} hasValue>
              <FilterInput
                values={credibilities.informationValues}
                value={this.getValueState(INFORMATION)}
                name={INFORMATION}
                onChange={this.onChangeCredibility}
              />
            </FormColumnFloat>
          </div>
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
