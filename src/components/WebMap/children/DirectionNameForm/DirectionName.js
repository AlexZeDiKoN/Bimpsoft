import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Row, Input, Button } from 'antd'
import ModalContainer from '../../../common/ModalContainer/index'
// import i18n from "../../../i18n"

export default function DirectionNameForm (props) {
  const { onClose, onSubmit, id, namesList } = props
  const [ directionName, setDirectionName ] = useState('')
  const hasId = id || id === 0
  useEffect(() => {
    hasId && setDirectionName(namesList.get(id))
  }, [ id ])

  const handleChange = ({ target: { value } }) => setDirectionName(value)

  const handleSubmit = () => {
    onSubmit({ name: directionName, id })
    onClose()
  }

  return hasId && (
    <ModalContainer title={'DIRECTION NAME'} onClose={props.onClose}>
      <>
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
      </>
    </ModalContainer>
  )
}

DirectionNameForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  id: PropTypes.any,
  namesList: PropTypes.object,
}
