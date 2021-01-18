import { MapModes } from '../../constants'

export const taskModeSelector = (state) => state.webMap.mode === MapModes.TASK

export const getModalData = (state) => state?.task?.modalData
