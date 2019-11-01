const entityKind = { // ID в базі даних відповідних типів тактичних знаків
  POINT: 1, // точковий знак (MilSymbol)
  SEGMENT: 2, // знак відрізкового типу
  AREA: 3, // замкнута крива лінія
  CURVE: 4, // незамкнута крива лінія
  POLYGON: 5, // замкнута ламана лінія (багатокутник)
  POLYLINE: 6, // незамкнута ламана лінія
  CIRCLE: 7, // коло
  RECTANGLE: 8, // прямокутник
  SQUARE: 9, // квадрат
  TEXT: 10, // текстова мітка
  CONTOUR: 11, // контур
  TARGETING: 12, // зона вогневого ураження
  GROUPED_HEAD: 13, // згрупований знак пунктів управління
  GROUPED_LAND: 14, // згрупований знак сухопутних об'єктів
  GROUP: 99, // група
  FLEXGRID: 100, // Операційна зона ("сіточка")
}

export default entityKind

export const entityKindFillable = [
  entityKind.AREA,
  entityKind.POLYGON,
  entityKind.CIRCLE,
  entityKind.RECTANGLE,
  entityKind.SQUARE,
  entityKind.CONTOUR,
  entityKind.TARGETING,
]

export const entityKindNonFillable = [
  entityKind.POINT,
  entityKind.SEGMENT,
  entityKind.CURVE,
  entityKind.POLYLINE,
  entityKind.TEXT,
  entityKind.GROUP,
  entityKind.FLEXGRID,
]

export const entityKindOutlinable = [
  entityKind.POLYGON,
  entityKind.CIRCLE,
  entityKind.RECTANGLE,
  entityKind.SQUARE,
]

export const entityKindMultipointCurves = [
  entityKind.POLYLINE,
  entityKind.CURVE,
]

export const entityKindMultipointAreas = [
  entityKind.POLYGON,
  entityKind.AREA,
]

export const GROUPS = {
  FRONTIERS: [
    entityKind.CURVE,
    entityKind.POLYLINE,
  ],
  AREAS: [
    entityKind.AREA,
    entityKind.POLYGON,
    entityKind.CIRCLE,
    entityKind.RECTANGLE,
    entityKind.SQUARE,
    entityKind.CONTOUR,
  ],
  POINTS: [
    entityKind.POINT,
    entityKind.TEXT,
  ],
  GROUPED: [
    entityKind.GROUPED_HEAD,
    entityKind.GROUPED_LAND,
  ],
}
