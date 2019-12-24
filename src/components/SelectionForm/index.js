import React from 'react'
import PropTypes from 'prop-types'
import FocusTrap from 'react-focus-lock'
import { MovablePanel } from '@DZVIN/CommonComponents'
import { HotKeysContainer, HotKey } from '../common/HotKeys'
import { shortcuts } from '../../constants'
import SelectionTypes from '../../constants/SelectionTypes'
import i18n from '../../i18n'
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
    minHeight: 825,
    minWidth: 825,
  },
  [SelectionTypes.POLYLINE]: {
    title: i18n.SHAPE_POLYLINE,
    component: LineForm,
    minHeight: 685,
    minWidth: 900,
  },
  [SelectionTypes.CURVE]: {
    title: i18n.SHAPE_CURVE,
    component: LineForm,
    minHeight: 685,
    minWidth: 900,
  },
  [SelectionTypes.POLYGON]: {
    title: i18n.SHAPE_POLYGON,
    component: AreaForm,
    minHeight: 685,
  },
  [SelectionTypes.AREA]: {
    title: i18n.SHAPE_AREA,
    component: AreaForm,
    minHeight: 685,
  },
  [SelectionTypes.RECTANGLE]: {
    title: i18n.SHAPE_RECTANGLE,
    component: RectangleForm,
    minHeight: 490,
  },
  [SelectionTypes.CIRCLE]: {
    title: i18n.SHAPE_CIRCLE,
    component: CircleForm,
  },
  [SelectionTypes.SQUARE]: {
    title: i18n.SHAPE_SQUARE,
    component: SquareForm,
    minHeight: 550,
  },
  [SelectionTypes.TEXT]: {
    title: i18n.SHAPE_TEXT,
    component: TextForm,
    minHeight: 330,
    minWidth: 735,
  },
  [SelectionTypes.CONTOUR]: {
    title: i18n.CONTOUR,
    component: ContourForm,
    minHeight: 310,
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
      data,
      onOk,
      ovtData,
      canEdit,
      onCancel,
      orgStructures,
      onCoordinateFocusChange,
    } = this.props
    if (data === null || !forms[data.type]) {
      return null
    }
    const {
      title,
      minHeight,
      minWidth = 410,
      component: Component,
    } = forms[data.type]

    const { wrapper: Wrapper } = this.props
    return (
      <Wrapper
        title={title}
        onClose={onCancel}
        minWidth={minWidth}
        minHeight={minHeight}
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
  wrapper: PropTypes.oneOf([ MovablePanel ]),
  orgStructures: PropTypes.object,
  ovtData: PropTypes.object,
  ovtLoaded: PropTypes.bool,
  getOvtList: PropTypes.func,
}
