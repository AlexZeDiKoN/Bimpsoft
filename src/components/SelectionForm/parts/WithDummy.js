import React from 'react'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'

const { FormRow } = components.form

export const PATH = [ 'attributes', 'params' ]

const WithDummy = (Component) => class DummyComponent extends Component {
  dummyChangeHandler = (evn) => this.setResult((result) => result.updateIn(PATH, (params) => {
    return { ...params, dummy: evn.target.checked }
  }))

  renderDummy () {
    const params = this.getResult().getIn(PATH)
    const dummy = params.dummy ?? false
    const isReadOnly = !this.isCanEdit()
    return (
      <FormRow label='.'>
        <div className='minefield-checkbox'>
          <label>
            <input
              type="checkbox"
              readOnly={isReadOnly}
              checked={dummy}
              disabled={isReadOnly}
              onChange={this.dummyChangeHandler}/>
            {i18n.DUMMY}
          </label>
        </div>
      </FormRow>
    )
  }
}

export default WithDummy
