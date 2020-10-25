import React, { useEffect } from 'react'
import { Modal, Checkbox } from 'antd'
import * as R from "ramda";
import i18n from '../../i18n'
import NivoLine from "../NivoLine";
import {connect} from "react-redux";
import {catchErrors} from "../../store/actions/asyncAction";
import { getElevationProfile, setStraightLineState, setShowModalState, clearElevationProfile } from "../../store/actions/elevationProfile";
import { getElProfileDataWithStraightLine, getStraightLineState, getShowModalState } from "../../store/selectors";

const ElevationProfileModal = ({
   getElevationProfile,
   elProfileData,
   showStraightLine,
   onChangeStraightLineState,
   isModalOpen,
   closeModal,
   // clearState,
 }) => {
  useEffect(() => {
    getElevationProfile()
    // return clearState
  }, [ getElevationProfile ])

  const points = R.pathOr([], ['points'], elProfileData)
  const straightLine = R.pathOr([], ['straightLine'], elProfileData)

  return <Modal
    title={i18n.ELEVATION_PROFILE}
    visible={isModalOpen}
    width={900}
    onCancel={closeModal}
    footer={null}
    // destroyOnClose={true}
  >
    <NivoLine
      data={[
        {
          id: i18n.HEIGHT,
          data: points
        },
        {
          id: i18n.DIRECT_VISIBILITY,
          data: straightLine
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

const mapStateToProps = (store) => {

  return {
    elProfileData: getElProfileDataWithStraightLine(store),
    showStraightLine: getStraightLineState(store),
    isModalOpen: getShowModalState(store),
  }
}

const mapDispatchToProps = {
  getElevationProfile: () => async (dispatch) => {
      await dispatch(getElevationProfile())
  },
  onChangeStraightLineState: ({ target: { checked } }) => async (dispatch) => {
    await dispatch(setStraightLineState(checked))
  },
  closeModal: () => async (dispatch) => {
    await dispatch(setShowModalState(false))
  },

  clearState: () => async (dispatch) => {
    debugger
    await dispatch(clearElevationProfile())
  },
}

export default connect(
  mapStateToProps,
  catchErrors(mapDispatchToProps),
)(ElevationProfileModal)
