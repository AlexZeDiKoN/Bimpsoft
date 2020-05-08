export const AUTO = 'Автоматично'
export const EDIT_MODE = 'Режим роботи'
export const DATE = 'Дата'
export const ADD_TEXT = 'Додати надпис'
export const PRINT = 'Друк'
export const PRINT_REQUISITES = 'Друк реквізитів'
export const TOGGLE_SIDEBAR = 'Відобразити/сховати праву панель'
export const SETTINGS = 'Налаштування'
export const TOPOGRAPHIC_OBJECT_CARD = 'Картка топографічного об’єкту'
export const ERROR = 'Помилка'
export const COORDINATES_UNDEFINED = 'Координати не задані'
export const PRINT_ZONE_UNDEFINED = 'Область друку не задана'
export const UNKNOWN_ERROR = 'Невідома помилка'
export const SERVER_ERROR = 'Помилка сервера'
export const VALIDATION_ERROR = 'Помилка валідації'
export const SERVER_WARNING = 'Попередження'
export const ERROR_WHEN_SAVE_PARAMETER = 'Налаштування не збережені'
export const UNKNOWN_SERVER_ERROR = 'Невідома помилка сервера'
export const POINT_SIGN = 'Точковий знак'
export const LINE_SIGN = 'Лінійний/площинний знак'
export const HISTORY = 'Журнал'
export const ORG_STRUCTURE = 'Організаційна структура'
export const LAYERS = 'Шари'
export const FILTER = 'Фільтрувати'
export const SEARCH = 'Пошук'
export const MIL_TEMPLATE = 'Шаблон умовного знаку'
export const MIL_SYMBOL = 'Умовний знак'
export const HIDE_MINIMAP = 'Приховати міні-карту'
export const SHOW_MINIMAP = 'Показати міні-карту'
export const HIDE_CATALOG = 'Приховати об\'єкти каталогу'
export const SHOW_CATALOG = 'Показати об\'єкти каталогу'
export const ZOOM_IN = 'Збільшити'
export const ZOOM_OUT = 'Зменшити'
export const ABBR_METERS = 'м'
export const ABBR_KILOMETERS = 'км'
export const ABBR_GRADUS = '˚'
export const LONGITUDE = 'Довгота'
export const LATITUDE = 'Широта'
export const ADD_POINT_SIGN_TEMPLATE = 'Додати шаблон умовного знаку'
export const MSG_TITLE_SIGN_TEMPLATE_CREATED = 'Шаблону умовного знаку створено'
export const MSG_TEXT_SIGN_TEMPLATE_CREATED = ({ name, code }) => `Назва:${name}\r\n Код: ${code}`
export const MEASURE = 'Виміряти відстань'
export const CUT = 'Вирізати (Ctrl+X)'
export const COPY = 'Копіювати (Ctrl+C)'
export const PASTE = 'Вставити (Ctrl+V)'
export const DELETE = 'Видалити  (Delete)'
export const REMOVING_SIGNS = 'Видалити знаки?'
export const ERROR_CODE_SIGNS = 'Верифікація об’єктів'
export const ERROR_MESSAGE_1 = 'На поточному шарі знайдений умовний знак'
export const ERROR_MESSAGE_2 = 'військового формування'
export const QUESTION_1 = 'Нанести ще один?'
export const CONTINUE = 'Продовжити?'
export const DIVIDE_DIRECTION = 'Розділити напрямок'
export const COMBINE_DIRECTIONS = 'Об\'єднати напрямки'
export const CHOOSE_DIRECTION = 'Оберіть напрямок'
export const CHOOSE_DIRECTIONS = 'Оберіть напрямки'
export const CLOSE_MAP = 'Закрити карту?'
export const CLOSE_MAPS = 'Закриття карт'
export const CLOSE_MAPS_CONFIRM = 'Закрити всі карти?'
export const LAYER_WITH_NAME = (layerName) => `Шар: ${layerName}`
export const MAP_WITH_NAME = (mapName) => `Карта: ${mapName}`
export const NUM_SELECTED_SIGNS = (n) => `Вибрано знаків: ${n}`
export const NUM_BUFFERED_SIGNS = (n) => `Кількість знаків в буфері: ${n}`
export const SHOW_UNBOUND_OBJECTS = 'Показати неприв\'язані об\'єкти'
export const EXTRA_FUNCTIONS = 'Додаткові функції'

