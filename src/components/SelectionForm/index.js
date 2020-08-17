import React from 'react'
import PropTypes from 'prop-types'
// import FocusTrap from 'react-focus-lock'
import { MovablePanel, NotClickableArea, ResizeEnable } from '@DZVIN/CommonComponents'
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
import WarningForm from './forms/WarningForm'

const clientWidth = document?.documentElement?.clientWidth

const calc = clientWidth - 310 - 40

const forms = {
  [SelectionTypes.POINT]: {
    title: i18n.MIL_SYMBOL,
    component: MilSymbolForm,
    minWidth: 825,
    enableResizing: ResizeEnable.ALL_DISABLED,
    minHeight: 'calc(100vh - 150px)',
    maxHeight: 'calc(100vh - 150px)',
  },
  [SelectionTypes.POLYLINE]: {
    title: i18n.MIL_SYMBOL,
    component: LineForm,
    minHeight: 'calc(100vh - 60px)',
    minWidth: 310,
    maxWidth: 310,
    defaultPosition: { x: calc, y: 40 },
    maxHeight: 'calc(100vh - 60px)',
  },
  [SelectionTypes.CURVE]: {
    title: i18n.MIL_SYMBOL,
    component: LineForm,
    minHeight: 'calc(100vh - 60px)',
    minWidth: 310,
    maxWidth: 310,
    defaultPosition: { x: calc, y: 40 },
    maxHeight: 'calc(100vh - 60px)',
  },
  [SelectionTypes.POLYGON]: {
    title: i18n.MIL_SYMBOL,
    component: AreaForm,
    minHeight: 'calc(100vh - 60px)',
    minWidth: 310,
    maxWidth: 310,
    defaultPosition: { x: calc, y: 40 },
    maxHeight: 'calc(100vh - 60px)',
  },
  [SelectionTypes.AREA]: {
    title: i18n.MIL_SYMBOL,
    component: AreaForm,
    minHeight: 'calc(100vh - 60px)',
    minWidth: 310,
    maxWidth: 310,
    defaultPosition: { x: calc, y: 40 },
    maxHeight: 'calc(100vh - 60px)',
  },
  [SelectionTypes.RECTANGLE]: {
    title: i18n.MIL_SYMBOL,
    component: RectangleForm,
    minHeight: 'calc(100vh - 60px)',
    minWidth: 310,
    maxWidth: 310,
    defaultPosition: { x: calc, y: 40 },
    maxHeight: 'calc(100vh - 60px)',
  },
  [SelectionTypes.CIRCLE]: {
    title: i18n.MIL_SYMBOL,
    component: CircleForm,
    minHeight: 'calc(100vh - 60px)',
    minWidth: 310,
    maxWidth: 310,
    defaultPosition: { x: calc, y: 40 },
    maxHeight: 'calc(100vh - 60px)',
  },
  [SelectionTypes.SQUARE]: {
    title: i18n.MIL_SYMBOL,
    component: SquareForm,
    minHeight: 'calc(100vh - 60px)',
    minWidth: 310,
    maxWidth: 310,
    defaultPosition: { x: calc, y: 40 },
    maxHeight: 'calc(100vh - 60px)',
  },
  [SelectionTypes.TEXT]: {
    title: i18n.TEXT,
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
    minHeight: 'calc(100vh - 60px)',
    minWidth: 310,
    maxWidth: 310,
    defaultPosition: { x: calc, y: 40 },
    maxHeight: 'calc(100vh - 60px)',
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
    title: i18n.MIL_SYMBOL,
    component: AttackForm,
    minHeight: 'calc(100vh - 60px)',
    minWidth: 310,
    maxWidth: 310,
    defaultPosition: { x: calc, y: 40 },
    maxHeight: 'calc(100vh - 60px)',
  },
  [SelectionTypes.MINED_AREA]: {
    title: i18n.MIL_SYMBOL,
    component: MinedAreaForm,
    minHeight: 'calc(100vh - 60px)',
    minWidth: 310,
    maxWidth: 310,
    defaultPosition: { x: calc, y: 40 },
    maxHeight: 'calc(100vh - 60px)',
  },
  [SelectionTypes.SECTORS]: {
    title: i18n.MIL_SYMBOL,
    component: SectorsForm,
    minHeight: 'calc(100vh - 60px)',
    minWidth: 310,
    maxWidth: 310,
    defaultPosition: { x: calc, y: 40 },
    maxHeight: 'calc(100vh - 60px)',
  },
  [SelectionTypes.POLLUTION_CIRCLE]: {
    title: i18n.MIL_SYMBOL,
    component: PollutionCircleForm,
    minHeight: 'calc(100vh - 60px)',
    minWidth: 310,
    maxWidth: 310,
    defaultPosition: { x: calc, y: 40 },
    maxHeight: 'calc(100vh - 60px)',
  },
  [SelectionTypes.CIRCULAR_ZONE]: {
    title: i18n.MIL_SYMBOL,
    component: CircularZoneForm,
    minHeight: 'calc(100vh - 60px)',
    minWidth: 310,
    maxWidth: 310,
    defaultPosition: { x: calc, y: 40 },
    maxHeight: 'calc(100vh - 60px)',
  },
  [SelectionTypes.MINE_FIELD]: {
    title: i18n.MIL_SYMBOL,
    component: MineFieldForm,
    minHeight: 'calc(100vh - 60px)',
    minWidth: 310,
    maxWidth: 310,
    defaultPosition: { x: calc, y: 40 },
    maxHeight: 'calc(100vh - 60px)',
  },
  [SelectionTypes.CONCENTRATION_FIRE]: {
    title: i18n.MIL_SYMBOL,
    component: ConcentrationOfFireForm,
    minHeight: 'calc(100vh - 60px)',
    minWidth: 310,
    maxWidth: 310,
    defaultPosition: { x: calc, y: 40 },
    maxHeight: 'calc(100vh - 60px)',
  },
}

