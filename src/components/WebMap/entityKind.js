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
  GROUPED_REGION: 15, // згрупований знак "Позиційний район підрозділу" (DZVIN-5991)
  OLOVO: 16, // знак "Смуга ураження керованими снарядами" (DZVIN-5993)
  SOPHISTICATED: 69, // складна лінія
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
  entityKind.GROUPED_HEAD,
  entityKind.GROUPED_LAND,
  entityKind.GROUPED_REGION,
  entityKind.OLOVO,
]

export const entityKindOutlinable = [
  entityKind.POLYGON,
  entityKind.CIRCLE,
  entityKind.RECTANGLE,
  entityKind.SQUARE,
]

export const entityKindCanMirror = [
  entityKind.SEGMENT,
  entityKind.AREA,
  entityKind.CURVE,
  entityKind.POLYGON,
  entityKind.POLYLINE,
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
    entityKind.OLOVO,
  ],
  POINTS: [
    entityKind.POINT,
    entityKind.TEXT,
  ],
  GENERALIZE: [
    entityKind.GROUPED_HEAD,
    entityKind.GROUPED_LAND,
  ],
  GROUPED: [
    entityKind.GROUPED_HEAD,
    entityKind.GROUPED_LAND,
    entityKind.GROUPED_REGION,
  ],
  GROUPED_NOT_DELETED: [
    entityKind.GROUPED_HEAD,
    entityKind.GROUPED_LAND,
  ],
  COMBINED: [
    entityKind.CONTOUR,
    entityKind.GROUPED_HEAD,
    entityKind.GROUPED_LAND,
  ],
  GROUPED_OR_COMBINED: [
    entityKind.CONTOUR,
    entityKind.GROUPED_HEAD,
    entityKind.GROUPED_LAND,
    entityKind.GROUPED_REGION,
  ],
  BEZIER: [
    entityKind.CURVE,
    entityKind.AREA,
  ],
  STATIC: [
    entityKind.SEGMENT,
    entityKind.RECTANGLE,
    entityKind.SQUARE,
    entityKind.CIRCLE,
    entityKind.GROUPED_HEAD,
    entityKind.GROUPED_LAND,
    entityKind.GROUPED_REGION,
  ],
}
