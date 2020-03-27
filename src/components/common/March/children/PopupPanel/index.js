import React from 'react'
import PropTypes from 'prop-types'
import { Input, Select, Modal } from 'antd'
import { connect } from 'react-redux'
import { catchErrors } from '../../../../../store/actions/asyncAction'
import { march } from '../../../../../store/actions'
import { isNumberSymbols } from '../../../../../utils/validation/number'
const { confirm } = Modal

const mapStateToProps = ({ march: { indicators } }) => ({
  MB001: (indicators && indicators['МШВ001']) || {},
  MB007: (indicators && indicators['МШВ007']) || {},
})

const mapDispatchToProps = {
  editFormField: march.editFormField,
}

const nameTypeById = (typeValues, type) => typeValues.find(({ id }) => id === type) || ''

const PopupPanel = (props) => {
  const { MB001: { typeValues: MB001 = [] }, MB007: { typeValues: MB007 = [] }, editFormField, propData } = props
  const { deleteSegment, segmentId, segmentType, required, terrain, velocity } = propData

  const onEditFormField = (fieldName) => (id) => editFormField({
    segmentId,
    fieldName,
    val: id,
  })

  const onChangeVelocity = (e) => {
    const { value } = e.target
    const numberVal = value ? (isNumberSymbols(value) && value) || velocity : ''

    onEditFormField('velocity')(+numberVal)
  }

  const showDeleteConfirm = () => {
    confirm({
      title: 'Ви впевнені що хочете видалити даний сегмент?',
      okText: 'Так',
      okType: 'danger',
      cancelText: 'Ні',
      onOk () {
        deleteSegment(segmentId)
      },
    })
  }

  return <div className={'march-popup-form'}>
    <Select
      defaultValue={nameTypeById(MB001, segmentType).name}
      onChange={onEditFormField('segmentType')}
    >
      {MB001.map(({ id, name }) => (<Select.Option key={id} value={id}>{name}</Select.Option>))}
    </Select>

    {(segmentType === 41) &&
      <Select
        className={''}
        defaultValue={nameTypeById(MB007, terrain).name}
        onChange={onEditFormField('terrain')}
      >
        {MB007.map(({ id, name }) => (<Select.Option key={id} value={id}>{name}</Select.Option>))}
      </Select>
    }

    <div className={'speed-block'}>
      <span>Середня швидкість (км/год): </span>
      <Input onChange={onChangeVelocity} value={velocity} maxLength={10} style={{ width: '60px' }}/>
    </div>
    <div><span>Довжина ділянки: </span> {350} км</div>
    <div className={'bottom-panel'}>
      <div><span>Час проходження: </span> {6} км</div>
      { !required && <div onClick={() => showDeleteConfirm(propData)} className={'delete-segment'} />}
    </div>
  </div>
}

PopupPanel.propTypes = {
  propData: PropTypes.shape({
    deleteSegment: PropTypes.func.isRequired,
    id: PropTypes.number.isRequired,
    required: PropTypes.bool.isRequired,
    segmentType: PropTypes.number.isRequired,
    terrain: PropTypes.number.isRequired,
    velocity: PropTypes.number.isRequired,
    segmentId: PropTypes.number.isRequired,
  }).isRequired,
  MB001: PropTypes.shape({
    typeValues: PropTypes.array.isRequired,
  }).isRequired,
  MB007: PropTypes.shape({
    typeValues: PropTypes.array.isRequired,
  }).isRequired,
  editFormField: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, catchErrors(mapDispatchToProps))(PopupPanel)
