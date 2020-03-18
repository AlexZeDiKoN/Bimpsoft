import { Input, Select, Modal } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import { catchErrors } from '../../../../../store/actions/asyncAction'
import { march } from '../../../../../store/actions'
const { confirm } = Modal

const mapStateToProps = ({ march: { indicators } }) => ({
  MB001: indicators && indicators['МШВ001'],
  MB007: indicators && indicators['МШВ007'],
})

const mapDispatchToProps = {
  editFormField: march.editFormField,
}

const PopupPanel = (props) => {
  const { MB001: { typeValues: typeMB001 = [] }, MB007: { typeValues: typeMB007 = [] }, editFormField, propData } = props
  const { deleteSegment, id: segmentId, segmentType, required, terrain, velocity } = propData
  const typeNameById = (typeValues, type) => typeValues.find(({ id }) => id === type)

  const showDeleteConfirm = () => {
    confirm({
      title: 'Ви впевнені що хочете видалити даний сегмент?',
      okText: 'Так',
      okType: 'danger',
      cancelText: 'Ні',
      onOk () {
      },
    })
  }

  return <div className={'march-popup-form2'}>
    <Select
      className={''}
      defaultValue={typeNameById(typeMB001, segmentType).name}
      onChange={(value) => {}}
    >
      {typeMB001.map(({ id, name }) => (<Select.Option key={id} value={id}>{name}</Select.Option>))}
    </Select>

    <Select
      className={''}
      defaultValue={typeNameById(typeMB007, terrain).name}
      onChange={(value) => {}}
    >
      {typeMB007.map(({ id, name }) => (<Select.Option key={id} value={id}>{name}</Select.Option>))}
    </Select>

    <div className={'speedBlock'}>
      <span>Середня швидкість (км/год): </span>  <Input maxLength={10} style={{ width: '60px' }}/>
    </div>
    <div><span>Довжина ділянки: </span> {350} км</div>
    <div className={'bottomPanel'}>
      <div><span>Час проходження: </span> {6} км</div>
      { !required && <div onClick={() => showDeleteConfirm(propData)} className={'deleteSegment'} />}
    </div>
  </div>
}

export default connect(mapStateToProps, catchErrors(mapDispatchToProps))(PopupPanel)