export const SHAPE_POLYLINE = 'Ломана лінія'
export const SHAPE_CURVE = 'Крива'
export const SHAPE_POLYGON = 'Багатокутник'
export const SHAPE_AREA = 'Область'
export const SHAPE_RECTANGLE = 'Прямокутник'
export const SHAPE_CIRCLE = 'Коло'
export const SHAPE_SQUARE = 'Квадрат'
export const SHAPE_TEXT = 'Текстова мітка'
export const SHAPE_AIRBORNE = 'Умовний знак'
export const SHAPE_MANOEUVRE = 'Напрямок'
export const SHAPE_MINED_AREA = 'Район мінування'
export const SHAPE_SECTORS = 'Зона ураження / виявлення (сектор)'
export const SHAPE_POLLUTION_CIRCLE = 'Мінімально безпечні відстані забруднення місцевості'
export const SHAPE_CIRCULAR_ZONE = 'Кругова зона'
export const SHAPE_MINEFIELD = 'Мінне поле'

export const UNDEFINED = 'Не вказано'

export const DEFAULT_COORDINATES_SYSTEM = 'Система координат (за замовчуванням)'
export const POINT_SIGN_SIZE_TITLE = '(min | max) px'
export const POINT_SIGN_SIZE = 'Розмір точкових знаків'
export const TEXT_SIGN_SIZE = 'Розмір текстових знаків'
export const LINE_SIGN_SIZE = 'Товщина для лінійних/площинних знаків'
export const NODE_SIGN_SIZE = 'Розмір знаків у вузлових точках'
export const TEXT_AMPLIFIER_SIGN_SIZE = 'Розмір текстових ампліфікаторів лінійних/площинних знаків'
export const GRAPHIC_AMPLIFIER_SIGN_SIZE = 'Розмір графічних ампліфікаторів лінійних/площинних знаків'
export const WAVE_SIGN_SIZE = 'Розмір елементів хвилястої лінії'
export const BLOCKAGE_SIGN_SIZE = 'Розмір елементів ліній загородження'
export const MOAT_SIGN_SIZE = 'Розмір елементів ліній типа "Протитанковий рів ..."'
export const ROW_MINE_SIGN_SIZE = 'Розмір елементів ліній типа "Ряд ... мін"'
export const STROKE_SIGN_SIZE = 'Розмір елементів лінії з засічками'
export const MINIMAP = 'Мінікарта'
export const AMPLIFIERS = 'Ампліфікатори'
export const AMPLIFIER = 'Ампліфікатор'
export const AMPLIFIERS_DISPLAY = 'Відображення ампліфікаторів'
export const AMP_LEFT = 'Зліва'
export const AMP_RIGHT = 'Справа'
export const AMP_TOP = 'Вгорі'
export const AMP_BOTTOM = 'Знизу'
export const SECTORS = 'Сектори'
export const SECTOR = 'Сектор'
export const AMPLIFIER_T = 'Ампліфікатор «T»'
export const AZIMUTH = 'Азимут'
export const AZIMUTH1 = 'Азимут 1'
export const AZIMUTH2 = 'Азимут 2'
export const GENERALIZATION = 'Генералізація'
export const VOLUME_VIEW = 'Відображення 3D'
export const MINIMUM = 'Мінімальний'
export const MAXIMUM = 'Максимальний'
export const EFFECTIVE = 'Ефективний'
export const AMP_LANES_NUMBER = 'Кількість смуг'
export const AMP_ZONES_NUMBER = 'Кількість зон у смузі'
export const AMP_STARTING_NUMBER = 'Початковий номер'
export const AMP_TITLE = 'Назва'

