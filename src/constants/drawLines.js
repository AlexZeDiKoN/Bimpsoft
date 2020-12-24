export const settings = {
  LINE_WIDTH: 2, // (пікселів) товщина ліній
  AMPLIFIERS_STEP: 144, // (пікселів) крок відображення ампліфікаторів на лініях
  AMPLIFIERS_SIZE: 96, // (пікселів) розмір тактичного знака, з якого знімаємо ампліфікатор рівня підрозділу
  AMPLIFIERS_WINDOW_MARGIN: 6, // (пікселів) ширина ободків навкого ампліфікатора
  AMPLIFIERS_STROKE_WIDTH: 6, // (пікселів) товщина пера (у масштабі), яким наносяться ампліфікатори
  NODES_STROKE_WIDTH: 2, // (пікселів) товщина лінії для зображення вузлових точок
  NODES_SPACE: 36, // (пікселів) відстань очищення ампліфікаторів, надто близьких до вузлових точок
  // NODES_CIRCLE_RADIUS: 12, // (пікселів) радіус перекресленого кола у візлових точках
  // NODES_SQUARE_WIDTH: 24, // (пікселів) сторона квадрата у вузлових точках
  LINE_SIZE: { min: 10, max: 50 }, // ширина лінії * 10,  (пікселів)
  POINT_SYMBOL_SIZE: { min: 9, max: 100 }, // (пікселів) розмір точкового знаку
  NODES_SIZE: { min: 12, max: 120 }, // (пікселів) розмір вузлової точки (діаметр перекресленого кола, сторона квадрата)
  TEXT_AMPLIFIER_SIZE: { min: 4, max: 64 }, // (пікселів) 'Розмір текстових ампліфікаторів лінійних/площинних знаків'
  GRAPHIC_AMPLIFIER_SIZE: { min: 4, max: 64 }, // (пікселів) 'Розмір графічних ампліфікаторів лінійних/площинних знаків'
  // Важливо! Для кращого відображення хвилястої лінії разом з ампліфікаторами, бажано щоб константа AMPLIFIERS_STEP
  // була строго кратною WAVE_SIZE
  WAVE_SIZE: { min: 6, max: 180 }, // (пікселів) ширина "хвилі" для хвилястої лінії
  CREASE_SIZE: { min: 6, max: 180 }, // (пікселів) ширина "изгиба" для ліній загородження
  WIRE_SIZE: { min: 30, max: 180 }, // (пікселів) ширина шага повтора для ліній загородження з дрота
  BLOCKAGE_SIZE: { min: 6, max: 180 }, // (пікселів) висота знака для ліній "загородження"
  MOAT_SIZE: { min: 6, max: 180 }, // (пікселів) висота знака для ліній "рів"
  ROW_MINE_SIZE: { min: 4, max: 80 }, // (пікселів) висота знака для ліній "ряд мін"
  DOTS_HEIGHT: { min: 4, max: 50 }, // (пікселів) висота знака для ліній "точки"
  LINE_AMPLIFIER_TEXT_SIZE: { min: 6, max: 70 },
  // WAVE_SIZE: 24, // (пікселів) висота "хвилі" для хвилястої лінії
  STROKE_SIZE: { min: 9, max: 36 }, // (пікселів) відстань між "засічками" для лінії з засічками
  // STROKE_SIZE: 18, // (пікселів) висота "засічки" для лінії з засічками
  // TODO потенційно це місце просадки продуктивності:
  // TODO * при маленьких значеннях будуть рвані лінії
  // TODO * при великих може гальмувати відмальовка
  LUT_STEPS: 16000, // максимальна кількість ділянок, на які розбивається сегмент кривої Безьє для обчислення
  // довжин і пропорцій
  DRAW_PARTIAL_WAVES: true,
  MIN_ZOOM: 5,
  MAX_ZOOM: 20,
  STROKE_WIDTH: 5,
  CROSS_SIZE: 24,
  DASHARRAY: '20', // определяет структуру штрихов и пробелов , используемых для рисования пунктирной линии
  DOTS_LENGTH_FACTOR: 0.2, // коэффициент длины точки линии к толщине линии при исползовании stroke_linecap = 'round'
  FACTOR_SIZE: 10, // коэффициент для интерполяции размеров
}
export const HATCH_TYPE = {
  NONE: 'none',
  LEFT_TO_RIGHT: 'left-to-right',
  RIGHT_TO_LEFT: 'right-to-left',
}
export const MARK_TYPE = {
  ARROW_90: 'arrow90',
  ARROW_60: 'arrow60',
  ARROW_45: 'arrow45',
  ARROW_30: 'arrow30',
  ARROW_30_FILL: 'arrow30fill',
  ARROW_60_FILL: 'arrow60fill',
  ARROW_90_DASHES: 'arrow90dashes',
  ARROW1: 'arrow1',
  ARROW2: 'arrow2',
  ARROW3: 'arrow3',
  ARROW4: 'arrow4',
  STROKE1: 'stroke1',
  STROKE2: 'stroke2',
  STROKE3: 'stroke3',
  FORK: 'fork',
  CROSS: 'cross',
  SERIF: 'serif',
  ANGLE: 'angle',
  SERIF_CROSS: 'serif_cross',
}
export const SIN45 = 0.707
export const SIN60 = 0.866
export const SIN60_05 = 0.433
export const SIN30 = 0.5
