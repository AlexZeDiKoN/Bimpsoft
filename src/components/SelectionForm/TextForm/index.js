import React from 'react'
import { Checkbox, InputNumber } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import { List } from 'immutable'
import PropTypes from 'prop-types'
import i18n from '../../../i18n'
import SubordinationLevelSelect from '../../SubordinationLevelSelect'
import { SubordinationLevel } from '../../../constants'
import { default as Form, FormRow, FormColumn } from './../../form'
import TextItem from './TextItem'

const { IconHovered, names: IconNames } = components.icons

export default class TextForm extends React.Component {
  static propTypes = {
    subordinationLevel: PropTypes.string,
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
      subordinationLevel = SubordinationLevel.TEAM_CREW,
      transparentBackground = false,
      displayAnchorLine = false,
      anchorLineWithArrow = false,
      magnification = 1,
      texts = [ { text: '' } ],
    } = props
    this.state = {
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
      subordinationLevel,
      transparentBackground,
      displayAnchorLine,
      anchorLineWithArrow,
      magnification,
      texts,
    } = this.state
    this.props.onChange({
      subordinationLevel,
      transparentBackground,
      displayAnchorLine,
      anchorLineWithArrow,
      magnification,
      texts: texts.toJS(),
    })
  }

  cancelHandler = () => {
    this.props.onClose()
  }

  render () {
    const {
      subordinationLevel,
      transparentBackground,
      displayAnchorLine,
      anchorLineWithArrow,
      magnification,
      texts,
    } = this.state
    return (
      <Form>
        <FormColumn label={i18n.SUBORDINATION_LEVEL}>
          <SubordinationLevelSelect value={ subordinationLevel } onChange={this.changeSubordinationLevel} />
        </FormColumn>
        <FormRow label={i18n.TEXT}>
          <IconHovered
            icon={IconNames.MAP_SCALE_PLUS_DEFAULT}
            hoverIcon={IconNames.MAP_SCALE_PLUS_HOVER}
            onClick={this.addTextHandler}
          />
        </FormRow>
        <FormRow>
          {texts.map((item, index) => (
            <TextItem
              key={index}
              {...item}
              index={index}
              canRemove={texts.size > 1}
              onChange={this.changeTextItemHandler}
              onRemove={this.removeTextItemHandler}
            />
          ))}
        </FormRow>
        <FormRow label={i18n.TRANSPARENT_BACKGROUND}>
          <Checkbox checked={transparentBackground} onChange={this.changeTransparentBackground}/>
        </FormRow>
        <FormRow label={i18n.DISPLAY_ANCHOR_LINE}>
          <Checkbox checked={displayAnchorLine} onChange={this.changeDisplayAnchorLine}/>
        </FormRow>
        <FormRow label={i18n.ANCHOR_LINE_WITH_ARROW}>
          <Checkbox checked={anchorLineWithArrow} onChange={this.changeAnchorLineWithArrow}/>
        </FormRow>
        <FormRow label={i18n.MAGNIFICATION}>
          <InputNumber value={magnification} onChange={this.changeMagnification}/>
        </FormRow>
        <FormRow>
          <button onClick={this.cancelHandler}>{i18n.CANCEL}</button>
          <button onClick={this.okHandler}>{i18n.OK}</button>
        </FormRow>
      </Form>
    )
  }
}
