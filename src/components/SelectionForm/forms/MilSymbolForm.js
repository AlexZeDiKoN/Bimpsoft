import {
  AbstractShapeForm,
  WithMilSymbol,
} from '../parts'

export default class MilSymbolForm extends WithMilSymbol(AbstractShapeForm) {
  static propTypes = AbstractShapeForm.propTypes

  renderContent () {
    return this.renderMilSymbol()
  }
}