export const UNIT = 'Підрозділ'
export const SUBORDINATION_LEVEL = 'Рівень підпорядкування'
export const TEXT = 'Надпис'
export const TEXT_2 = 'Текст'
export const TRANSPARENT_BACKGROUND = 'Непрозорий фон'
export const DISPLAY_ANCHOR_LINE = 'Відображати лінію прив\'язки'
export const ANCHOR_LINE_WITH_ARROW = 'Лінія прив\'язки зі стрілкою'
export const MAGNIFICATION = 'Збільшення'

export const COLOR = 'Колір'
export const FILLING = 'Заливка'
export const TRANSPARENT = 'Прозорий'
export const BLUE = 'Синій'
export const RED = 'Червоний'
export const BLACK = 'Чорний'
export const GREEN = 'Зелений'
export const YELLOW = 'Жовтий'
export const WHITE = 'Білий'

export const LINE_SEGMENT = 'Відрізок лінії'
export const SEGMENT_DIRECT = 'Пряма лінія'
export const SEGMENT_ARC = 'Дуга'

export const MINE_TYPE = 'Тип мін'
export const MINE_CONTROLLABILITY = 'Керованість'
export const LINE_TYPE = 'Тип лінії'
export const LINE_WIDTH = 'Товщина лінії'
export const LINE_COLOR = 'Колір лінії'
export const FILL_COLOR = 'Колір заливки'
export const HATCH_COLOR = 'штрихування'
export const SOLID = 'Суцільна'
export const DASHED = 'Пунктирна'
export const CHAIN_LINE = 'Штрих-пунктир'
export const WAVED = 'Хвиляста'
export const STROKED = 'З засічками'
export const LINE_BLOCKAGE = 'Загородження'
export const LINE_BLOCKAGE_ISOLATION = 'Ізоляція'
export const LINE_MOAT_ANTITANK_UNFIN = 'Протитанковий рів (будується)'
export const LINE_MOAT_ANTITANK = 'Протитанковий рів'
export const LINE_MOAT_ANTITANK_MINE = 'Протитанковий рів з мінами'
export const LINE_BLOCKAGE_WIRE = 'Дротяне загородження'
export const LINE_BLOCKAGE_WIRE1 = 'Дротяне загородження (однорядне)'
export const LINE_BLOCKAGE_WIRE2 = 'Дротяне загородження (дворядне)'
export const LINE_BLOCKAGE_WIRE_FENCE = 'Подвійний дротяний паркан'
export const LINE_BLOCKAGE_WIRE_LOW = 'Дротяне загородження на низьких кілках'
export const LINE_BLOCKAGE_WIRE_HIGH = 'Дротяне загородження на високих кілках'
export const LINE_BLOCKAGE_SPIRAL = 'Спіральне загородження (однорядне)'
export const LINE_BLOCKAGE_SPIRAL2 = 'Спіральне загородження (дворядне)'
export const LINE_BLOCKAGE_SPIRAL3 = 'Спіральне загородження (трирядне)'
export const LINE_SOLID_WITH_DOTS = 'Суцільна с крапками'
export const LINE_BLOCKAGE_TRENCHES = 'Система траншей'
export const LINE_MINES_ANTI_TANK = 'Ряд протитанкових мін'
export const LINE_MINES_LAND = 'Ряд протипіхотних мін'

export const HATCH = 'Штриховка'
export const LEFT_TO_RIGHT = 'Зліва направо'

export const REGULAR = 'Звичайний'
export const LINE_ENDS_LEFT = 'Лівий край' // константа використовується
export const LINE_ENDS_RIGHT = 'Правий край' // константа використовується
export const ARROW = 'Стрілка'
export const STROKE = 'Засічка'
export const FORK = 'Розвилка'
export const CROSS = 'Перехрестя'

