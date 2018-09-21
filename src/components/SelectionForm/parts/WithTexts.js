import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { List } from 'immutable'
import { components } from '@DZVIN/CommonComponents'
import TextSymbol from '../../common/TextSymbol'
import { Align } from '../../../constants'
import i18n from '../../../i18n'
import IconButton from '../../menu/IconButton'
import TextItem from './TextItem'

const { FormItem, FormDivider } = components.form
const { icons: { names: IconNames, IconHovered } } = components

const WithTexts = (Component) => class TextsComponent extends Component {
  static propTypes = {
    texts: PropTypes.arrayOf(PropTypes.object),
  }

  constructor (props) {
    super(props)
    let { amplifiers: { texts } = {} } = props
    if (!texts) {
      texts = [ { text: '' } ]
    }
    this.state.texts = List(texts)
  }

  addTextHandler = () => this.setState((state) => ({ texts: state.texts.push({ text: '', underline: false }) }))

  changeTextItemHandler = (index, textItem) => this.setState((state) => ({ texts: state.texts.set(index, textItem) }))

  changeTextsAlignHandler = (align) => this.setState((state) => {
    const texts = state.texts.map((text) => ({ ...text, align }))
    return { texts }
  })

  removeTextItemHandler = (index) => this.setState((state) => {
    const { texts } = state
    return texts.size <= 1 ? null : { texts: texts.delete(index) }
  })

  fillResult (result) {
    super.fillResult(result)
    if (!result.hasOwnProperty('amplifiers')) {
      result.amplifiers = {}
    }
    result.amplifiers.texts = this.state.texts.toJS()
  }

  getErrors () {
    const errors = super.getErrors()
    for (const text of this.state.texts) {
      if (text && text.text && text.text.length) {
        return errors
      }
    }
    errors.push(i18n.EMPTY_TEXT)
    return errors
  }

  renderTexts () {
    const { texts } = this.state

    const align = texts.get(0).align || Align.LEFT

    const canEdit = this.isCanEdit()

    return (
      <Fragment>
        <FormItem className="text-form-preview">
          <TextSymbol texts={texts.toJS()}/>
        </FormItem>
        {canEdit && (<FormItem className="text-form-controls">
          <label>{i18n.TEXT}</label>
          <IconButton
            value={Align.LEFT}
            checked={align === Align.LEFT}
            icon={IconNames.TEXT_ALIGN_LEFT_DEFAULT}
            hoverIcon={IconNames.TEXT_ALIGN_LEFT_HOVER}
            onClick={this.changeTextsAlignHandler}
          />
          <IconButton
            value={Align.CENTER}
            checked={align === Align.CENTER}
            icon={IconNames.TEXT_ALIGN_CENTER_DEFAULT}
            hoverIcon={IconNames.TEXT_ALIGN_CENTER_HOVER}
            onClick={this.changeTextsAlignHandler}
          />
          <IconButton
            value={Align.RIGHT}
            checked={align === Align.RIGHT}
            icon={IconNames.TEXT_ALIGN_RIGHT_DEFAULT}
            hoverIcon={IconNames.TEXT_ALIGN_RIGHT_HOVER}
            onClick={this.changeTextsAlignHandler}
          />
          <IconHovered
            icon={IconNames.MAP_SCALE_PLUS_DEFAULT}
            hoverIcon={IconNames.MAP_SCALE_PLUS_HOVER}
            onClick={this.addTextHandler}
          />
        </FormItem>)}
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
      </Fragment>
    )
  }
}

export default WithTexts
