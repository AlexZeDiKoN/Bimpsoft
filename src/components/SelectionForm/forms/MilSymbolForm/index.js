import {
  WithMilSymbol,
} from '../../parts'
import AbstractShapeForm, { propTypes as abstractShapeFormPropTypes } from '../../parts/AbstractShapeForm'

export default class MilSymbolForm extends WithMilSymbol(AbstractShapeForm) {
  static propTypes = abstractShapeFormPropTypes

  renderContent () {
    return this.renderMilSymbol()
  }
}
