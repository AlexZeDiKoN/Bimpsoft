import {
  ADD_POINT, ADD_SEGMENT, ADD_AREA, ADD_CURVE, ADD_POLYGON, ADD_POLYLINE, ADD_CIRCLE, ADD_RECTANGLE, ADD_SQUARE,
  ADD_TEXT,
  // TODO: пибрати це після тестування
  LOAD_TEST_OBJECTS,
} from '../../constants/shortcuts'

export default {
  WebMap: {
    [ADD_POINT]: 'alt+1',
    [ADD_SEGMENT]: 'alt+2',
    [ADD_AREA]: 'alt+3',
    [ADD_CURVE]: 'alt+4',
    [ADD_POLYGON]: 'alt+5',
    [ADD_POLYLINE]: 'alt+6',
    [ADD_CIRCLE]: 'alt+7',
    [ADD_RECTANGLE]: 'alt+8',
    [ADD_SQUARE]: 'alt+9',
    [ADD_TEXT]: 'alt+0',
    // TODO: пибрати це після тестування
    [LOAD_TEST_OBJECTS]: 'alt+`',
  },
}
