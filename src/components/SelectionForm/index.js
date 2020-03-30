import React from 'react'
import PropTypes from 'prop-types'
import FocusTrap from 'react-focus-lock'
import { MovablePanel, NotClickableArea } from '@DZVIN/CommonComponents'
import { HotKeysContainer, HotKey } from '../common/HotKeys'
import { shortcuts } from '../../constants'
import SelectionTypes from '../../constants/SelectionTypes'
import { extractLineCode } from '../WebMap/patch/Sophisticated/utils'
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
  SophisticatedForm,
  AirborneForm,
  ManoeuvreForm,
  MinedAreaForm,
  SectorsForm,
  PollutionCircleForm,
} from './forms'
import CircularZoneForm from './forms/CircularZoneForm'

const forms = {
  [SelectionTypes.POINT]: {
    title: i18n.MIL_SYMBOL,
    component: MilSymbolForm,
    minWidth: 825,
    minHeight: 825,
    maxHeight: 825,
  },
  [SelectionTypes.POLYLINE]: {
    title: i18n.SHAPE_POLYLINE,
    component: LineForm,
    minHeight: 795,
    minWidth: 900,
    maxHeight: 805,
  },
  [SelectionTypes.CURVE]: {
    title: i18n.SHAPE_CURVE,
    component: LineForm,
    minHeight: 670,
    maxHeight: 750,
    minWidth: 900,
  },
  [SelectionTypes.POLYGON]: {
    title: i18n.SHAPE_POLYGON,
    component: AreaForm,
    minHeight: 750,
    maxHeight: 750,
    minWidth: 415,
  },
  [SelectionTypes.AREA]: {
    title: i18n.SHAPE_AREA,
    component: AreaForm,
    minHeight: 750,
    maxHeight: 750,
    minWidth: 415,
  },
  [SelectionTypes.RECTANGLE]: {
    title: i18n.SHAPE_RECTANGLE,
    component: RectangleForm,
    minHeight: 490,
    maxHeight: 490,
    minWidth: 415,
  },
  [SelectionTypes.CIRCLE]: {
    title: i18n.SHAPE_CIRCLE,
    component: CircleForm,
    minHeight: 575,
    maxHeight: 575,
    minWidth: 415,
  },
  [SelectionTypes.SQUARE]: {
    title: i18n.SHAPE_SQUARE,
    component: SquareForm,
    minHeight: 550,
    maxHeight: 550,
    minWidth: 415,
  },
  [SelectionTypes.TEXT]: {
    title: i18n.SHAPE_TEXT,
    component: TextForm,
    minHeight: 330,
    minWidth: 735,
    maxHeight: 750,
  },
  [SelectionTypes.CONTOUR]: {
    title: i18n.CONTOUR,
    component: ContourForm,
    minHeight: 330,
    maxHeight: 330,
    minWidth: 415,
  },
  [SelectionTypes.SOPHISTICATED]: {
    title: i18n.SOPHISTICATED,
    component: SophisticatedForm,
    minHeight: 330,
    maxHeight: 330,
    minWidth: 415,
  },
  [SelectionTypes.AIRBORNE]: {
    title: i18n.SHAPE_AIRBORNE,
    component: AirborneForm,
    minHeight: 795,
    minWidth: 900,
    maxHeight: 805,
  },
  [SelectionTypes.MANOEUVRE]: {
    title: i18n.SHAPE_MANOEUVRE,
    component: ManoeuvreForm,
    minHeight: 795,
    minWidth: 900,
    maxHeight: 805,
  },
  [SelectionTypes.MINEDAREA]: {
    title: i18n.SHAPE_MINEDAREA,
    component: MinedAreaForm,
    minHeight: 645,
    minWidth: 900,
    maxHeight: 655,
  },
  [SelectionTypes.SECTORS]: {
    title: i18n.SHAPE_SECTORS,
    component: SectorsForm,
    minHeight: 645,
    minWidth: 600,
    maxWidth: 700,
    maxHeight: 655,
  },
  [SelectionTypes.POLLUTION_CIRCLE]: {
    title: i18n.SHAPE_POLLUTINCIRCLE,
    component: PollutionCircleForm,
    minHeight: 545,
    minWidth: 600,
    maxHeight: 545,
  },
  [SelectionTypes.CIRCULAR_ZONE]: {
    title: i18n.SHAPE_CIRCULARZONE,
    component: CircularZoneForm,
    minHeight: 645,
    minWidth: 550,
    maxHeight: 645,
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
    let formType
    if (data.type !== SelectionTypes.SOPHISTICATED) {
      formType = data.type
    } else {
      switch (extractLineCode(data.code)) {
        case '017076':
          formType = SelectionTypes.SECTORS
          break
        case '272100':
          formType = SelectionTypes.POLLUTION_CIRCLE
          break
        case '017019':
          formType = SelectionTypes.CIRCULAR_ZONE
          break
        default: formType = SelectionTypes.SOPHISTICATED
      }
    }
    const {
      title,
      minHeight,
      maxHeight,
      minWidth,
      component: Component,
    } = forms[formType]

    const { wrapper: Wrapper } = this.props
    return (
      <>
        <NotClickableArea/>
        <Wrapper
          title={title}
          onClose={onCancel}
          minWidth={minWidth}
          maxHeight={maxHeight}
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
      </>
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
