import React from 'react'
import { Checkbox } from 'antd'
import i18n from '../../../i18n'

// import './WithIntermediateAmplifiers.css'
import { NAME_OF_AMPLIFIERS } from './WithIntermediateAmplifiers'

const intermediateArray = [ i18n.AMP_LEFT, i18n.AMP_TOP, i18n.AMP_RIGHT, i18n.AMP_BOTTOM ]
const SHOWN_INTERMEDIATE_AMPLIFIERS_PATH = [ 'attributes', 'shownIntermediateAmplifiers' ]

const WithIntermediateAmplifiersTune = (Component) => class IntermediateAmplifiersTuneComponent extends Component {
  setAmplifierShowerHandler = (path, index) => () => this.setResult((result) =>
    result.updateIn(path, (showedSet) =>
      showedSet.has(index) ? showedSet.delete(index) : showedSet.add(index),
    ),
  )

  renderIntermediateAmplifiersTune () {
    const formStore = this.getResult()
    const canEdit = this.isCanEdit()
    const shownIntermediateAmplifiersSet = formStore.getIn(SHOWN_INTERMEDIATE_AMPLIFIERS_PATH)
    return (
      <table className="tune_intermediate_table">
        <tbody>
          {intermediateArray.map((name, index) => (
            <tr key={index}>
              <td>
                {name}
              </td>
              <td>
                <div className="icon-option">
                  <Checkbox
                    disabled={!canEdit}
                    name={NAME_OF_AMPLIFIERS}
                    onChange={this.setAmplifierShowerHandler(SHOWN_INTERMEDIATE_AMPLIFIERS_PATH, index)}
                    checked={shownIntermediateAmplifiersSet.has(index)}
                  />
                  <span>&nbsp;&laquo;{NAME_OF_AMPLIFIERS}&raquo;</span>
                </div>
              </td>
            </tr>
          ))
          }
        </tbody>
      </table>
    )
  }
}

export default WithIntermediateAmplifiersTune
