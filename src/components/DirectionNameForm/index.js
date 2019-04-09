import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Row, Input, Button } from 'antd'
import FocusTrap from 'react-focus-lock'
// import i18n from "../../../i18n"

export default function DirectionNameForm (props) {
  const { visible, onClose, onSubmit, index, defaultName, wrapper: Wrapper } = props
  const [ directionName, setDirectionName ] = useState('')
  useEffect(() => {
    visible && defaultName && setDirectionName(defaultName)
  }, [ index ])

  const handleChange = ({ target: { value } }) => setDirectionName(value)

  const handleSubmit = () => {
    onSubmit(directionName)
    onClose()
  }

  return visible && (
    <Wrapper title={'DIRECTION NAME'} onClose={onClose}>
      <FocusTrap>
        <Row>
          <Input value={directionName} onChange={handleChange} />
        </Row>
        <Row>
          <Button onClick={onClose}>
            CANCEL
          </Button>
          <Button onClick={handleSubmit}>
            SAVE
          </Button>
        </Row>
      </FocusTrap>
    </Wrapper>
  )
}

DirectionNameForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  index: PropTypes.number,
  layerId: PropTypes.string,
  visible: PropTypes.bool.isRequired,
  defaultName: PropTypes.string,
  wrapper: PropTypes.any,
}