export default class SelectionForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      wereChanges: false,
      showWarningCancel: false,
    }
  }

  componentDidMount () {
    !this.props.ovtLoaded && this.props.getOvtList()
  }

  changeHandler = (data) => {
    if (this.props.canEdit) {
      this.setState({ wereChanges: true })
      this.props.onChange(data)
    }
  }

  okHandler = () => {
    const { onOk } = this.props
    this.setState({ wereChanges: false, showWarningCancel: false }) // сброс проверки внесения изменений
    onOk && onOk()
  }

  checkSaveHandler = () => {
    const { onCheckSave } = this.props
    this.resetWereChange()
    onCheckSave && onCheckSave()
  }

  addToTemplateHandler = (data) => {
    this.props.onAddToTemplates(data)
  }

  cancelButtonClick = () => {
    if (this.state.wereChanges) {
      this.setState({ showWarningCancel: true })
    } else {
      this.resetWereChange()
      const { onCancel } = this.props
      onCancel && onCancel()
    }
  }

  warningCancelHandler = () => {
    this.setState({ wereChanges: false, showWarningCancel: false })
    const { onCancel } = this.props
    onCancel && onCancel()
  }

  resetWereChange = () => {
    this.setState({ wereChanges: false })
  }

  resetShowWarningCancel = () => {
    this.setState({ showWarningCancel: false })
  }

  render () {
    const {
      data,
      onOk,
      ovtData,
      canEdit,
      onSaveError,
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
          formType = SelectionTypes.MINED_AREA
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
      enableResizing,
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
            onApply={() => { this.resetWereChange(); onCloseSaveError(); onOk() }}
            onCancel={() => { this.resetWereChange(); onCloseSaveError() }}
          />
        </Wrapper>)
    }
    return (showErrorMilSymbolForm
      ? errorSaveMilSymbolForm(this.props.errorCode)
      : <>
        {this.state.showWarningCancel
          ? <WarningForm
            title={i18n.WARNING}
            onClose={ this.resetShowWarningCancel }
            minHeight={150}
            minWidth={300}
            message={i18n.WARNING_MESSAGE_1}
            question={i18n.QUESTION_3}
            onNo={this.warningCancelHandler}
            onYes={this.okHandler}>
          </WarningForm>
          : <></>
        }
        <NotClickableArea/>
        <Wrapper
          title={title}
          onClose={this.cancelButtonClick}
          bounds={'div.app-body'}
          minWidth={minWidth}
          maxWidth={maxWidth}
          enableResizing={enableResizing}
          defaultPosition={defaultPosition}
          maxHeight={maxHeight}
          minHeight={minHeight}
        >
          <HotKeysContainer>
            <Component
              data={data}
              canEdit={canEdit && !this.state.showWarningCancel}
              orgStructures={orgStructures}
              onOk={this.okHandler}
              onChange={this.changeHandler}
              onClose={this.cancelButtonClick}
              onSaveError={onSaveError}
              onCheckSave={this.checkSaveHandler}
              onAddToTemplates={this.addToTemplateHandler}
              onCoordinateFocusChange={onCoordinateFocusChange}
              ovtData={ovtData}
            />
            <HotKey onKey={this.cancelButtonClick} selector={shortcuts.ESC}/>
          </HotKeysContainer>
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