export const LINE_NODES = 'Вузлова точка'

export const NO_ONE = 'Немає'
export const SHOW_LEVEL = 'Рівень'
export const ARROW_FILLED = 'Стрілка 1'
export const ARROW_LEFT = 'Стрілка 2'

export const LINE_STYLE = 'Стиль лінії'
export const LINE_STYLE_WAVE = 'Хвиляста'

export const COORDINATES = 'Координати'
export const DIRECTION = 'Напрямок'
export const NODAL_POINTS = 'Вузлові точки'
export const SIDE_SIZE = 'Довжина сторони'
export const RADIUS = 'Радіус'
export const CENTER = 'Центр'
export const BOUND = 'Межа'
export const NORTH_WEST = 'Північний захід'
export const SOUTH_EAST = 'Південний схід'
export const NODAL_POINT_INDEX = (index) => `Точка ${index}`

export const YES = 'Так'
export const EDIT = 'Редагувати'
export const EDITING = 'Редагується'
export const OBJECT_EDITING_BY = 'Цей тактичний знак зараз редагується користувачем'
export const REMOVE = 'Видалити'
export const DIVIDE = 'Розділити'
export const COMBINE = 'Об\'єднати'
export const MIRROR_IMAGE = 'Дзеркально відобразити'
export const CONTOUR = 'Контур'
export const SOPHISTICATED = 'Складна лінія'
export const ATTACK = 'Напрямок удару / атаки'
export const CONCENTRATION_FIRE = 'Послідовне зосередження вогню'
export const CONTOUR_REGION_UNIT = 'Позиційний район підрозділу'

export const MAP_SOURCE = 'Джерело картографічної інформації'
export const SITUATION_DETAILS = ({ level }) => `Деталізація обстановки: ${level}`

export const INCORRECT_COORDINATE = 'Не вірно задана вузлова точка'
export const EMPTY_TEXT = 'Текст пустий'
export const CANNOT_OPEN_LAYER_WO_PARENT = 'Неможливо відкрити шар, для якого не задана карта'
export const CANNOT_OPEN_LAYER_WO_FORMATION = 'Неможливо відкрити шар, для якого не задана організаційна структура'

export const ERROR_ACCESS_DENIED = 'Доступ заборонено'
export const ERROR_NO_CONNECTION = 'Сервер недоступний'
export const ERROR_SOMETHING_WENT_WRONG = 'Щось пішло не так...'
export const ERROR_OBJ_LOCKED = 'Об\'єкт заблоковано для редагування іншим користувачем'
export const ERROR_UNDEFINET_OBJECT_TYPE = 'Тип знаку не задано'
export const ERROR_EMPTY_MILSYMBOL_CODE = 'Код знаку не задано'
export const MILSYMBOL_CODE = 'Код знаку'

export const CANNOT_ENABLE_EDIT_MODE = 'Неможливо увімкнути режим редагування'
export const NO_ACTIVE_LAYER = 'Немає активного шару'
export const READ_ONLY_LAYER_ACCESS = (name) => `Доступ до шару "${name}" тільки на перегляд`
export const CANNOT_EDIT_SIGNED_MAP = (name) => `Карта "${name}" підписана, редагування неможливе`

export const MAPS_VISIBILITY = 'Сховати всі карти'
export const MAP_VISIBILITY = 'Видимість карти'
export const LAYER_VISIBILITY = 'Видимість шару'
export const LAYERS_VISIBILITY = 'Видимість шарів'
export const LAYERS_BASEMAP_OPACITY = 'Непрозорість картографічної основи (%)'
export const LAYERS_INACTIVE_OPACITY = 'Непрозорість знаків неактивного шару (%)'
export const LAYERS_HIGHLIGHT_COLOR = 'Колір підсвічування знаків'
export const LAYERS_CLOSE_ALL_MAPS = 'Закрити всі карти'
export const CLOSE_MAP_SECTIONS = 'Згорнути всі карти'
export const LAYERS_CLOSE_CURRENT_MAP = 'Закрити поточну карту'
export const LAYERS_INACTIVE_OPACITY_FAIL = 'Неможливо змінити в цьому режимі'

