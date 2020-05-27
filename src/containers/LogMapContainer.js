import { connect } from 'react-redux'
import LogMap from '../components/LogMap'
import { canEditSelector } from '../store/selectors'

const mapStateToProps = ({ webMap, orgStructures }) => {
  const undoRecords = webMap.get('undoRecords').toArray()
  const objects = webMap.get('objects')
  const undoPosition = webMap.get('undoPosition')

  const userEvents = undoRecords.map(({ changeType, id, timestamp }) => {
    // const record = objects.get(id)

    // const objectsWithUnit = objects.filter(({ unit }) => unit === id)

    // const unitId = webMap.objects[id].unit
    // objects.getIn([ 'objects', id ])
    // record.get('unit')
    // console.log('-------------------000', id)

    const objectById = objects.get(id)

    let objFullName = ''
    if (objectById) {
      const unitId = objectById.get('unit')
      // console.log('-------------------111', unitId)
      const unit = orgStructures.unitsById[unitId]
      // console.log('-------------------222', unit)
      objFullName = unit ? unit.fullName : ''
    }

    // console.log('-------------------8888', objects.get(id))

    // const unitId = objects.get('1000000000101823').get('unit')

    // const objFullName = orgStructures.unitsById[unitId].fullName

    const event = `${changeType} ${objFullName}`
    // console.log('-------------------8888', event, undoPosition, undoRecords.length)

    return {
      event,
      timestamp,
    }
  })

  console.log('------------------>>>>>', userEvents)

  return {
    userEvents: 1, // canEditSelector(state),
  }
}

const LogMapContainer = connect(
  mapStateToProps,
)(LogMap)

export default LogMapContainer
