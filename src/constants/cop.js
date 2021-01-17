// import { model } from '@C4/MilSymbolEditor'

// const { credibilities } = model

export const layersCOP = {
  intelligenceReliable: '5d3d6eb071c6c515a1000010', // Розвідувальні дані достовірні
  intelligenceNotReliable: '5d3d6eb071c6c515a1000009', // Розвідувальні дані не достовірні
}
// TODO Remove string constants and unComment imports from MilSymbolEditor
export const verificationReliableSource = [ // Розвідувальні дані достовірні, список джерел
  /* credibilities.COMPLETELY_RELIABLE */ 'A', // Повністю достовірне
  /* credibilities.USUALLY_RELIABLE */ 'B', // Зазвичай достовірне
  /* credibilities.FAIRLY_RELIABLE */ 'C', // У цілому достовірне
]

export const verificationNotReliableSource = [ // Розвідувальні дані не достовірні, список джерел
  /* credibilities.NOT_USUALLY_RELIABLE */'D', // Зазвичай недостовірне
  /* credibilities.UNRELIABLE */'E', // Недостовірне
  /* credibilities.RELIABILITY_CANNOT_BE_JUDGED */'F', // Достовірність неможливо визначити
]

export const verificationReliableInformation = [ // Розвідувальні дані достовірні, інформація
  /* credibilities.CONFIRMED_BY_OTHER_SOURCES */ '1', // Підтверджена іншими джерелами
  /* credibilities.PROBABLY_TRUE */ '2', // Імовірно правда
  /* credibilities.POSSIBLY_TRUE */ '3', // Можливо правда
]

export const verificationNotReliableInformation = [ // Розвідувальні дані не достовірні, інформація
  /* credibilities.DOUBTFULLY_TRUE */ '4', // Сумнівно
  /* credibilities.IMPROBABLE */ '5', // Неправдоподібно
  /* credibilities.TRUTH_CANNOT_BE_JUDGED */ '6', // Достовірність не може бути визначено
]
