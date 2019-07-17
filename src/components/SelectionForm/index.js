import React from 'react'
import PropTypes from 'prop-types'
import FocusTrap from 'react-focus-lock'
import { HotKeysContainer, HotKey } from '../common/HotKeys'
import { shortcuts } from '../../constants'
import SelectionTypes from '../../constants/SelectionTypes'
import i18n from '../../i18n'
import ModalContainer from '../common/ModalContainer'
import {
  AreaForm,
  CircleForm,
  LineForm,
  MilSymbolForm,
  RectangleForm,
  SquareForm,
  TextForm,
  ContourForm,
} from './forms'

const forms = {
  [SelectionTypes.POINT]: {
    title: i18n.MIL_SYMBOL,
    component: MilSymbolForm,
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
  [SelectionTypes.CONTOUR]: {
    title: i18n.CONTOUR,
    component: ContourForm,
  },
}

export default class SelectionForm extends React.Component {
  componentDidMount () {
    !this.props.ovtLoaded && this.props.getOvtList()
  }

  changeHandler = (data) => {
    if (this.props.canEdit) {
      this.props.onChange(data)
    }
  }

  addToTemplateHandler = (data) => {
    this.props.onAddToTemplates(data)
  }

  render () {
    const {
      data, orgStructures, canEdit, onCancel, onOk, onCoordinateFocusChange,
      ovtData,
    } = this.props
    if (data === null || !forms.hasOwnProperty(data.type)) {
      return null
    }
    const { title, component: Component } = forms[data.type]

    const { wrapper: Wrapper } = this.props
    return (
      <Wrapper
        title={title}
        onClose={onCancel}
        defaultPosition={{ x: window.screen.width * 0.5, y: window.screen.height * 0.02 }}
      >
        <FocusTrap>
          <HotKeysContainer>
            <Component
              data={data}
              canEdit={canEdit}
              orgStructures={orgStructures}
              onOk={onOk}
              onChange={this.changeHandler}
              onClose={onCancel}
              onAddToTemplates={this.addToTemplateHandler}
              onCoordinateFocusChange={onCoordinateFocusChange}
              ovtData={ovtData}
            />
            <HotKey onKey={onCancel} selector={shortcuts.ESC}/>
          </HotKeysContainer>
        </FocusTrap>
      </Wrapper>
    )
  }
}

SelectionForm.propTypes = {
  data: PropTypes.object,
  canEdit: PropTypes.bool,
  showForm: PropTypes.string,
  onChange: PropTypes.func,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  onError: PropTypes.func,
  onAddToTemplates: PropTypes.func,
  onCoordinateFocusChange: PropTypes.func,
  wrapper: PropTypes.oneOf([ ModalContainer ]),
  orgStructures: PropTypes.object,
  ovtData: PropTypes.object,
  ovtLoaded: PropTypes.bool,
  getOvtList: PropTypes.func,
}
