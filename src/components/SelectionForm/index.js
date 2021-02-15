import React from 'react'
import PropTypes from 'prop-types'
import { MovablePanel, NotClickableArea, ResizeEnable } from '@C4/CommonComponents'
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

const sidebarWidth = 285

const calc = clientWidth - 310 - 40

const forms = {
  [SelectionTypes.POINT]: {
    title: i18n.MIL_SYMBOL,
    component: MilSymbolForm,
    maxWidth: 825,
    minHeight: 'calc(100vh - 150px)',
    maxHeight: 'calc(100vh - 150px)',
    defaultSize: {
      height: '100%',
      width: 825,
    },
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
    title: i18n.MIL_SYMBOL,
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
      wereChanges: false, // Были изменения
      showWarningCancel: false,
    }
  }

  componentDidMount () {
    !this.props.ovtLoaded && this.props.getOvtList()
    !this.props.dictionariesLoaded && this.props.getDictionaries()
  }

  changeHandler = (data) => {
    if (this.props.canEdit) {
      this.setState({ wereChanges: true })
      this.props.onChange(data)
    }
  }

  okHandler = () => {
    const { onOk } = this.props
    this.setState({ wereChanges: false, showWarningCancel: false }) // сброс флага "Были изменения данных"
    onOk && onOk()
  }

  checkSaveHandler = () => {
    const { onCheckSave } = this.props
    this.resetWereChange()
    return onCheckSave && onCheckSave()
  }

  addToTemplateHandler = (data) => {
    this.props.onAddToTemplates(data)
  }

  cancelButtonClick = () => {
    if (this.state.wereChanges) {
      this.setState({ showWarningCancel: true })
    } else {
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

  warningSaveMilSymbol = () => {
    const {
      orgStructures: { byIds },
      data: { unit, code },
      onCloseSaveError,
      onOk,
      errorCode = 1,
    } = this.props
    const unitText = (byIds && byIds[unit]) ? byIds[unit].fullName : ''
    return (
      <SaveMilSymbolForm
        errorCode={errorCode}
        doubleObjects={ [ { code, unit: unitText } ] }
        onApply={() => { this.resetWereChange(); onCloseSaveError(); onOk() }}
        onCancel={ onCloseSaveError }
      />
    )
  }

  render () {
    const {
      data,
      ovtData,
      ovtSubKind,
      ovtKind,
      canEdit,
      onSaveError,
      onEnableSaveButton,
      showErrorSave,
      orgStructures,
      onCoordinateFocusChange,
      wrapper: Wrapper,
      sidebarSelectedTabIndex,
      coordinatesType,
      disableSaveButton,
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
      defaultPosition,
      defaultSize,
      component: Component,
    } = forms[formType]

    return ((showErrorSave && formType === SelectionTypes.POINT)
      ? this.warningSaveMilSymbol()
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
          enableResizing={ResizeEnable.ALL_DISABLED}
          defaultPosition={defaultPosition && sidebarSelectedTabIndex >= 0
            ? { x: defaultPosition.x - sidebarWidth, y: defaultPosition.y }
            : defaultPosition}
          maxHeight={maxHeight}
          minHeight={minHeight}
          defaultSize={defaultSize}
        >
          <HotKeysContainer className="hot-key-container-size">
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
              ovtSubKind={ovtSubKind}
              ovtKind={ovtKind}
              coordinatesType={coordinatesType}
              disableSaveButton={disableSaveButton}
              onEnableSaveButton={onEnableSaveButton}
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
  disableSaveButton: PropTypes.bool,
  onChange: PropTypes.func,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  onError: PropTypes.func,
  onSaveError: PropTypes.func,
  onCheckSave: PropTypes.func,
  onEnableSaveButton: PropTypes.func,
  onCloseSaveError: PropTypes.func,
  onAddToTemplates: PropTypes.func,
  onCoordinateFocusChange: PropTypes.func,
  wrapper: PropTypes.oneOf([ MovablePanel ]),
  orgStructures: PropTypes.object,
  ovtData: PropTypes.object,
  ovtLoaded: PropTypes.bool,
  dictionariesLoaded: PropTypes.bool,
  getOvtList: PropTypes.func,
  getDictionaries: PropTypes.func,
  ovtSubKind: PropTypes.object,
  ovtKind: PropTypes.object,
  errorCode: PropTypes.number,
  sidebarSelectedTabIndex: PropTypes.number,
  coordinatesType: PropTypes.string,
}