export const ELEMENT_SIZES = 'Розміри елементів'
export const ELEMENT_SCALES = 'Деталізація обстановки'
export const TOPOGRAPHIC_OBJECTS = 'Топографічні об’єкти'
export const MARKER = 'Маркер'
export const MESSAGE = 'Повідомлення'
export const CATALOGS = 'Каталоги'
export const STATE = 'Стан'
export const COUNTRY = 'Країна'

export const IDENTITY = 'Приналежність'
export const FRIENDLY = 'дружня'
export const HOSTILE = 'ворожа'
export const ZONE_OF_DIRECTION = 'зона напрямку'

export const NO_OBJECTS = 'Топографічних об\'єктів не знайдено'

// Друк карти
// лейбли
export const SCALE = `Масштаб`
export const DPI = 'Роздільна здатність (DPI)'
export const COORDINATES_TYPE = 'Система координат'
export const MAP_LABEL = `Гриф`
export const MAP_COPY = 'Прим. № __'
export const FIRST_ROW = `Рядок 1`
export const SECOND_ROW = `Рядок 2`
export const THIRD_ROW = `Рядок 3`
export const FOURTH_ROW = `Рядок 4`
export const FIFTH_ROW = `Рядок 5`
export const START = `Почата`
export const FINISH = `Закінчена`
export const CONFIRM_DATE = `Дата підпису`
// заголовки
export const DOC_HEADER = `Заголовок документа`
export const MAIN_INDICATORS = `Основні показники`
export const LEGEND = `Умовні позначення`
export const SIGN = `Знак`
export const SIGN_CONTENT = `Зміст знаку`
export const DOCUMENT_SIGNATORIES = `Підпис документа`
export const POSITION = `Посада`
export const RANG = `Звання`
export const FULL_NAME = `ПІБ`
export const DESIGNATION = `Назва`
export const DESCRIPTION = `Опис`
export const SYMBOLS = 'Умовні знаки'
// кнопка меню
export const PRINT_BUTTON = `Роздрукувати карту`
export const FLEX_GRID = `Операційна зона`
export const FLEX_GRID_SHORTCUT = `Alt + R`
export const DIRECTIONS_AMOUNT = `Кількість напрямків`
export const DIRECTION_ZONES = `Зони напрямків`
export const CREATE = `Створити`
export const SEND_TO_ICT = `Передати до ІРЗ склад угруповань в ОЗ`
export const SENT_TO_ICT = `Склад угруповань в ОЗ успішно передано до ІРЗ`
export const INVALID_UNITS_IN_GRID = 'Неоднозначність визначення місцеположення підрозділу'
// стани
export const SENT_TO_PROCESSING = 'Надіслано в обробку'
export const PUT_IN_QUEUE = 'Поставлено в чергу'
export const FORMATION_FILE = 'Формування графічного файлу'
export const FILE_IS_GENERATED = 'Файл сформовано'
export const ERROR_OCCURRED = 'Виникла помилка'
export const NO_ORG_STRUCTURE = 'Орг. структура відсутня'
export const ORG_STRUCTURE_SHORT = 'Орг. структура'

// лог
export const FILES_TO_PRINT = 'Файли на друк'
export const OPEN_FILE = 'Відкрити файл в провіднику'
export const CANCEL_FILE = 'Скасувати'
export const CLEAN_FILE = 'Прибрати зі списку'
export const RETRY_FILE = 'Спробувати ще раз'

