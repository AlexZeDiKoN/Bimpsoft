import React from 'react'
import PropTypes from 'prop-types'
import { Input, InputNumber, Select, Tooltip } from 'antd'
import { connect } from 'react-redux'
import { catchErrors } from '../../../../../store/actions/asyncAction'
import { march } from '../../../../../store/actions'
import convertUnits from '../../utilsMarch/convertUnits'
import i18n from '../../../../../i18n'
import { MARCH_TYPES } from '../../../../../constants/March'

const { OWN_RESOURCES } = MARCH_TYPES

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
  const {
    segmentId,
    segmentType,
    required,
    terrain,
    velocity,
    metric,
    toggleDeleteMarchPointModal,
    readOnly,
  } = propData
  const { time } = metric
  const distance = metric.distance.toFixed(1)

  const onEditFormField = (fieldName) => (id) => editFormField({
    segmentId,
    fieldName,
    val: id,
  })

  const onChangeVelocity = (value) => {
    onEditFormField('velocity')(+value)
  }

  const showDeleteConfirm = () => {
    toggleDeleteMarchPointModal(true, segmentId)
  }

  const correctedMB001 = MB001.slice(0, -1)

  const typeOfMove = nameTypeById(correctedMB001, segmentType).name

  return <div className={'march-popup-form'}>
    <Tooltip placement='left' title={i18n.TYPE_OF_MOVE}>
      {segmentId === 0
        ? <Input
          value={typeOfMove}
          disabled={readOnly}
        />
        : <Select
          defaultValue={typeOfMove}
          onChange={onEditFormField('type')}
          disabled={readOnly}
        >
          {correctedMB001.map(({ id, name }) => (<Select.Option key={id} value={id}>{name}</Select.Option>))}
        </Select>
      }
    </Tooltip>
    {(segmentType === OWN_RESOURCES) &&
    <Tooltip placement='left' title={i18n.NATURE_OF_TERRAIN}>
      <Select
        defaultValue={nameTypeById(MB007, terrain).name}
        onChange={onEditFormField('terrain')}
        disabled={readOnly}
      >
        {MB007.map(({ id, name }) => (<Select.Option key={id} value={id}>{name}</Select.Option>))}
      </Select>
    </Tooltip>
    }

    <div className={'speed-block'}>
      <span>{i18n.AVERAGE_SPEED}: </span>
      <InputNumber
        min={0}
        onChange={onChangeVelocity}
        value={velocity}
        maxLength={10}
        className={'velocity-input'}
        disabled={readOnly}
      />
    </div>
    <div><span>{i18n.LENGTH_OF_SEGMENT}: </span> {distance} км</div>
    <div className={'bottom-panel'}>
      <div><span>{i18n.TIME_OF_PASSING}: </span> {convertUnits.msToTime(time)}</div>
      { !required &&
      <Tooltip placement='topRight' title={i18n.DELETE_SEGMENT} align={ { offset: [ 12, 0 ] }}>
        <div
          onClick={(e) => { !readOnly && showDeleteConfirm(e) }}
          className={`delete-segment ${readOnly ? 'march-disabled-element' : ''}`} />
      </Tooltip>
      }
    </div>
  </div>
}

PopupPanel.propTypes = {
  propData: PropTypes.shape({
    required: PropTypes.bool.isRequired,
    segmentType: PropTypes.number.isRequired,
    terrain: PropTypes.number.isRequired,
    velocity: PropTypes.number.isRequired,
    segmentId: PropTypes.number.isRequired,
    metric: PropTypes.shape({
      time: PropTypes.number.isRequired,
      distance: PropTypes.number.isRequired,
    }).isRequired,
    toggleDeleteMarchPointModal: PropTypes.func.isRequired,
    readOnly: PropTypes.bool.isRequired,
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
