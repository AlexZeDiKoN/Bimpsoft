import {
  WithMilSymbol,
} from '../../parts'
import AbstractShapeForm, { propTypes as abstractShapeFormPropTypes } from '../../parts/AbstractShapeForm'

export default class MilSymbolForm extends WithMilSymbol(AbstractShapeForm) {
  static propTypes = abstractShapeFormPropTypes

  constructor (props) {
    super(props)
    !props.ovtLoaded && props.getOvtList()
  }

  renderContent () {
    return this.renderMilSymbol()
  }
}