// Марш
export const MARCH_TITLE = 'Маршрут марша'
export const MARCH_DISTANCE = 'Довжина маршруту'
export const MARCH_LINK = 'Варіант маршу'
export const MARCH_NAME = 'Назва маршрута'
export const OPEN_MARCH_FILE = 'Вибір існуючого маршрута'
export const MARCH_TYPE = 'Тип руху за маршрутом'
export const GEOGRAPHICAL_LANDMARK = 'Географічний орієнтир'
export const CHECK_SEGMENT = 'Вибір відрізка'
export const SEGMENT_NAME = 'Назва відрізка'
export const ADD_SEGMENT = 'Додати пункт маршрута'
export const CREATE_BTN_TITLE = 'Зберегти'
export const CANCEL_BTN_TITLE = 'Скасувати'
export const DEFAULT_SEGMENT_NAME = 'Створити вручну'

export const CREATE_FLEX_GRID_HINT = 'Розташуйте підрозділи на карті та визначте операційну зону'
export const PERIOD_FROM = 'з'
export const PERIOD_TO = 'по'
export const PERIOD_START = 'Початок періоду'
export const PERIOD_END = 'Кінець періоду'
export const GRID = 'Плиткою'
export const LIST = 'Списком'
export const DISPLAY_PERIOD = 'Період показу'
export const TARGETING = 'Цілевказання'
export const TARGETS = 'Цілі'

// показатели подразделения
export const NOT_CALCULATED = 'Дані не розраховано'
export const UNIT_NAME = 'Назва підрозділу'
export const DATE_FOR = 'Станом на'
export const BP_001 = 'Штатний БП'
export const BP_002 = 'Реальний БП'
export const BP_003 = 'Боєздатність у обороні'
export const BP_004 = 'Боєздатність у наступі'
export const BCHS_003 = 'МПС та ФС О/С'
export const BCHS_004 = 'Підготовленість О/С'
export const BCHS_005 = 'Укомплектованість О/С'
export const BCHS_006 = 'Укомплектованість ОВТ'

// Завдання
export const ERROR_SAVE_TASK = 'Помилка при створенні завдання'
export const ERROR_SEND_TASK = 'Помилка при відправленні завдання'
export const CREATE_TASK = 'Створити завдання'
export const TASK_SAVED = 'Завдання збережене'
export const TASK_SENT = 'Завдання відправлене'
export const CREATE_TASK_ERROR = 'Неможливо створити завдання'
export const CREATE_TASK_ERROR_UNIT_NOT_DEFINED = `Для створення завдання необхідно прив’язати умовний знак до підрозділу`
export const TASK = 'Завдання'

// Цілі
export const AREA = 'Район'
export const FRONTIER = 'Рубіж'
export const LOCATION = 'Позиція'

export const ACCESS_READONLY = 'Лише перегляд'
export const GROUPING = 'Групувати'
export const UNGROUPING = 'Розгрупувати'
export const GROUPING_REGION = 'Позиційний район підрозділу'

export const NATO_CLASSIFIER = 'Класифікація НАТО'
export const DIVIDING_LINE = 'Розмежувальна лінія'

// statuses
export const STATUS = 'Стан'
export const EXISTING = 'Існуючий'
export const PLANNED = 'Плановий'
export const EXPECTED = 'Очікуваний'
export const PROBABLE = 'Ймовірний'

// dummy  Макет/Хибний
export const DUMMY = 'Макет/Хибний'
export const DUMMY_DESCR = 'Показує, що це макет або хибний підрозділ для введення в оману'

// тип мін
export const MINE_ANTI_TANK = 'Протитанкові'
export const MINE_ANTI_PERSONNEL = 'Протипіхотні'
export const MINE_UNDEFINED_TYPE = 'Невизначеного типу'
export const MINE_VARIOUS_TYPES = 'Різних типів'
export const MINE_MARINE = 'Морські міни'
export const MINE_MARINE_BOTTOM = 'Морські донні міни'
export const MINE_MARINE_ANCHORS = 'Морські якірні міни'

// керованість мін
export const MINE_UNCONTROLLED = 'Не вказано'
export const MINE_RADIO = 'По радіо'
export const MINE_WIRED = 'По проводам'
