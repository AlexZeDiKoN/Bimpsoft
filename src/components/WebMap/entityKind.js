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
  entityKind.CONTOUR,
]
