import { connect } from 'react-redux'
import LogMap from '../components/LogMap'
import { canEditSelector } from '../store/selectors'
import { changeTypes } from '../store/actions/webMap'
import i18n from '../i18n'

const getChangeTypeKey = (event) => {
  for (const key in changeTypes) {
    if (changeTypes.hasOwnProperty(key)) {
      if (event === changeTypes[key]) {
        return key
      }
    }
  }
  return null
}

const mapStateToProps = ({ webMap, orgStructures }) => {
  const undoRecords = webMap.get('undoRecords').toArray()
  const objects = webMap.get('objects')
  const undoPosition = webMap.get('undoPosition')

  // if (orgStructures.unitsById) {
  //   console.log('-------------------', orgStructures.unitsById['1000000000017836'])
  //
  // } else {
  //   console.log('-------------------', 'EMPTY')
  // }

  const userEvents = undoRecords.filter((_, index) => index < undoPosition).map(({ changeType, id, timestamp }) => {
    const objectById = objects.get(id)

    let objFullName = ''
    if (objectById && orgStructures.unitsById) {
      const unitId = objectById.get('unit')
      const unit = orgStructures.unitsById[unitId]

      objFullName = unit ? unit.fullName : ''
    }

    const eventNameKey = getChangeTypeKey(changeType)

    const event = `${i18n[eventNameKey]} ${objFullName}`

    return {
      event,
      timestamp,
    }
  })

  console.log('------------------>>>>>', userEvents)

  userEvents.push({
    event: 'hgjkghjh hjgjkhghj jhgjhgjh hgjkgkjhgjg hjgjkhgkgh hgjkhg',
    timestamp: Date.now(),
  })

  return {
    userEvents,
  }
}

const LogMapContainer = connect(
  mapStateToProps,
)(LogMap)

export default LogMapContainer
