import React from 'react'
import { components } from '@C4/CommonComponents'
import TextSymbol from '../../common/TextSymbol'
import { Align } from '../../../constants'
import i18n from '../../../i18n'
import { MAX_LENGTH_TEXT } from '../../../constants/InputText'
import TextItem from './TextItem'

const { FormItem } = components.form
const { names: IconNames, IconHovered, IconButton } = components.icons

const PATH = [ 'attributes', 'texts' ]

const getTotalAlign = (texts) => {
  let totalAlign = null
  if (texts.size > 0) {
    totalAlign = texts.get(0).align || Align.LEFT
    if (texts.some(({ align }) => (align || Align.LEFT) !== totalAlign)) {
      totalAlign = null
    }
  }
  return totalAlign
}

const WithTexts = (Component) => class TextsComponent extends Component {
  addTextHandler = () => this.setResult((result) =>
    result.updateIn(PATH, (texts) =>
      texts.push({ text: '', underline: false, align: getTotalAlign(texts) || Align.CENTER }),
    ),
  )

  changeTextItemHandler = (index, textItem) => this.setResult((result) =>
    result.setIn([ ...PATH, index ], textItem),
  )

  previewTextItemHandler = (index, preview) => this.setResult((result) =>
    result.updateIn([ ...PATH, index ], (text) => ({ ...text, preview })),
  )

  changeTextsAlignHandler = (align) => this.setResult((result) =>
    result.updateIn(PATH, (texts) => texts.map((text) => ({ ...text, align }))),
  )

  removeTextItemHandler = (index) => this.setResult((result) =>
    result.updateIn(PATH, (texts) => texts.size <= 1 ? texts : texts.delete(index)),
  )

  renderTexts () {
    const texts = this.getResult().getIn(PATH)
    const totalAlign = getTotalAlign(texts)
    const canEdit = this.isCanEdit()

    return (
      <>
        <FormItem className="text-form-preview">
          <TextSymbol texts={texts.map((item) => item.preview ? item.preview : item).toJS()}/>
        </FormItem>
        {canEdit && (<FormItem className="text-form-controls">
          <div>{i18n.TEXT}</div>
          <div className='btn-container'>
            <IconButton
              value={Align.LEFT}
              checked={totalAlign === Align.LEFT}
              icon={IconNames.TEXT_ALIGN_LEFT_DEFAULT}
              onClick={this.changeTextsAlignHandler}
            />
            <IconButton
              value={Align.CENTER}
              checked={totalAlign === Align.CENTER}
              icon={IconNames.TEXT_ALIGN_CENTER_DEFAULT}
              onClick={this.changeTextsAlignHandler}
            />
            <IconButton
              value={Align.RIGHT}
              checked={totalAlign === Align.RIGHT}
              icon={IconNames.TEXT_ALIGN_RIGHT_DEFAULT}
              onClick={this.changeTextsAlignHandler}
            />
            <IconHovered
              icon={IconNames.MAP_SCALE_PLUS_DEFAULT}
              hoverIcon={IconNames.MAP_SCALE_PLUS_HOVER}
              onClick={this.addTextHandler}
            />
          </div>
        </FormItem>)}
        <div>
          {texts.map((item, index) => (
            <TextItem
              key={index}
              data={item}
              index={index}
              readOnly={!canEdit}
              maxLengthText={MAX_LENGTH_TEXT.TEXT_INSCRIPTION}
              canRemove={texts.size > 1}
              onChange={this.changeTextItemHandler}
              onPreview={this.previewTextItemHandler}
              onRemove={this.removeTextItemHandler}
            />
          ))}
        </div>
      </>
    )
  }
}

export default WithTexts
