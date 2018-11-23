import React from 'react'
import PropTypes from 'prop-types'
import FocusTrap from 'react-focus-lock'
import { HotKeysContainer, HotKey } from '../common/HotKeys'
import { shortcuts } from '../../constants'
import SelectionTypes from '../../constants/SelectionTypes'
import i18n from '../../i18n'
import ModalContainer from '../common/ModalContainer'
import SymbolForm from './forms/SymbolForm'
import LineForm from './forms/LineForm'
import AreaForm from './forms/AreaForm'
import RectangleForm from './forms/RectangleForm'
import SquareForm from './forms/SquareForm'
import CircleForm from './forms/CircleForm'
import TextForm from './forms/TextForm'

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
    component: AreaForm,
  },
  [SelectionTypes.AREA]: {
    title: i18n.SHAPE_AREA,
    component: AreaForm,
  },
  [SelectionTypes.RECTANGLE]: {
    title: i18n.SHAPE_RECTANGLE,
    component: RectangleForm,
  },
  [SelectionTypes.CIRCLE]: {
    title: i18n.SHAPE_CIRCLE,
    component: CircleForm,
  },
  [SelectionTypes.SQUARE]: {
    title: i18n.SHAPE_SQUARE,
    component: SquareForm,
  },
  [SelectionTypes.TEXT]: {
    title: i18n.SHAPE_TEXT,
    component: TextForm,
  },
}

export default class SelectionForm extends React.Component {
  changeHandler = (data) => {
    if (this.props.canEdit) {
      if (this.props.data) {
        data = { ...this.props.data, ...data }
      }
      this.props.onChange(this.props.showForm, data)
    } else {
      this.props.onCancel()
    }
  }

  cancelHandler = () => {
    this.props.onCancel()
  }

  addToTemplateHandler = (data) => {
    this.props.onAddToTemplates(data)
  }

  render () {
    const { data, orgStructures, canEdit, onError } = this.props
    if (data === null || !forms.hasOwnProperty(data.type)) {
      return null
    }
    const { title, component: Component } = forms[data.type]

    const { wrapper: Wrapper } = this.props
    return (
      <Wrapper title={title} onClose={this.cancelHandler}>
        <FocusTrap>
          <HotKeysContainer>
            <Component
              {...data}
              canEdit={canEdit}
              orgStructures={orgStructures}
              onChange={this.changeHandler}
              onClose={this.cancelHandler}
              onError={onError}
              onAddToTemplates={this.addToTemplateHandler}
            />
            <HotKey onKey={this.cancelHandler} selector={shortcuts.ESC}/>
          </HotKeysContainer>
        </FocusTrap>
      </Wrapper>
    )
  }
}

SelectionForm.propTypes = {
  data: PropTypes.object,
  canEdit: PropTypes.bool,
  onChange: PropTypes.func,
  onCancel: PropTypes.func,
  onError: PropTypes.func,
  onAddToTemplates: PropTypes.func,
  wrapper: PropTypes.oneOf([ ModalContainer ]),
  orgStructures: PropTypes.object,
}
