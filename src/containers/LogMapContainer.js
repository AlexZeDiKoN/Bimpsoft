import { connect } from 'react-redux'
import LogMap from '../components/LogMap'
import { canEditSelector } from '../store/selectors'

const mapStateToProps = ({ webMap, orgStructures }) => {
  const undoRecords = webMap.get('undoRecords').toArray()
  const objects = webMap.get('objects')

  const userEvents = undoRecords.map(({ changeType, id }) => {
    // const record = objects.get(id)

    // const objectsWithUnit = objects.filter(({ unit }) => unit === id)

    // const unitId = webMap.objects[id].unit
    // objects.getIn([ 'objects', id ])
    // record.get('unit')
    const objectById = objects.get(id)

    let objFullName = ''
    if (objectById) {
      const unitId = objectById.get('unit')
      const unit = orgStructures.unitsById[unitId]
      objFullName = unit ? unit.fullName : ''
    }

    // console.log('-------------------8888', objects.get(id))

    // const unitId = objects.get('1000000000101823').get('unit')

    // const objFullName = orgStructures.unitsById[unitId].fullName

    const event = `${changeType} ${objFullName}`
    console.log('-------------------8888', event)

    return {

    }
  })

  return {
    userEvents: 1, // canEditSelector(state),
  }
}

const LogMapContainer = connect(
  mapStateToProps,
)(LogMap)

export default LogMapContainer
