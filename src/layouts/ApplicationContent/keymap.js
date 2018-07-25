import {
  ADD_POLYLINE, ADD_POLYGON, ADD_CURVED_POLYLINE, ADD_CURVED_POLYGON, ADD_POINT_SIGN,
  // TODO: пибрати це після тестування
  LOAD_TEST_OBJECTS,
} from '../../constants/shortcuts'

export default {
  WebMap: {
    [ADD_POLYLINE]: 'alt+l',
    [ADD_POLYGON]: 'alt+p',
    [ADD_CURVED_POLYLINE]: 'alt+c',
    [ADD_CURVED_POLYGON]: 'alt+v',
    [ADD_POINT_SIGN]: 'alt+s',
    // TODO: пибрати це після тестування
    [LOAD_TEST_OBJECTS]: 'alt+q',
  },
}
