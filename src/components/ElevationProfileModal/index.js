import React from 'react'
import { Modal, Checkbox } from 'antd'
import * as R from 'ramda'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import i18n from '../../i18n'
import NivoLine from '../NivoLine'
import { catchErrors } from '../../store/actions/asyncAction'
import { setStraightLineState, setShowModalState } from '../../store/actions/elevationProfile'
import { getElProfileDataWithStraightLine, getStraightLineState, getShowModalState } from '../../store/selectors'

const ElevationProfileModal = ({
  elProfileData,
  showStraightLine,
  onChangeStraightLineState,
  isModalOpen,
  closeModal,
}) => {
  const points = R.pathOr([], [ 'points' ], elProfileData)
  const straightLine = R.pathOr([], [ 'straightLine' ], elProfileData)

  return <Modal
    title={i18n.ELEVATION_PROFILE}
    visible={isModalOpen}
    width="75%"
    onCancel={closeModal}
    footer={null}
  >
    <NivoLine
      data={[
        {
          id: i18n.HEIGHT,
          data: points,
        },
        {
          id: i18n.DIRECT_VISIBILITY,
          data: straightLine,
        },
      ]}
      leftAxisName={i18n.HEIGHT_2}
      bottomAxisName={i18n.PATH_LENGTH}
    />
    <Checkbox
      onChange={onChangeStraightLineState}
      checked={showStraightLine}
    >
      {i18n.DIRECT_VISIBILITY}
    </Checkbox>
  </Modal>
}

ElevationProfileModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  onChangeStraightLineState: PropTypes.func.isRequired,
  isModalOpen: PropTypes.bool,
  showStraightLine: PropTypes.bool,
  elProfileData: PropTypes.object.isRequired,
}

ElevationProfileModal.defaultProps = {
  isModalOpen: false,
  showStraightLine: false,
}

const mapStateToProps = (store) => {
  return {
    elProfileData: getElProfileDataWithStraightLine(store),
    showStraightLine: getStraightLineState(store),
    isModalOpen: getShowModalState(store),
  }
}

const mapDispatchToProps = {
  onChangeStraightLineState: ({ target: { checked } }) => async (dispatch) => {
    await dispatch(setStraightLineState(checked))
  },
  closeModal: () => (dispatch) => {
    return dispatch(setShowModalState(false))
  },
}

export default connect(
  mapStateToProps,
  catchErrors(mapDispatchToProps),
)(ElevationProfileModal)
