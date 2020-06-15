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
  MineFieldForm,
  CircularZoneForm,
  AttackForm,
  ConcentrationOfFireForm,
  DefeatStripForm,
} from './forms'
import SaveMilSymbolForm from './forms/MilSymbolForm/SaveMilSymbolForm'

const clientWidth = document?.documentElement?.clientWidth

const calc = clientWidth - 310 - 40

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
    minHeight: 'calc(100vh - 60px)',
    minWidth: 310,
    maxWidth: 310,
    defaultPosition: { x: calc, y: 40 },
    maxHeight: 'calc(100vh - 60px)',
  },
  [SelectionTypes.CURVE]: {
    title: i18n.SHAPE_CURVE,
    component: LineForm,
    minHeight: 'calc(100vh - 60px)',
    minWidth: 310,
    maxWidth: 310,
    defaultPosition: { x: calc, y: 40 },
    maxHeight: 'calc(100vh - 60px)',
  },
  [SelectionTypes.POLYGON]: {
    title: i18n.SHAPE_POLYGON,
    component: AreaForm,
    minHeight: 'calc(100vh - 60px)',
    minWidth: 310,
    maxWidth: 310,
    defaultPosition: { x: calc, y: 40 },
    maxHeight: 'calc(100vh - 60px)',
  },
  [SelectionTypes.AREA]: {
    title: i18n.SHAPE_AREA,
    component: AreaForm,
    minHeight: 'calc(100vh - 60px)',
    minWidth: 310,
    maxWidth: 310,
    defaultPosition: { x: calc, y: 40 },
    maxHeight: 'calc(100vh - 60px)',
  },
  [SelectionTypes.RECTANGLE]: {
    title: i18n.SHAPE_RECTANGLE,
    component: RectangleForm,
    minHeight: 'calc(100vh - 60px)',
    minWidth: 310,
    maxWidth: 310,
    defaultPosition: { x: calc, y: 40 },
    maxHeight: 'calc(100vh - 60px)',
  },
  [SelectionTypes.CIRCLE]: {
    title: i18n.SHAPE_CIRCLE,
    component: CircleForm,
    minHeight: 'calc(100vh - 60px)',
    minWidth: 310,
    maxWidth: 310,
    defaultPosition: { x: calc, y: 40 },
    maxHeight: 'calc(100vh - 60px)',
  },
  [SelectionTypes.SQUARE]: {
    title: i18n.SHAPE_SQUARE,
    component: SquareForm,
    minHeight: 'calc(100vh - 60px)',
    minWidth: 310,
    maxWidth: 310,
    defaultPosition: { x: calc, y: 40 },
    maxHeight: 'calc(100vh - 60px)',
  },
  [SelectionTypes.TEXT]: {
    title: i18n.SHAPE_TEXT,
    component: TextForm,
    minHeight: 'calc(100vh - 60px)',
    minWidth: 310,
    maxWidth: 310,
    defaultPosition: { x: calc, y: 40 },
    maxHeight: 'calc(100vh - 60px)',
  },
  [SelectionTypes.CONTOUR]: {
    title: i18n.CONTOUR,
    component: ContourForm,
    minHeight: 'calc(100vh - 60px)',
    minWidth: 310,
    maxWidth: 310,
    defaultPosition: { x: calc, y: 40 },
    maxHeight: 'calc(100vh - 60px)',
  },
  [SelectionTypes.GROUPED_REGION]: {
    title: i18n.CONTOUR_REGION_UNIT,
    component: ContourForm,
    minHeight: 330,
    maxHeight: 330,
    minWidth: 415,
  },
  [SelectionTypes.OLOVO]: {
    title: i18n.DEFEAT_STRIP_ZONE,
    component: DefeatStripForm,
    minHeight: 'calc(100vh - 60px)',
    minWidth: 310,
    maxWidth: 310,
    defaultPosition: { x: calc, y: 40 },
    maxHeight: 'calc(100vh - 60px)',
  },
  [SelectionTypes.SOPHISTICATED]: {
    title: i18n.MIL_SYMBOL,
    component: SophisticatedForm,
    minHeight: 'calc(100vh - 60px)',
    minWidth: 310,
    maxWidth: 310,
    defaultPosition: { x: calc, y: 40 },
    maxHeight: 'calc(100vh - 60px)',
  },
  [SelectionTypes.ATTACK]: {
    title: i18n.ATTACK,
    component: AttackForm,
    minHeight: 330,
    maxHeight: 630,
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
    title: i18n.SHAPE_MINED_AREA,
    component: MinedAreaForm,
    minHeight: 645,
    minWidth: 800,
    maxHeight: 655,
    maxWidth: 950,
  },
  [SelectionTypes.SECTORS]: {
    title: i18n.SHAPE_SECTORS,
    component: SectorsForm,
    minHeight: 'calc(100vh - 60px)',
    minWidth: 310,
    maxWidth: 310,
    defaultPosition: { x: calc, y: 40 },
    maxHeight: 'calc(100vh - 60px)',
  },
  [SelectionTypes.POLLUTION_CIRCLE]: {
    title: i18n.SHAPE_POLLUTION_CIRCLE,
    component: PollutionCircleForm,
    minHeight: 'calc(100vh - 60px)',
    minWidth: 310,
    maxWidth: 310,
    defaultPosition: { x: calc, y: 40 },
    maxHeight: 'calc(100vh - 60px)',
  },
  [SelectionTypes.CIRCULAR_ZONE]: {
    title: i18n.SHAPE_CIRCULAR_ZONE,
    component: CircularZoneForm,
    minHeight: 'calc(100vh - 60px)',
    minWidth: 310,
    maxWidth: 310,
    defaultPosition: { x: calc, y: 40 },
    maxHeight: 'calc(100vh - 60px)',
  },
  [SelectionTypes.MINE_FIELD]: {
    title: i18n.SHAPE_MINEFIELD,
    component: MineFieldForm,
    minHeight: 420,
    minWidth: 750,
    maxHeight: 420,
  },
  [SelectionTypes.CONCENTRATION_FIRE]: {
    title: i18n.CONCENTRATION_FIRE,
    component: ConcentrationOfFireForm,
    minHeight: 670,
    maxHeight: 680,
    minWidth: 415,
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
      onSaveError,
      onCheckSave,
      showErrorSave,
      orgStructures,
      onCoordinateFocusChange,
      wrapper: Wrapper,
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
        case '270701':
          formType = SelectionTypes.MINE_FIELD
          break
        case '140601':
        case '140602':
        case '140603':
        case '140605':
          formType = SelectionTypes.ATTACK
          break
        case '270800':
          formType = SelectionTypes.MINEDAREA
          break
        case '017016':
          formType = SelectionTypes.CONCENTRATION_FIRE
          break
        default: formType = SelectionTypes.SOPHISTICATED
      }
    }
    const {
      title,
      minHeight,
      maxHeight,
      minWidth,
      maxWidth,
      defaultPosition,
      component: Component,
    } = forms[formType]

    const showErrorMilSymbolForm = showErrorSave && formType === SelectionTypes.POINT
    const errorSaveMilSymbolForm = (errorCode = 1) => {
      const { unit, code } = this.props.data
      const { orgStructures, onCloseSaveError } = this.props
      const unitText = orgStructures.byIds && orgStructures.byIds[unit] ? orgStructures.byIds[unit].fullName : ''
      return (
        <Wrapper
          title={i18n.ERROR_CODE_SIGNS}>
          <SaveMilSymbolForm
            unitText={unitText}
            errorCode={errorCode}
            code={code}
            notClickable={false}
            onApply={() => { onCloseSaveError(); onOk() }}
            onCancel={() => { onCloseSaveError() }}
          />
        </Wrapper>)
    }

    return (showErrorMilSymbolForm
      ? errorSaveMilSymbolForm(this.props.errorCode)
      : <>
        <NotClickableArea/>
        <Wrapper
          title={title}
          onClose={onCancel}
          minWidth={minWidth}
          maxWidth={maxWidth}
          defaultPosition={defaultPosition}
          maxHeight={maxHeight}
          minHeight={minHeight}
        >
          {
            <FocusTrap>
              <HotKeysContainer>
                <Component
                  data={data}
                  canEdit={canEdit}
                  orgStructures={orgStructures}
                  onOk={onOk}
                  onChange={this.changeHandler}
                  onClose={onCancel}
                  onSaveError={onSaveError}
                  onCheckSave={onCheckSave}
                  onAddToTemplates={this.addToTemplateHandler}
                  onCoordinateFocusChange={onCoordinateFocusChange}
                  ovtData={ovtData}
                />
                <HotKey onKey={onCancel} selector={shortcuts.ESC}/>
              </HotKeysContainer>
            </FocusTrap>}
        </Wrapper>
      </>
    )
  }
}

SelectionForm.propTypes = {
  data: PropTypes.object,
  canEdit: PropTypes.bool,
  showForm: PropTypes.string,
  showErrorSave: PropTypes.bool,
  onChange: PropTypes.func,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  onError: PropTypes.func,
  onSaveError: PropTypes.func,
  onCheckSave: PropTypes.func,
  onCloseSaveError: PropTypes.func,
  onAddToTemplates: PropTypes.func,
  onCoordinateFocusChange: PropTypes.func,
  wrapper: PropTypes.oneOf([ MovablePanel ]),
  orgStructures: PropTypes.object,
  ovtData: PropTypes.object,
  ovtLoaded: PropTypes.bool,
  getOvtList: PropTypes.func,
  errorCode: PropTypes.number,
}
