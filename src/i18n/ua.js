export const EDIT_MODE = 'Режим роботи'
export const DATE = 'Дата'
export const ADD_TEXT = 'Додати надпис'
export const PRINT = 'Друк'
export const TOGGLE_SIDEBAR = 'Відобразити/сховати праву панель'
export const SETTINGS = 'Налаштування'
export const ERROR = 'Помилка'
export const UNKNOWN_ERROR = 'Невідома помилка'
export const SERVER_ERROR = 'Помилка сервера'
export const SERVER_WARNING = 'Попередження'
export const ERROR_WHEN_SAVE_PARAMETER = 'Налаштування не збережені'
export const UNKNOWN_SERVER_ERROR = 'Невідома помилка сервера'
export const POINT_SIGN = 'Точковий знак'
export const LINE_SIGN = 'Комбінований умовний знак'
export const POLY_SIGN = 'Полілінійний/полігональний знак'
export const HISTORY = 'Журнал'
export const ORG_STRUCTURE = 'Організаційна структура'
export const LAYERS = 'Шари'
export const FILTER = 'Фільтрувати'
export const SEARCH = 'Пошук'
export const MIL_TEMPLATE = 'Шаблон умовного знаку'
export const MIL_SYMBOL = 'Умовний знак'
export const HIDE_MINIMAP = 'Приховати міні-карту'
export const SHOW_MINIMAP = 'Показати міні-карту'
export const ZOOM_IN = 'Збільшити'
export const ZOOM_OUT = 'Зменшити'
export const ABBR_METERS = 'м'
export const ABBR_KILOMETERS = 'км'
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
export const REMOVING_SIGNS = 'Видалення знаків'
export const LAYER_WITH_NAME = (layerName) => `Шар: ${layerName}`
export const NUM_SELECTED_SIGNS = (n) => `Вибрано знаків: ${n}`
export const NUM_BUFFERED_SIGNS = (n) => `Кількість знаків в буфері: ${n}`

export const SHAPE_POLYLINE = 'Ломана лінія'
export const SHAPE_CURVE = 'Крива'
export const SHAPE_POLYGON = 'Багатокутник'
export const SHAPE_AREA = 'Область'
export const SHAPE_RECTANGLE = 'Прямокутник'
export const SHAPE_CIRCLE = 'Коло'
export const SHAPE_SQUARE = 'Квадрат'
export const SHAPE_TEXT = 'Текстова мітка'

export const UNDEFINED = 'Не вказано'

export const DEFAULT_COORDINATES_SYSTEM = 'Система координат (за замовчуванням)'
export const POINT_SIGN_SIZE = 'Розмір точкових знаків'
export const TEXT_SIGN_SIZE = 'Розмір текстових знаків'
export const LINE_SIGN_SIZE = 'Розмір лінійних знаків'
export const MIN_ZOOM = 'Мін. масштаб'
export const MAX_ZOOM = 'Макс. масштаб'
export const MINIMAP = 'Мінікарта'
export const AMPLIFIERS = 'Ампліфікатори'
export const GENERALIZATION = 'Генералізація'

export const WGS_84 = 'WGS-84'
export const USK_2000 = 'УСК-2000'
export const MGRS = 'MGRS'
export const UTM = 'UTM'

export const SUBORDINATION_LEVEL = 'Рівень підпорядкування'
export const TEXT = 'Надпис'
export const TRANSPARENT_BACKGROUND = 'Непрозорий фон'
export const DISPLAY_ANCHOR_LINE = 'Відображати лінію прив\'язки'
export const ANCHOR_LINE_WITH_ARROW = 'Лінія прив\'язки зі стрілкою'
export const MAGNIFICATION = 'Збільшення'

export const OK = 'Гаразд'
export const CANCEL = 'Скасувати'

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

export const LINE_TYPE = 'Тип лінії'
export const SOLID = 'Суцільна'
export const DASHED = 'Пунктирна'
export const WAVED = 'Хвиляста'
export const STROKED = 'З засічками'

export const REGULAR = 'Звичайний'
export const LINE_ENDS_LEFT = 'Лівий край' // константа використовується
export const LINE_ENDS_RIGHT = 'Правий край' // константа використовується
export const ARROW = 'Стрілка'
export const STROKE = 'Засічка'

export const LINE_NODES = 'Вузлова точка'
export const CROSS_CIRCLE = 'Коло'

export const NO_ONE = 'Немає'
export const SHOW_LEVEL = 'Рівень'

export const LINE_STYLE = 'Стиль лінії'
export const LINE_STYLE_WAVE = 'Хвиляста'

export const COORDINATES = 'Координати'
export const NODAL_POINTS = 'Вузлові точки'
export const SIDE_SIZE = 'Довжина сторони'
export const RADIUS = 'Радіус'
export const CENTER = 'Центр'
export const BOUND = 'Межа'
export const NORTH_WEST = 'Північний захід'
export const SOUTH_EAST = 'Південний схід'
export const NODAL_POINT_INDEX = (index) => `Точка ${index}`

export const EDIT = 'Редагувати'
export const REMOVE = 'Видалити'

export const MAP_SOURCE = 'Джерело картографічної інформації'
export const SITUATION_DETAILS = ({ level }) => `Деталізація обстановки: ${level}`

export const INCORRECT_COORDINATE = 'Не вірно задана вузлова точка'
export const EMPTY_TEXT = 'Текст пустий'
export const CANNOT_OPEN_LAYER_WO_PARENT = 'Неможливо відкрити шар, для якого не задана карта'
export const CANNOT_OPEN_LAYER_WO_FORMATION = 'Неможливо відкрити шар, для якого не задана організаційна структура'

export const ERROR_ACCESS_DENIED = 'Доступ заборонено'
export const ERROR_NO_CONNECTION = 'Сервер карти недоступний'
export const ERROR_SOMETHING_WENT_WRONG = 'Щось пішло не так...'

export const CANNOT_ENABLE_EDIT_MODE = 'Неможливо увімкнути режим редагування'
export const NO_ACTIVE_LAYER = 'Немає активного шару'
export const READ_ONLY_LAYER_ACCESS = (name) => `Доступ до шару ${name} тільки на перегляд`

export const LAYERS_VISIBILITY = 'Видимість шару'
export const LAYERS_BASEMAP_OPACITY = 'Непрозорість картографічної основи (%)'
export const LAYERS_INACTIVE_OPACITY = 'Непрозорість знаків неактивного шару (%)'
export const LAYERS_HIGHLIGHT_COLOR = 'Колір підсвічування знаків'
export const LAYERS_CLOSE_ALL_MAPS = 'Закрити всі карти'
export const LAYERS_CLOSE_CURRENT_MAP = 'Закрити поточну карту'
