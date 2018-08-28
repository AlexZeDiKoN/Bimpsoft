import React from 'react'
import { components } from '@DZVIN/CommonComponents'
import { List } from 'immutable'
import PropTypes from 'prop-types'
import i18n from '../../../i18n'
import SubordinationLevelSelect from '../../SubordinationLevelSelect'
import { SubordinationLevel } from '../../../constants'
import TextSymbol from '../../common/TextSymbol'
import {
  default as Form,
  FormItem,
  FormRow,
  FormColumn,
  FormDivider,
  FormButtonOk,
  FormButtonCancel,
} from './../../form'
import TextItem from './TextItem'
import './style.css'

const { IconHovered, names: IconNames } = components.icons

export default class TextForm extends React.Component {
  static propTypes = {
    canEdit: PropTypes.bool,
    coordinatesArray: PropTypes.any,
    subordinationLevel: PropTypes.number,
    transparentBackground: PropTypes.bool,
    displayAnchorLine: PropTypes.bool,
    anchorLineWithArrow: PropTypes.bool,
    magnification: PropTypes.number,
    texts: PropTypes.arrayOf(PropTypes.object),
    onChange: PropTypes.func,
    onClose: PropTypes.func,
  }

  constructor (props) {
    super(props)
    const {
      coordinatesArray,
      subordinationLevel = SubordinationLevel.TEAM_CREW,
      amplifiers: {
        transparentBackground = false,
        displayAnchorLine = false,
        anchorLineWithArrow = false,
        magnification = 1,
        texts = [ { text: '' } ],
      } = {},
    } = props

    this.state = {
      coordinatesArray,
      subordinationLevel,
      transparentBackground,
      displayAnchorLine,
      anchorLineWithArrow,
      magnification,
      texts: List(texts),
    }
  }

  changeSubordinationLevel = (value) => this.setState({ subordinationLevel: value })

  changeTransparentBackground = ({ target: { checked } }) => this.setState({ transparentBackground: checked })

  changeDisplayAnchorLine = ({ target: { checked } }) => this.setState({ displayAnchorLine: checked })

  changeAnchorLineWithArrow = ({ target: { checked } }) => this.setState({ anchorLineWithArrow: checked })

  changeMagnification = (value) => this.setState({ magnification: value })

  addTextHandler = () => {
    this.setState({ texts: this.state.texts.push({ text: '', underline: false }) })
  }

  changeTextItemHandler = (index, textItem) => {
    this.setState({ texts: this.state.texts.set(index, textItem) })
  }

  removeTextItemHandler = (index) => {
    if (this.state.texts.size <= 1) {
      return
    }
    this.setState({ texts: this.state.texts.delete(index) })
  }

  okHandler = () => {
    const {
      coordinatesArray,
      subordinationLevel,
      transparentBackground,
      displayAnchorLine,
      anchorLineWithArrow,
      magnification,
      texts,
    } = this.state
    this.props.onChange({
      coordinatesArray,
      subordinationLevel,
      amplifiers: {
        transparentBackground,
        displayAnchorLine,
        anchorLineWithArrow,
        magnification,
        texts: texts.toJS(),
      },
    })
  }

  cancelHandler = () => {
    this.props.onClose()
  }

  render () {
    const {
      subordinationLevel,
      texts,
    } = this.state

    const { canEdit } = this.props

    return (
      <Form className="text-form">
        <FormColumn label={i18n.SUBORDINATION_LEVEL}>
          <SubordinationLevelSelect
            readOnly={!canEdit}
            value={ subordinationLevel }
            onChange={this.changeSubordinationLevel}
          />
        </FormColumn>
        <FormItem className="text-form-preview">
          <TextSymbol texts={texts.toJS()}/>
        </FormItem>
        {canEdit && (<FormRow label={i18n.TEXT}>
          <IconHovered
            icon={IconNames.MAP_SCALE_PLUS_DEFAULT}
            hoverIcon={IconNames.MAP_SCALE_PLUS_HOVER}
            onClick={this.addTextHandler}
          />
        </FormRow>)}
        <FormDivider />
        <div className="text-form-scrollable">
          {texts.map((item, index) => (
            <TextItem
              key={index}
              {...item}
              index={index}
              readOnly={!canEdit}
              canRemove={texts.size > 1}
              onChange={this.changeTextItemHandler}
              onRemove={this.removeTextItemHandler}
            />
          ))}
        </div>
        <FormItem>
          {canEdit && (<FormButtonCancel onClick={this.cancelHandler}/>)}
          <FormButtonOk onClick={canEdit ? this.okHandler : this.cancelHandler}/>
        </FormItem>
      </Form>
    )
  }
}
