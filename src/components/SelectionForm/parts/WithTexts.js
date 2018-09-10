import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { List } from 'immutable'
import { components } from '@DZVIN/CommonComponents'
import TextSymbol from '../../common/TextSymbol'
import i18n from '../../../i18n'
import TextItem from './TextItem'

const { FormRow, FormItem, FormDivider } = components.form
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

    const canEdit = this.isCanEdit()

    return (
      <Fragment>
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
      </Fragment>
    )
  }
}

export default WithTexts
