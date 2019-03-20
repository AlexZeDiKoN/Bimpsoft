import React from 'react'
import PropTypes from 'prop-types'
import { components, utils } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'

const { InputWithSuffix, FormRow } = components.form
const { Coordinates } = utils

export default class CoordinateRow extends React.Component {
  static propTypes = {
    index: PropTypes.number,
    label: PropTypes.string,
    coordinate: PropTypes.object,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    readOnly: PropTypes.bool,
  }

  changeHandler = (value) => {
    const { onChange, index } = this.props
    onChange && onChange(index, Coordinates.parse(value))
  }

  onBlurHandler = () => {
    const { onBlur, index } = this.props
    onBlur && onBlur(index)
  }

  onFocusHandler = () => {
    const { onFocus, index } = this.props
    onFocus && onFocus(index)
  }

  render () {
    const { coordinate = {}, index, label, readOnly } = this.props
    const isWrong = Coordinates.isWrong(coordinate)
    const suffix = isWrong ? i18n.ERROR : Coordinates.getName(coordinate)
    return (
      <FormRow label={label || i18n.NODAL_POINT_INDEX(index + 1)}>
        <InputWithSuffix
          value={Coordinates.stringify(coordinate)}
          onChange={this.changeHandler}
          isWrong={isWrong}
          suffix={suffix}
          onBlur={this.onBlurHandler}
          onFocus={this.onFocusHandler}
          readOnly={readOnly}
        />
      </FormRow>
    )
  }
}
