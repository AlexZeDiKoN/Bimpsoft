// ограничения на количество вводимых символов в соответствующие поля на формах

export const MAX_LENGTH_TEXT = {
  TEXTAREA: 30,
  TEXT_MULTILINE: 128,
  INPUT: 15,
  TEXT_INPUT: 30,
  TEXT_INSCRIPTION: 50, // для надписів
  TEXT_DIRECTION: 40, // для назв напрямку
  NAME_REPORT_MAP: 300, // кількість символів для назви звітної карти
}

// ограничения на количество вводимых строк в соответствующие поля на формах
export const MAX_ROW = {
  POINT_AMP: 3,
  INTERMEDIATE_AMP: 3,
}
