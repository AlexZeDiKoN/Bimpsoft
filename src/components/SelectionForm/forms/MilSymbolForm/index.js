import {
  WithMilSymbol,
  WithCatalogsFields,
} from '../../parts'
import AbstractShapeForm, { propTypes as abstractShapeFormPropTypes } from '../../parts/AbstractShapeForm'

class MilSymbolForm extends WithMilSymbol(AbstractShapeForm) {
  static propTypes = abstractShapeFormPropTypes

  renderContent () {
    return this.renderMilSymbol()
  }
}

const MilSymbolFormWithDecorator = WithCatalogsFields(MilSymbolForm)

export default MilSymbolFormWithDecorator
