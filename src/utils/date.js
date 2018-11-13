import moment from 'moment/moment'

export const inDateRange = (dateFor, timelineFrom, timelineTo) => (
  (timelineFrom ? moment(dateFor).isAfter(timelineFrom) : true) &&
  (timelineTo ? moment(dateFor).isBefore(timelineTo) : true)
)
