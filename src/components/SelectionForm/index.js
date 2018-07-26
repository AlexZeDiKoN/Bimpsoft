import React from 'react'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import SelectionTypes from '../../constants/SelectionTypes'
import i18n from '../../i18n'
import SymbolForm from './SymbolForm'
import ShapeForm from './ShapeForm'

const { common: { MovablePanel } } = components

const forms = {
  [SelectionTypes.POINT]: {
    title: i18n.MIL_SYMBOL,
    component: SymbolForm,
  },
  [SelectionTypes.POLYLINE]: {
    title: i18n.SHAPE_POLYLINE,
    component: ShapeForm,
  },
  [SelectionTypes.CURVE]: {
    title: i18n.SHAPE_CURVE,
    component: ShapeForm,
  },
  [SelectionTypes.POLYGON]: {
    title: i18n.SHAPE_POLYGON,
    component: ShapeForm,
  },
  [SelectionTypes.AREA]: {
    title: i18n.SHAPE_AREA,
    component: ShapeForm,
  },
  [SelectionTypes.RECTANGLE]: {
    title: i18n.SHAPE_RECTANGLE,
    component: ShapeForm,
  },
  [SelectionTypes.CIRCLE]: {
    title: i18n.SHAPE_CIRCLE,
    component: ShapeForm,
  },
  [SelectionTypes.SQUARE]: {
    title: i18n.SHAPE_SQUARE,
    component: ShapeForm,
  },
  [SelectionTypes.TEXT]: {
    title: i18n.SHAPE_TEXT,
    component: ShapeForm,
  },
}

export default class SelectionForm extends React.Component {
  changeHandler = (data) => {
    const { selectionData } = this.props
    switch (selectionData.type) {
      case SelectionTypes.POINT:
        this.props.onChange(data)
        break
      default:
    }
  }

  cancelHandler = () => {
    this.props.onCancel()
  }

  addToTemplateHandler = (data) => {
    this.props.onAddToTemplates(data)
  }

  render () {
    const { selectionData } = this.props
    if (selectionData === null || !forms.hasOwnProperty(selectionData.type)) {
      return null
    }
    const { title, component: Component } = forms[selectionData.type]

    const { wrapper: Wrapper } = this.props
    return (
      <Wrapper title={title} component={ (
        <Component
          {...selectionData}
          onChange={this.changeHandler}
          onClose={this.cancelHandler}
          onAddToTemplates={this.addToTemplateHandler}
        />
      ) } />
    )
  }
}

SelectionForm.propTypes = {
  selectionData: PropTypes.object,
  onChange: PropTypes.func,
  onCancel: PropTypes.func,
  onAddToTemplates: PropTypes.func,
  wrapper: PropTypes.instanceOf(MovablePanel),
}
