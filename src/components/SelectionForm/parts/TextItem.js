import React from 'react'
import PropTypes from 'prop-types'
import { Input } from 'antd'
import { components } from '@C4/CommonComponents'
import FontSizePicker from '../../common/FontSizePicker'

const { IconHovered, names: IconNames } = components.icons

export default class TextItem extends React.Component {
  static propTypes = {
    readOnly: PropTypes.bool,
    index: PropTypes.number,
    maxLengthText: PropTypes.number,
    data: PropTypes.shape({
      text: PropTypes.string,
      underline: PropTypes.bool,
      bold: PropTypes.bool,
      size: PropTypes.number,
      align: PropTypes.string,
      preview: PropTypes.object,
    }),
    canRemove: PropTypes.bool,
    onChange: PropTypes.func,
    onPreview: PropTypes.func,
    onRemove: PropTypes.func,
  }

  textChangeHandler = ({ target: { value } }) => {
    const { onChange, index, data: { underline, bold, size, align } } = this.props
    onChange(index, { text: value, underline, bold, size, align })
  }

  underlineClickHandler = () => {
    const { onChange, index, data: { text, underline, bold, size, align } } = this.props
    onChange(index, { text, underline: !underline, bold, size, align })
  }

  boldClickHandler = () => {
    const { onChange, index, data: { text, underline, bold, size, align } } = this.props
    onChange(index, { text, underline, bold: !bold, size, align })
  }

  changeFontSizeHandler = (size) => {
    const { onChange, index, data: { text, underline, bold, align } } = this.props
    onChange(index, { text, underline, bold, size, align })
  }

  previewFontSizeHandler = (size) => {
    const { onPreview, index, data: { text, underline, bold, align } } = this.props
    onPreview(index, size === null ? null : { text, underline, bold: bold, size, align })
  }

  removeClickHandler = () => {
    const { onRemove, index } = this.props
    onRemove(index)
  }

  render () {
    const {
      data: { text, underline, bold = false, size = 12, preview },
      canRemove,
      readOnly,
      maxLengthText } = this.props
    return (
      <div className='text-item-container'>
        <Input
          value={text}
          maxLength={maxLengthText}
          onChange={readOnly ? null : this.textChangeHandler}
          readOnly={readOnly}
        />
        <div className={'icons'}>
          {!readOnly && (<IconHovered
            icon={underline ? IconNames.U_ACTIVE : IconNames.U_DEFAULT}
            hoverIcon={IconNames.U_HOVER}
            onClick={this.underlineClickHandler}
          />)}
          {!readOnly && (<IconHovered
            icon={bold ? IconNames.B_ACTIVE : IconNames.B_DEFAULT}
            hoverIcon={IconNames.B_HOVER}
            onClick={this.boldClickHandler}
          />)}
          {!readOnly && (<FontSizePicker
            fontSize={ preview ? preview.size : size }
            onChange={this.changeFontSizeHandler}
            onPreview={this.previewFontSizeHandler}
          />)}
          {!readOnly && (<IconHovered
            icon={canRemove ? IconNames.EMPTY_DEFAULT : IconNames.EMPTY_DISABLE}
            hoverIcon={canRemove ? IconNames.EMPTY_HOVER : IconNames.EMPTY_DISABLE}
            onClick={this.removeClickHandler}
          />)}
        </div>
      </div>
    )
  }
}
