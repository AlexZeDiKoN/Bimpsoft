import React, { useState } from 'react'
import { connect } from 'react-redux'
import { IButton, IconNames, ButtonTypes, Trigger } from '@DZVIN/CommonComponents'
import { Button, Input, Select } from 'antd'
import { march } from '../../../../../store/actions'
import { catchErrors } from '../../../../../store/actions/asyncAction'

const mapStateToProps = ({ march: { indicators } }) => ({
  MB001: indicators && indicators['МШВ001'],
  MB007: indicators && indicators['МШВ007'],
})

const mapDispatchToProps = {
  editFormField: march.editFormField,
}

const SegmentButtonForm = (props) => {
  const [ popupVisible, setVisible ] = useState(false)
  const { deleteSegment, segmentId, segmentType, editFormField, required, terrain, velocity, MB001, MB007 } = props

  return <Trigger
    modalMode
    onClickOutside={() => {
      setVisible(false)
    }}
    popupVisible={popupVisible || false}
    popup={
      <div className={'march-popup-form'}>
        <Select value={segmentType} onChange={(id) => editFormField({
          segmentId,
          fieldName: 'segmentType',
          val: id,
        })}>
          {MB001 && MB001.typeValues.map(({ id, name }) => <Select.Option key={id} value={id}>{name}</Select.Option>)}
        </Select>
        <Select value={terrain} onChange={(id) => editFormField({
          segmentId,
          fieldName: 'terrain',
          val: id,
        })}>
          {MB007 && MB007.typeValues.map(({ id, name }) => <Select.Option key={id} value={id}>{name}</Select.Option>)}
        </Select>
        <Input value={velocity} onChange={(e) => editFormField({
          segmentId,
          fieldName: 'velocity',
          val: e.target.value,
        })}/>
        {(!required) && <Button onClick={() => {
          deleteSegment(segmentId)
          setVisible(false)
        }}>Delete</Button>}
      </div>
    }
  >
    <IButton icon={IconNames.ARCHIVE} type={ButtonTypes.WITH_BG} onClick={() => setVisible(!popupVisible)} />
  </Trigger>
}

const connectedSegmentButtonForm = connect(
  mapStateToProps,
  catchErrors(mapDispatchToProps),
)(SegmentButtonForm)

export default connectedSegmentButtonForm
