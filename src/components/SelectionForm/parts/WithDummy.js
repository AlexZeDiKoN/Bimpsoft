import React from 'react'
import { Checkbox } from 'antd'
import { components } from '@C4/CommonComponents'
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
      <FormRow label="&nbsp;">
        <div className='minefield-checkbox'>
          <Checkbox
            readOnly={isReadOnly}
            checked={dummy}
            disabled={isReadOnly}
            onChange={this.dummyChangeHandler}/>
          <div>{i18n.DUMMY}</div>
        </div>
      </FormRow>
    )
  }
}

export default WithDummy
