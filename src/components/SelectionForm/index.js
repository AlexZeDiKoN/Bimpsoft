import React from 'react'
import PropTypes from 'prop-types'
import SelectionTypes from '../../constants/SelectionTypes'
import i18n from '../../i18n'
import ModalContainer from '../common/ModalContainer'
import SymbolForm from './SymbolForm'
import LineForm from './LineForm'
import RactangleForm from './RactangleForm'
import TextForm from './TextForm'

const forms = {
  [SelectionTypes.POINT]: {
    title: i18n.MIL_SYMBOL,
    component: SymbolForm,
  },
  [SelectionTypes.POLYLINE]: {
    title: i18n.SHAPE_POLYLINE,
    component: LineForm,
  },
  [SelectionTypes.CURVE]: {
    title: i18n.SHAPE_CURVE,
    component: LineForm,
  },
  [SelectionTypes.POLYGON]: {
    title: i18n.SHAPE_POLYGON,
    component: LineForm,
  },
  [SelectionTypes.AREA]: {
    title: i18n.SHAPE_AREA,
    component: LineForm,
  },
  [SelectionTypes.RECTANGLE]: {
    title: i18n.SHAPE_RECTANGLE,
    component: RactangleForm,
  },
  [SelectionTypes.CIRCLE]: {
    title: i18n.SHAPE_CIRCLE,
    component: LineForm,
  },
  [SelectionTypes.SQUARE]: {
    title: i18n.SHAPE_SQUARE,
    component: LineForm,
  },
  [SelectionTypes.TEXT]: {
    title: i18n.SHAPE_TEXT,
    component: TextForm,
  },
}

export default class SelectionForm extends React.Component {
  changeHandler = (data) => {
    this.props.canEdit ? this.props.onChange(data) : this.props.onCancel()
  }

  cancelHandler = () => {
    this.props.onCancel()
  }

  addToTemplateHandler = (data) => {
    this.props.onAddToTemplates(data)
  }

  render () {
    const { data, orgStructures, canEdit } = this.props
    if (data === null || !forms.hasOwnProperty(data.type)) {
      return null
    }
    const { title, component: Component } = forms[data.type]

    const { wrapper: Wrapper } = this.props
    return (
      <Wrapper title={title} onClose={this.cancelHandler}>
        <Component
          {...data}
          canEdit={canEdit}
          orgStructures={orgStructures}
          onChange={this.changeHandler}
          onClose={this.cancelHandler}
          onAddToTemplates={this.addToTemplateHandler}
        />
      </Wrapper>
    )
  }
}

SelectionForm.propTypes = {
  data: PropTypes.object,
  canEdit: PropTypes.bool,
  onChange: PropTypes.func,
  onCancel: PropTypes.func,
  onAddToTemplates: PropTypes.func,
  wrapper: PropTypes.oneOf([ ModalContainer ]),
  orgStructures: PropTypes.object,
}
