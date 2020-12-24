// Условные знаки для новой вкладки
// формат: [ { name: '', children: [ { hint: '', code: '<Number>', amp: '' }, ..., {} ] }, ..., {} ]

import entityKind from '../components/WebMap/entityKind'
import { NODAL_POINT_ICONS } from '../components/SelectionForm/parts/WithNodalPointType'
import { types } from '../components/SelectionForm/parts/WithLineType'
import {
  ENDS_ARROW1,
  ENDS_ARROW2,
  ENDS_FORK,
  ENDS_STROKE1,
} from '../components/SelectionForm/parts/WithLineEnds'
import { HATCH_TYPE, MARK_TYPE } from './drawLines'

export const amps = {
  specialHeadquarters: 'specialHeadquarters', // 1Назва командування
  higherFormation: 'higherFormation', // 1Вище формування
  uniqueDesignation: 'uniqueDesignation', // 1Призначення
  uniqueDesignation1: 'uniqueDesignation1', // 1Призначення, дублирует поле staffComments для знака "Пункт"
  commonIdentifier: 'commonIdentifier', // Загальний ідентифікатор
  additionalInformation: 'additionalInformation', // 1Додаткова інформація
  reinforcedReduced: 'reinforcedReduced', // 1Посилення/Послаблення
  country: 'country', // Країна
  staffComments: 'staffComments', // 1Коментар
  affiliation: 'affiliation',
  dtg: 'dtg', // 1Дата-час
  type: 'type', // 1Озброєння
  typeId: 'typeId', // Код озброення, 0 - для введеного в ручну
  N: 'middle', // Амплификатор в форме линий
  // Если что, в формах любых линий есть топ, ботом и мидл, но лейбл у них разный, например W и H это ботом
  T: 'top', //  (intermediateAmplifier - H1)
  W: 'bottom', // (intermediateAmplifier - H2)
  A: 'additional',
  B: 'center', //  это для сложных линий
  // в простіх линиях для амплификатора "B" между опорніми точками (intermediateAmplifier) используйте "N"
}

export const MINE_TYPES = {
  ANTI_TANK: 0,
  ANTI_PERSONNEL: 1,
  UNDEFINED_TYPE: 2,
  VARIOUS_TYPES: 3,
  MARINE: 4,
  MARINE_BOTTOM: 5,
  MARINE_ANCHORS: 6,
}

export const CODE_MINE_TYPES = [
  '10032500002803000000',
  '10032500002802000000',
  '10032500002806000000',
  '10032500002802000000',
  '00033600001100000000',
  '00033600001101000000',
  '00033600001102000000',
]

export const CONTROL_TYPES = {
  UNCONTROLLED: 0,
  RADIO: 1,
  WIRED: 2,
}

// Все, что с пустым кодом - Линии, все у которых isSvh = true - Линии. TODO - добавить свгши, или ссылки на них
// isFlip === true - Реверсирует сгенерированные координаты (для переворота типовой линии в замкнутых фигурах)
export const symbols = [
  {
    name: 'Пункти управління',
    children: [
      {
        hint: 'Командний пункт сил оборони',
        code: '10031002250000009800',
        amp: { [amps.specialHeadquarters]: 'СО' },
      },
      {
        hint: 'Командний пункт Об\'єднаних сил',
        code: '10031002250000009800',
        amp: { [amps.specialHeadquarters]: 'ОС' },
      },
      {
        hint: 'Командний пункт десантно-штурмових військ',
        code: '10031002240000009800',
        amp: { [amps.specialHeadquarters]: 'ДШВ' },
      },
      {
        hint: 'Командний пункт Сил спеціальних операцій',
        code: '10031002240000009800',
        amp: { [amps.specialHeadquarters]: 'ССО' },
      },
      {
        hint: 'Командний пункт оперативного командування',
        code: '10031002230000009800',
        amp: { [amps.specialHeadquarters]: 'ОК' },
      },
      {
        hint: 'Командний пункт операційного командування Повітряних Сил',
        code: '10031002230000009800',
        amp: {
          [amps.specialHeadquarters]: 'ОпК',
          [amps.higherFormation]: 'ПС',
        },
      },
      {
        hint: 'Командний пункт повітряного командування',
        code: '10031002230000009800',
        amp: { [amps.specialHeadquarters]: 'ПвК' },
      },
      {
        hint: 'Командний пункт оперативного угруповання військ (сил)',
        code: '10031002230000009800',
        amp: { [amps.specialHeadquarters]: 'ОУВ (с)' },
      },
      {
        hint: 'Командний пункт морського Командування Військово-Морських Сил ',
        code: '10031002220000009800',
        amp: {
          [amps.specialHeadquarters]: 'МК',
          [amps.higherFormation]: 'ВМС',
        },
      },
      {
        hint: 'Командний пункт морської піхоти Військово-Морських Сил',
        code: '10031002220000009800',
        amp: {
          [amps.specialHeadquarters]: 'МП',
          [amps.higherFormation]: 'ВМС',
        },
      },
      {
        hint: 'Командний пункт оперативно-тактичного угруповання',
        code: '10031002220000009800',
        amp: { [amps.specialHeadquarters]: 'ОТУ' },
      },
      {
        hint: 'Командний пункт корпусу резерву',
        code: '10031002220000009800',
        amp: { [amps.specialHeadquarters]: 'КР' },
      },
      {
        hint: `Стаціонарний незахищений пункт управління Командування Сухопутних військ (реалізація функції генерування)`,
        code: '10031002240000009800',
        amp: { [amps.specialHeadquarters]: 'КСВ' },
      },
      {
        hint: 'Стаціонарний незахищений пункт управління Командування Повітряних Сил (реалізація функції генерування)',
        code: '10031002240000009800',
        amp: { [amps.specialHeadquarters]: 'КПС' },
      },
      {
        hint: 'Пункт управління Командування Військово-Морських Сил (реалізація функції генерування)',
        code: '10031002240000009800',
        amp: { [amps.specialHeadquarters]: 'КВМС' },
      },
      {
        hint: 'Стаціонарний незахищений пункт управління Командування Сил логістики (реалізація функції генерування)',
        code: '10031002240000009800',
        amp: { [amps.specialHeadquarters]: 'КСЛ' },
      },
      {
        hint: 'Стаціонарний незахищений пункт управління Командування Сил підтримки (реалізація функції генерування)',
        code: '10031002240000009800',
        amp: { [amps.specialHeadquarters]: 'КСП' },
      },
      {
        hint: `Стаціонарний незахищений пункт управління Командування військ зв'язку та кібернетичної безпеки (реалізація функції генерування)`,
        code: '10031002240000009800',
        amp: { [amps.specialHeadquarters]: 'КВЗ' },
      },
      {
        hint: 'Стаціонарний незахищений пункт управління Командування Медичних сил (реалізація функції генерування)',
        code: '10031002240000009800',
        amp: { [amps.specialHeadquarters]: 'КМС' },
      },
      {
        hint: 'Пункт управління Державної прикордонної служби (ДПС)',
        code: '10031002240000009800',
        amp: { [amps.specialHeadquarters]: 'ДПС' },
      },
      {
        hint: 'Пункт управління Державної служби спеціального зв\'язку та захисту інформації (ДССЗЗІ)',
        code: '10031002240000009800',
        amp: { [amps.specialHeadquarters]: 'ДССЗЗІ' },
      },
      {
        hint: 'Пункт управління Міністерства юстиції',
        code: '10031002240000009800',
        amp: { [amps.specialHeadquarters]: 'Мін\'юст' },
      },
      {
        hint: 'Пункт управління апарату Національної поліції',
        code: '10031002240000009800',
        amp: { [amps.specialHeadquarters]: 'НП' },
      },
      {
        hint: 'Пункт управління Головного управління Національної гвардії',
        code: '10031002240000009800',
        amp: { [amps.specialHeadquarters]: 'НГ' },
      },
      {
        hint: 'Пункт управління Центрального управління Служби безпеки',
        code: '10031002240000009800',
        amp: { [amps.specialHeadquarters]: 'СБ' },
      },
      {
        hint: 'Командний пункт механізованої бригади',
        code: '10031002181211020000',
        amp: {},
      },
      {
        hint: 'Командний пункт мотопіхотної бригади',
        code: '10031002181211040000',
        amp: {},
      },
      {
        hint: 'Командно-спостережний пункт гірсько-піхотного батальйону',
        code: '10031002161211000027',
        amp: {},
      },
      {
        hint: 'Командно-спостережний пункт танкової роти',
        code: '10031002151205000000',
        amp: {},
      },
      {
        hint: 'Командно-спостережний пункт танкового взвода',
        code: '10031002141205000000',
        amp: {},
      },
    ],
  },
  {
    name: 'Загальновійськові',
    children: [
      {
        hint: 'Механізована бригада',
        code: '10031000181211020000',
        amp: {},
      },
      {
        hint: 'Гірсько-піхотна бригада',
        code: '10031000181211000027',
        amp: {},
      },
      {
        hint: 'Окрема бригада армійської авіації',
        code: '10031000181206000000',
        amp: {},
      },
      {
        hint: 'Вертолітна ескадрилья окремої бригади армійської авіації (бойова)',
        code: '10031000161206000000',
        amp: {},
      },
      {
        hint: 'Бригада Національної гвардії оперативного призначення',
        code: '10031000181211040000',
        amp: { [amps.higherFormation]: 'ОП' },
      },
      {
        hint: 'Загін морської охорони',
        code: '10031000001701000500',
        amp: {},
      },
      {
        hint: 'Прикордонний загін',
        code: '10031000181211000500',
        amp: {},
      },
      {
        hint: 'Окрема бригада територіальної оборони',
        code: '10031000181211040000',
        amp: { [amps.higherFormation]: 'ТрО' },
      },
      {
        hint: 'Відділ прикордонної служби',
        code: '10031000151211000500',
        amp: {},
      },
      {
        hint: 'Контрольно-перепускний пункт (автомобільний)',
        code: '10032500001303000000',
        amp: { [amps.additionalInformation]: 'Авт' },
      },
      {
        hint: 'Контрольно-перепускний пункт (залізничний)',
        code: '10032500001303000000',
        amp: { [amps.additionalInformation]: 'Зал' },
      },
      {
        hint: 'Контрольно-перепускний пункт (паромний)',
        code: '10032500001303000000',
        amp: { [amps.additionalInformation]: 'Пар' },
      },
      {
        hint: 'Контрольно-перепускний пункт (річковий)',
        code: '10032500001303000000',
        amp: { [amps.additionalInformation]: 'Річк' },
      },
      {
        hint: 'Контрольно-перепускний пункт (морський)',
        code: '10032500001303000000',
        amp: { [amps.additionalInformation]: 'Мор' },
      },
      {
        hint: 'Мотопіхотний батальйон',
        code: '10031000161211040000',
        amp: {},
      },
      {
        hint: 'Танковий батальйон',
        code: '10031000161205000000',
        amp: {},
      },
      {
        hint: 'Гірсько-штурмовий батальйон',
        code: '10031000161211000127',
        amp: {},
      },
      {
        hint: 'Механізований взвод',
        code: '10031000141211020000',
        amp: {},
      },
      {
        hint: 'Механізований взвод на БТР',
        code: '10031000141211020051',
        amp: {},
      },
      {
        hint: 'Рота вогневої підтримки',
        code: '10031000150000000000',
        amp: { [amps.specialHeadquarters]: 'ВП' },
      },
      {
        hint: 'Взвод снайперів',
        code: '10031000141215000000',
        amp: {},
      },
      {
        hint: 'Взвод управління',
        code: '10031000140000000008',
        amp: {},
      },
      {
        hint: 'Протитанкове відділення',
        code: '10031000121204000000',
        amp: {},
      },
      {
        hint: 'Вихідний рубіж, вихідний рубіж для форсування, рубіж регулювання',
        code: '10032500001410000000ld',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          nodalPointIcon: NODAL_POINT_ICONS.CROSS_CIRCLE,
          shownNodalPointAmplifiers: [ 0, 1 ],
          lineType: types.dashed.value,
          color: '#3366ff',
        },
      },
      {
        hint: 'Рубіж розгортання у колони',
        code: '10032500001100000000rrbk',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          nodalPointIcon: NODAL_POINT_ICONS.CROSS_CIRCLE,
          shownNodalPointAmplifiers: [ 0, 1 ],
          lineType: types.dashed.value,
          pointAmplifier: { [amps.N]: 'PL РРБК' },
          color: '#3366ff',
        },
      },
      {
        hint: 'Рубіж переходу в атаку (введення в бій, розгортання для контратаки)',
        code: '10032500001100000000rpa',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          nodalPointIcon: NODAL_POINT_ICONS.CROSS_CIRCLE,
          shownNodalPointAmplifiers: [ 0, 1 ],
          lineType: types.dashed.value,
          pointAmplifier: { [amps.N]: 'PL РПА' },
          color: '#3366ff',
        },
      },
      {
        hint: 'Рубіж оборони (позиція), зайнятий військами',
        code: '10032500001401000000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          nodalPointIcon: NODAL_POINT_ICONS.CROSS_CIRCLE,
          shownNodalPointAmplifiers: [ 0, 1 ],
          lineType: types.waved.value,
          color: '#3366ff',
        },
      },
      {
        hint: 'Вогневий рубіж',
        code: '10032500001521000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Рубіж загороджувального вогню підрозділу',
        code: '10032500000170020000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          left: ENDS_STROKE1,
          right: ENDS_STROKE1,
          intermediateAmplifier: { [amps.W]: '№ 1' },
          shownIntermediateAmplifiers: [ 0 ],
          color: '#3366ff',
        },
      },
      {
        hint: 'Рубіж дії підрозділу',
        code: '10032500000170010000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          color: '#3366ff',
        },
      },
      {
        hint: 'Район зосередження',
        code: '10032500001502000000',
        amp: {
          isSvg: true,
          type: entityKind.AREA,
          pointAmplifier: { [amps.T]: 'AA' },
          color: '#3366ff',
        },
      },
      {
        hint: 'Район оборони',
        code: '10032500001512000000',
        amp: {
          isSvg: true,
          type: entityKind.AREA,
          color: '#3366ff',
        },
      },
      {
        hint: 'Район базування військової частини, підрозділу авіації',
        code: '10032500001204000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Базовий табір бригади',
        code: '10031000181409000000',
        amp: {},
      },
      {
        hint: 'Межа смуги вогню основного сектора обстрілу',
        code: '10032500001405000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
        },
      },
      {
        hint: 'Ділянка прориву',
        code: '10032500003402000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Ділянка висадки морського десанту (пункт висадки)',
        code: '10032500002104000000',
        amp: {},
      },
      {
        hint: 'Ділянка форсування',
        code: '10032500002713000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
        },
      },
      {
        hint: 'Район десантування (висадки розвідгруп)',
        code: '10032500001508000000',
        amp: {
          isSvg: true,
          type: entityKind.AREA,
          pointAmplifier: { [amps.T]: 'Дес' },
          color: '#3366ff',
        },
      },
      {
        hint: 'Район розвантаження',
        code: '10032500001506000000',
        amp: {
          isSvg: true,
          type: entityKind.AREA,
          pointAmplifier: { [amps.T]: 'Розвантаж' },
          color: '#3366ff',
        },
      },
      {
        hint: 'Зона приземлення (для евакуації розвідгруп)',
        code: '10032500001507000000',
        amp: {
          isSvg: true,
          type: entityKind.AREA,
          pointAmplifier: { [amps.T]: 'Евак' },
          color: '#3366ff',
        },
      },
      {
        hint: 'Вихідний район десантування (район завантаження)',
        code: '10032500001509000000',
        amp: {
          isSvg: true,
          type: entityKind.AREA,
          pointAmplifier: { [amps.T]: 'ВРД' },
          color: '#3366ff',
        },
      },
      {
        hint: 'Район базування',
        code: '10032500000170030000',
        amp: {
          isSvg: true,
          type: entityKind.AREA,
        },
        color: '#3366ff',
      },
      {
        hint: 'Посадочна площадка',
        code: '10032000001213050000',
        amp: {},
      },
      {
        hint: 'Площадка підскоку',
        code: '10032500003103000000',
        amp: {
          isSvg: true,
          type: entityKind.AREA,
          pointAmplifier: { [amps.T]: 'FAPR' },
          color: '#3366ff',
        },
      },
      {
        hint: 'Майданчик посадочний',
        code: '10032500000170040000',
        amp: {
          isSvg: true,
          type: entityKind.AREA,
          pointAmplifier: { [amps.T]: 'МПос' },
          color: '#3366ff',
        },
      },
      {
        hint: 'Майданчик підскоку, засідки',
        code: '10032500000170050000',
        amp: {
          isSvg: true,
          type: entityKind.AREA,
          pointAmplifier: { [amps.T]: 'МПідск' },
          color: '#3366ff',
        },
      },
      {
        hint: 'Майданчик евакуації',
        code: '10032500001507000000',
        amp: {
          isSvg: true,
          type: entityKind.AREA,
          pointAmplifier: { [amps.T]: 'ЕВАК' },
          color: '#3366ff',
        },
      },
      {
        hint: 'Район висадки тактичного повітряного десанту',
        code: '10032500000170030000',
        amp: {
          isSvg: true,
          type: entityKind.AREA,
          color: '#3366ff',
        },
      },
      {
        hint: 'Атакувати вогнем – вогневе ураження противника без зближення та захоплення його об\'єктів',
        code: '10032500000170060000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Підрозділи, які зупинені на рубежі (атака відбита)',
        code: '10032500000170070000',
        amp: {
          isSvg: true,
          type: entityKind.CURVE,
          right: ENDS_ARROW1,
          color: '#3366ff',
        },
      },
      {
        hint: 'Напрямок головного удару',
        code: '10032500001514030000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Інший напрямок удару',
        code: '10032500001514040000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Хибний напрямок наступу',
        code: '10032500001514060000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Засідка – ведення раптового вогню з підготовлених позицій по противнику, який рухається або зупинився',
        code: '10032500001417000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
        },
        color: '#3366ff',
      },
      {
        hint: 'Рубіж блокування противника (блокування)',
        code: '10032500003401000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Обхід маневр навколо перешкоди або позицій противника з метою збереження темпу просування',
        code: '10032500003403000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Втягування противника у  вогневий район (мішок), обмеження руху противника у визначеній зоні',
        code: '10032500003404000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Прочісування',
        code: '10032500003405000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Дезорганізувати - порушення бойового порядку противника',
        code: '10032500003410000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Сковування противника',
        code: '10032500001512040000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Вклинення',
        code: '10032500003418000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
        },
        color: '#3366ff',
      },
      {
        hint: 'Затримати - затримання маневру противника у визначеному місці та у визначений час',
        code: '10032500003408000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Демонструвати - ввести противника в оману демонстрацією сили без контакту з противником',
        code: '10032500000170080000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: `Хибні дії – хибні дії, які здійснюються для примушення противника до використання резервів або маневру ними, викриття системи вогню, перенесення вогню засобів вогневої підтримки`,
        code: '10032500000170090000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Відхід – здійснення відходу без контакту з противником',
        code: '10032500003420000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Відхід під натиском',
        code: '10032500003424000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Замінити підрозділи – здійснення заміни підрозділів',
        code: '10032500003419000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Переслідувати – зайняття позицій на маршрутах відходу противника в ході переслідування',
        code: '10032500000170100000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Захоплення ‒ знищити противника у визначеному районі, захопити його',
        code: '10032500003423000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: `Прикрити - забезпечення безпеки головних сил затримкою, дезорганізацією бойового порядку, введенням в оману противника`,
        code: '10032500003422010000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Охороняти - захистити головні сили від раптового нападу противника, затримати просування противника',
        code: '10032500003422020000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Спостерігати - спостереження, виявлення та передача інформації про противника головним силам',
        code: '10032500003422030000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Просування та заміна  – рух за першим ешелоном в готовності до його заміни',
        code: '10032500003412000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          pointAmplifier: { [amps.T]: '' },
          color: '#3366ff',
        },
      },
      {
        hint: 'Просування та підтримка підрозділів – рух за першим ешелоном та підтримка його дії',
        code: '10032500003413000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          pointAmplifier: { [amps.T]: '' },
          color: '#3366ff',
        },
      },
      {
        hint: `Знищення – нанесення втрат (пошкоджень), отримавши які ціль (об'єкт, підрозділ) повністю втрачає свою боєздатність`,
        code: '10032500003409000000',
        amp: {},
      },
      {
        hint: `Подавити – нанесення втрат (пошкоджень) та створення умов, за яких ціль (об'єкт, підрозділ) тимчасово втрачає боєздатність`,
        code: '10032500003416000000',
        amp: {},
      },
      {
        hint: `Запобігти – не допустити підходу противника на відстань, з якої він буде здатен ефективно застосовувати засоби ураження`,
        code: '10032500003414000000',
        amp: {},
      },
      {
        hint: 'Ізолювання противника',
        code: '10032500003415000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Зайняти - зайняття визначеного району без вогневого контакту з противником',
        code: '10032500003417000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: `Закріпитися – захопити (зайняти) та утримувати позицію, яку противник може використати в ході ведення бою та запобігти її руйнуванню`,
        code: '10032500000170110000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Запобігти – запобігти захопленню визначеної ділянки місцевості (об\'єкту) противником',
        code: '10032500001512050000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: `Взяти під контроль – встановлення контролю над визначеним районом з метою недопущення оволодіння ним противником`,
        code: '10032500003421000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Напрямок удару своєї авіації',
        code: '10032500001406010000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          pointAmplifier: { [amps.T]: 'AVON', [amps.W]: '' },
        },
      },
      {
        hint: 'Імовірний напрямок удару повітряного противника',
        code: '10062500001514010000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#ff0404',
        },
      },
      {
        hint: 'Рубіж постановки завад (придушення ППО)',
        code: '10032500000170120000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          pointAmplifier: { [amps.T]: 'SEAD' },
          color: '#ff0404',
        },
      },
      {
        hint: 'Рубіж пуску КР, ПРР',
        code: '10032500000170130000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          color: '#ff0404',
          lineType: types.dashed.value,
          right: ENDS_ARROW2,
        },
      },
      {
        hint: 'Зона чергування постановників завад',
        code: '10032500001408000000red', // исходный код линии - '10062500001701000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#ff0404',
        },
      },
      {
        hint: 'Зона баражування літаків-розвідників (ДРЛВ, ДРЛВУ)',
        code: '10032500000170140000',
        amp: {
          isSvg: true,
          type: entityKind.AREA,
          color: '#ff0404',
          lineType: types.dashed.value,
          intermediateAmplifierType: MARK_TYPE.ARROW_30_FILL,
          shownIntermediateAmplifiers: [ 0 ],
        },
      },
      {
        hint: 'Головний напрямок атаки',
        code: '10032500001406020000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          pointAmplifier: { [amps.T]: 'MAIN', [amps.W]: '' },
        },
      },
      {
        hint: 'Підтримка атаки',
        code: '10032500001406030000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          pointAmplifier: { [amps.T]: 'SUP', [amps.W]: '' },
        },
      },
      {
        hint: 'Хибна атака',
        code: '10032500001406050000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          pointAmplifier: { [amps.T]: 'FEINT', [amps.W]: '' },
        },
      },
    ],
  },
  {
    name: 'Ракетні війська і артилерія',
    children: [
      {
        hint: 'Артилерійська бригада',
        code: '10031000181303000000',
        amp: {},
      },
      {
        hint: 'Бригадна артилерійська група',
        code: '10031004171303000000',
        amp: {},
      },
      {
        hint: 'Ракетна бригада',
        code: '10031000181307000000',
        amp: {},
      },
      {
        hint: 'Реактивна артилерійська бригада',
        code: '10031000181303004100',
        amp: {},
      },
      {
        hint: 'Реактивний артилерійський полк',
        code: '10031000171303004100',
        amp: {},
      },
      {
        hint: 'Артилерійський полк',
        code: '10031000171303000000',
        amp: {},
      },
      {
        hint: 'Артилерійський дивізіон',
        code: '10031000161303000000',
        amp: {},
      },
      {
        hint: 'Гаубичний самохідний артилерійський дивізіон',
        code: '10031000161303010000',
        amp: {},
      },
      {
        hint: 'Реактивний артилерійський дивізіон',
        code: '10031000161303004100',
        amp: {},
      },
      {
        hint: 'Протитанковий артилерійський дивізіон',
        code: '10031000161204000000',
        amp: {},
      },
      {
        hint: 'Розвідувальний артилерійський дивізіон',
        code: '10031000161303030000',
        amp: {},
      },
      {
        hint: 'Ракетний дивізіон',
        code: '10031000161307000000',
        amp: {},
      },
      {
        hint: 'Гаубична самохідна артилерійська батарея',
        code: '10031000151303010000',
        amp: {},
      },
      {
        hint: 'Артилерійська батарея',
        code: '10031000151303000000',
        amp: {},
      },
      {
        hint: 'Реактивна артилерійська батарея',
        code: '10031000151303004100',
        amp: {},
      },
      {
        hint: 'Стартова батарея',
        code: '10031000151307000000',
        amp: {},
      },
      {
        hint: 'Протитанкова артилерійська батарея',
        code: '10031000151204000000',
        amp: {},
      },
      {
        hint: 'Батарея звукової розвідки',
        code: '10031000151303036200',
        amp: {},
      },
      {
        hint: 'Батарея радіолокаційної розвідки',
        code: '10031000151303035000',
        amp: {},
      },
      {
        hint: 'Батарея артилерійської розвідки',
        code: '10031000151303030000',
        amp: {},
      },
      {
        hint: 'Батарея безпілотних літальних апаратів',
        code: '10031000151219000000',
        amp: {},
      },
      {
        hint: 'Метеорологічна батарея',
        code: '10031000151303003200',
        amp: {},
      },
      {
        hint: 'Гаубичний самохідний артилерійський взвод',
        code: '10031000141303010000',
        amp: {},
      },
      {
        hint: 'Артилерійський взвод',
        code: '10031000141303000000',
        amp: {},
      },
      {
        hint: 'Реактивний артилерійський взвод',
        code: '10031000141303004100',
        amp: {},
      },
      {
        hint: 'Розрахунок пускової установки',
        code: '10031000111303005900',
        amp: {},
      },
      {
        hint: 'Взвод управління дивізіону',
        code: '10031000141303000008',
        amp: {},
      },
      {
        hint: 'Протитанковий артилерійський взвод',
        code: '10031000141204000000',
        amp: {},
      },
      {
        hint: 'Мінометна батарея',
        code: '10031000151308000000',
        amp: {},
      },
      {
        hint: 'Мінометний взвод',
        code: '10031000141308000000',
        amp: {},
      },
      {
        hint: 'Взвод оптичної розвідки',
        code: '10031000141303032200',
        amp: {},
      },
      {
        hint: 'Топогеодезичний взвод',
        code: '10031000141421000000',
        amp: {},
      },
      {
        hint: 'Відділення транспортування і перевантаження',
        code: '10031000121636003400',
        amp: {},
      },
      {
        hint: 'Вогонь по одиночній цілі із зазначенням номера цілі',
        code: '10032500001603000000',
        amp: {},
      },
      {
        hint: 'Зосереджений вогонь',
        code: '10032500002408020000',
        amp: {
          isSvg: true,
          type: entityKind.RECTANGLE,
          pointAmplifier: { [amps.W]: '№' },
        },
      },
      {
        hint: 'Одинарний нерухомий загороджувальний вогонь (воневий вал)',
        code: '10032500002407010000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
          pointAmplifier: { [amps.N]: 'N', [amps.B]: 'B' },
        },
      },
      {
        hint: 'Одинарний нерухомий загороджувальний вогонь (воневий вал)',
        code: '10032500000170780000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Рухомий загороджувальний вогонь',
        code: '10032500000170150000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
          pointAmplifier: { [amps.N]: 'N', [amps.B]: 'B', [amps.T]: 'T' },
        },
      },
      {
        hint: 'Послідовне зосередження вогню',
        code: '10032500000170160000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
          pointAmplifier: { [amps.T]: 'T', [amps.N]: '101' },
          params: { count: 3, number: 101 },
        },
      },
      {
        hint: 'Зона цілі',
        code: '10032500002408050000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
          pointAmplifier: { [amps.N]: '№' },
        },
      },
      {
        hint: 'Смуга ураження керованими снарядами дивізіону (Олово) із зазначенням смуг (зон) ураження батарей',
        code: '10032500000170170000',
        amp: {
          isSvg: true,
          type: entityKind.OLOVO,
          params: { directions: 3, zones: 4, start: 11, title: 'Олово' },
        },
      },
      {
        hint: 'Район дистанційного мінування місцевості',
        code: '10032500002708000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          pointAmplifier: { [amps.T]: '', [amps.W]: '' },
        },
      },
      {
        hint: 'Район розповсюдження агітаційного матеріалу',
        code: '10032500000170180000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Район особливої уваги',
        code: '10032500001202000000',
        amp: {
          isSvg: true,
          type: entityKind.POLYGON,
          color: '#3366ff',
          pointAmplifier: { [amps.T]: 'РОУ' },
        },
      },
      {
        hint: 'Основний напрямок стрільби (пуску)',
        code: '10032500000170790000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          color: '#3366ff',
          right: ENDS_ARROW2,
        },
      },
      {
        hint: 'Вогнева позиція',
        code: '10032500002501000000',
        amp: {},
      },
      {
        hint: 'Стартова позиція',
        code: '10032500002503000000',
        amp: {},
      },
      {
        hint: 'Технічна позиція',
        code: '10032500002504000000',
        amp: {},
      },
      {
        hint: 'Район вогневих позицій',
        code: '10032500002405000000rvp',
        amp: {
          isSvg: true,
          type: entityKind.RECTANGLE,
          color: '#3366ff',
          intermediateAmplifierType: 'text',
          shownIntermediateAmplifiers: [ 0, 2 ],
          intermediateAmplifier: { [amps.N]: 'РВП' },
        },
      },
      {
        hint: 'Основний позиційний район',
        code: '10032500002405000000opr',
        amp: {
          isSvg: true,
          type: entityKind.RECTANGLE,
          color: '#3366ff',
          intermediateAmplifierType: 'text',
          shownIntermediateAmplifiers: [ 0, 2 ],
          intermediateAmplifier: { [amps.N]: 'ОПР' },
        },
      },
      {
        hint: 'Рубіж досяжності вогневих засобів',
        code: '10032500000170190000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: 'transparent',
        },
      },
      {
        hint: 'Ракетний удар',
        code: '10032500000170200000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
          pointAmplifier: { [amps.N]: '', [amps.T]: '', [amps.W]: '', [amps.B]: '' },
        },
      },
      {
        hint: 'Район зосередження',
        code: '10032500001502000000',
        amp: {
          isSvg: true,
          type: entityKind.AREA,
          color: '#3366ff',
          pointAmplifier: { [amps.T]: 'AA' },
        },
      },
      {
        hint: 'Район евакуації',
        code: '10032500001507000000',
        amp: {
          isSvg: true,
          type: entityKind.AREA,
          color: '#3366ff',
          pointAmplifier: { [amps.T]: 'Евак' },
        },
      },
      {
        hint: 'Піші дозорні',
        code: '10032700001101030000',
        amp: {},
      },
      {
        hint: 'Зона детальної розвідки бригади',
        code: '10032500000170230000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          color: '#3366ff',
          pointAmplifier: { [amps.N]: 'ЗДР' },
        },
      },
      {
        hint: 'Зона оглядової розвідки бригади',
        code: '10032500000170220000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          color: '#3366ff',
          pointAmplifier: { [amps.N]: 'ЗОР' },
        },
      },
      {
        hint: 'Розвідка боєм',
        code: '10032500001520000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
        },
        color: '#3366ff',
      },
      {
        hint: 'Підрозділ (група), який проводить пошук (наліт), із зазначенням належності',
        code: '10032500000170240000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Розвідувальний загін СпП',
        code: '10031004151213006300',
        amp: {},
      },
      {
        hint: 'Розвідувальна група СпП',
        code: '10031004131213006300',
        amp: {},
      },
      {
        hint: 'Район висадки розвідувальної групи із зазначенням складу, часу і дати висадки та способу висадки',
        code: '10032500000170260000',
        amp: {
          isSvg: true,
          type: entityKind.AREA,
          pointAmplifier: { [amps.T]: 'П(В)' },
        },
      },
      {
        hint: 'Пункт збору військовополонених',
        code: '10032500003208000000',
        amp: {},
      },
      {
        hint: 'Район зосередження військовополонених',
        code: '10032500003102000000',
        amp: {
          isSvg: true,
          type: entityKind.AREA,
          pointAmplifier: { [amps.T]: 'EPWHA' },
        },
      },
      {
        hint: 'Пускова установка БПЛА (АПП)',
        code: '10031000001219000021',
        amp: {},
      },
      {
        hint: 'Окремий центр збору, обробки, аналізу інформації технічних видів розвідки',
        code: '10031000001501000000',
        amp: {},
      },
      {
        hint: 'Регіональний центр РЕР, Центр РЕР ВМС',
        code: '10031000181501000000',
        amp: {},
      },
      {
        hint: 'Полк радіо та радіотехнічної розвідки',
        code: '10031000171511000000',
        amp: {},
      },
      {
        hint: 'Окремий центр РЕР',
        code: '10031000161511000000',
        amp: {},
      },
      {
        hint: 'Маневрений центр РЕР',
        code: '10031000161511000051',
        amp: {},
      },
      {
        hint: 'Рота РРТР',
        code: '10031000151213005751',
        amp: {},
      },
      {
        hint: 'Взвод РРТР',
        code: '10031000141213005751',
        amp: {},
      },
    ],
  },
  {
    name: 'Пункти спостереження',
    children: [
      {
        hint: 'Пункт спостереження (загальне позначення)',
        code: '10032500001601000000',
        amp: {},
      },
      {
        hint: 'Розвідувальний пункт спостереження',
        code: '10032500001602010000',
        amp: {},
      },
      {
        hint: 'Передовий пункт спостереження',
        code: '10032500001602020000',
        amp: {},
      },
      {
        hint: 'Пункт спостереження за хімічною та ядерною обстановкою',
        code: '10032500001602030000',
        amp: {},
      },
      {
        hint: 'Автоматизований пункт спостереження (обладнаний сенсором або датчиком)',
        code: '10032500001602040000',
        amp: {},
      },
      {
        hint: 'Пункт спостереження командира (начальника)',
        code: '10032500001602050000',
        amp: {},
      },
    ],
  },
  {
    name: 'Рубежі відкриття вогню',
    children: [
      {
        hint: 'Рубіж відкриття вогню (танків, БМП, стрілецької зброї)',
        code: '10032500000170300000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
        },
      },
      {
        hint: 'Зона суцільного багатошарового протитанкового і стрілецького вогню',
        code: '10032500000170310000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          lineType: types.chain.value,
        },
      },
    ],
  },
  {
    name: 'Види переправ через водну перешкоду',
    children: [
      {
        hint: 'Міст',
        code: '10031500001301000000',
        amp: {},
      },
      {
        hint: 'Міст на мобільній базі',
        code: '10031500001302000000',
        amp: {},
      },
      {
        hint: 'Понтонний міст',
        code: '10031500001304000000',
        amp: {},
      },
      {
        hint: 'Складний міст',
        code: '10031500001305000000',
        amp: {},
      },
      {
        hint: 'Каркасний (пустотілий) міст',
        code: '10031500001306000000',
        amp: {},
      },
      {
        hint: 'Мостова переправа',
        code: '10032500002714000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'В брід',
        code: '10032500002716000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Паромна переправа',
        code: '10032500002907000000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          color: '#3366ff',
          right: ENDS_ARROW2,
          left: ENDS_ARROW2,
        },
      },
      {
        hint: 'На підручних засобах',
        code: '10032500002908000000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          color: '#3366ff',
          left: ENDS_FORK,
          right: ENDS_FORK,
        },
      },
      {
        hint: 'Хибний міст',
        code: '10031501001305000000',
        amp: {},
      },
    ],
  },
  {
    name: 'Протиповітряна оборона',
    children: [
      {
        hint: 'Командний пункт зенітного ракетного полку',
        code: '10031002171301020000',
        amp: {},
      },
      {
        hint: 'Командний пункт зенітного ракетного (ракетно-артилерійського) дивізіону',
        code: '10031002161301020000',
        amp: {},
      },
      {
        hint: 'Командний пункт батареї',
        code: '10031002151301020000',
        amp: {},
      },
      {
        hint: 'Зенітний ракетний взвод',
        code: '10031000141301020000',
        amp: {},
      },
      {
        hint: 'Зенітний ракетний (ракетно-артилерійський) дивізіон',
        code: '10031000161301020000',
        amp: {},
      },
      {
        hint: 'Взвод забезпечення',
        code: '10031000141611000000',
        amp: { [amps.additionalInformation]: 'ТхЗ' },
      },
      {
        hint: 'Взвод (батарея) управління та радіолокаційної розвідки (начальника протиповітряної оборони)',
        code: '10031000141301005008',
        amp: {},
      },
      {
        hint: 'Група регламенту та ремонту',
        code: '10031000151611000000',
        amp: {},
      },
      {
        hint: 'Технічна батарея',
        code: '10031000151301003100',
        amp: { [amps.uniqueDesignation]: 'тб' },
      },
      {
        hint: 'Сектор відповідальності підрозділу ППО',
        code: '10032500000170320000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Кочуюча БМ',
        code: '10032500000170330000',
        amp: {
          isSvg: true,
          type: entityKind.CURVE,
          lineType: types.dashed.value,
          color: '#3366ff',
          right: ENDS_ARROW2,
          left: ENDS_ARROW2,
        },
      },
      {
        hint: 'Зона розвідки повітряного противника',
        code: '10032500000170190000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: 'transparent',
        },
      },
    ],
  },
  {
    name: 'Зв\'язок',
    children: [
      {
        hint: 'Окрема бригада зв\'язку',
        code: '10031000181110000000',
        amp: {},
      },
      {
        hint: 'Окремий полк зв\'язку',
        code: '10031000171110000000',
        amp: {},
      },
      {
        hint: 'Інформаційно-телекомунікаційний вузол',
        code: '10031000161110004700',
        amp: { [amps.additionalInformation]: 'ІТВ' },
      },
      {
        hint: 'Польовий вузол зв\'язку',
        code: '10031000161110004751',
        amp: { [amps.additionalInformation]: 'ВЗ' },
      },
      {
        hint: 'Підрозділ із засобами радіозв\'язку',
        code: '10031000001110010000',
        amp: { [amps.additionalInformation]: 'РЗ' },
      },
      {
        hint: 'Підрозділ із засобами радіорелейного зв\'язку',
        code: '10031000001110020000',
        amp: { [amps.additionalInformation]: 'РРЗ' },
      },
      {
        hint: 'Підрозділ із засобами супутникового зв\'язку',
        code: '10031000001110040000',
        amp: { [amps.additionalInformation]: 'СЗ' },
      },
      {
        hint: 'Станція радіозв\'язку',
        code: '10031500002001000000',
        amp: { [amps.additionalInformation]: 'РЗ' },
      },
      {
        hint: 'Станція транкінгового зв\'язку',
        code: '10031500002001000000',
        amp: { [amps.additionalInformation]: 'ТрЗ' },
      },
      {
        hint: 'Станція радіорелейного зв\'язку',
        code: '10031500002001000000',
        amp: { [amps.additionalInformation]: 'РРЗ' },
      },
      {
        hint: 'Станція тропосферного зв\'язку',
        code: '10031500002001000000',
        amp: { [amps.additionalInformation]: 'ТРЗ' },
      },
      {
        hint: 'Станція супутникового зв\'язку',
        code: '10031500002001000000',
        amp: { [amps.additionalInformation]: 'CЗ' },
      },
      {
        hint: 'Лінія радіозв\'язку',
        code: '10032500000170340000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          color: '#3366ff',
          intermediateAmplifierType: 'text',
          intermediateAmplifier: { [amps.N]: 'РЗ' },
          shownIntermediateAmplifiers: [ 0 ],
        },
      },
      {
        hint: 'Лінія транкінгового зв\'язку',
        code: '10032500000170350000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          color: '#3366ff',
          intermediateAmplifierType: 'text',
          intermediateAmplifier: { [amps.N]: 'ТрЗ' },
          shownIntermediateAmplifiers: [ 0 ],
        },
      },
      {
        hint: 'Лінія радіорелейного зв\'язку',
        code: '10032500000170360000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          color: '#3366ff',
          intermediateAmplifierType: 'text',
          intermediateAmplifier: { [amps.N]: 'РРЗ' },
          shownIntermediateAmplifiers: [ 0 ],
        },
      },
      {
        hint: 'Лінія тропосферного зв\'язку',
        code: '10032500000170370000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          color: '#3366ff',
          intermediateAmplifierType: 'text',
          intermediateAmplifier: { [amps.N]: 'TРЗ' },
          shownIntermediateAmplifiers: [ 0 ],
        },
      },
      {
        hint: 'Лінія супутникового зв\'язку',
        code: '10032500000170380000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          color: '#3366ff',
          intermediateAmplifierType: 'text',
          intermediateAmplifier: { [amps.N]: 'CЗ' },
          shownIntermediateAmplifiers: [ 0 ],
        },
      },
      {
        hint: 'Лінія проводового зв\'язку',
        code: '10032500000170390000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          color: '#3366ff',
          intermediateAmplifierType: 'text',
          intermediateAmplifier: { [amps.N]: 'ПрЗ' },
          shownIntermediateAmplifiers: [ 0 ],
        },
      },
      {
        hint: 'Вісь (рокада) зв\'язку в опорній мережі зв\'язку',
        code: '10032500000170400000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          color: '#3366ff',
          intermediateAmplifierType: 'text',
          intermediateAmplifier: { [amps.N]: '2E1-150М-64М' },
          shownIntermediateAmplifiers: [ 0 ],
          strokeWidth: 16,
        },
      },
      {
        hint: 'Військовий супутник зв\'язку',
        code: '10030500001111000000',
        amp: {},
      },
      {
        hint: 'Цивільний супутник зв\'язку',
        code: '10030500001206000000',
        amp: {},
      },
      {
        hint: 'Комп\'ютерні системи (АСУ, ІС)',
        code: '10031500002005000000',
        amp: {},
      },
      {
        hint: 'База ремонту і зберігання (зберігання і утилізації) засобів зв\'язку',
        code: '10031000001110000038',
        amp: {},
      },
      {
        hint: 'Центральний вузол фельд\'єгерсько-поштового зв\'язку',
        code: '10031000171627000000',
        amp: {},
      },
      {
        hint: 'Вузол фельд\'єгерсько-поштового зв\'язку',
        code: '10031000161627000000',
        amp: {},
      },
      {
        hint: 'Станція фельд\'єгерсько-поштового зв\'язку',
        code: '10031000151627000000',
        amp: {},
      },
      {
        hint: 'Обмінний пункт фельд\'єгерсько-поштового зв\'язку',
        code: '10031000131627000000',
        amp: {},
      },
      {
        hint: 'Експедиція (відділення) фельд\'єгерсько-поштового зв\'язку',
        code: '10031000121627000000',
        amp: {},
      },
      {
        hint: 'Пункт обміну на автомобільному маршруті фельд\'єгерсько-поштового зв\'язку',
        code: '10032500001301000000',
        amp: {
          type: entityKind.POINT,
          [amps.uniqueDesignation1]: 'ФПЗ',
          [amps.staffComments]: 'ФПЗ',
        },
      },
      {
        hint: 'Пункт обміну на залізничному маршруті фельд\'єгерсько-поштового зв\'язку',
        code: '10031000001630000000',
        amp: { [amps.additionalInformation]: 'ФПЗ' },
      },
      {
        hint: 'Автомобіль фельд\'єгерсько-поштового зв\'язку',
        code: '10031500321401000000',
        amp: { [amps.additionalInformation]: 'ФПЗ' },
      },
      {
        hint: 'Автомобіль фельд\'єгерсько-поштового зв\'язку броньований',
        code: '10031500321201050000',
        amp: { [amps.additionalInformation]: 'ФПЗ' },
      },
      {
        hint: 'Потяг (поштовий вагон)',
        code: '10031500361501000000',
        amp: { [amps.additionalInformation]: 'ФПЗ' },
      },
      {
        hint: 'Катер фельд\'єгерсько-поштового зв\'язку',
        code: '10033000001208000000',
        amp: { [amps.additionalInformation]: 'ФПЗ' },
      },
      {
        hint: 'Маршрут фельд\'єгерсько-поштового зв\'язку',
        code: '10032500000170410000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          color: '#3366ff',
          right: ENDS_ARROW2,
        },
      },
      {
        hint: 'Пошта (поштове відділення)',
        code: '10032000001209000000',
        amp: {},
      },
      {
        hint: 'Державне підприємство спеціального зв\'язку',
        code: '10032000000000000000',
        amp: { [amps.specialHeadquarters]: 'ДПСЗ' },
      },
      {
        hint: 'Головне управління урядового фельд\'єгерського зв\'язку',
        code: '10032000000000000000',
        amp: { [amps.specialHeadquarters]: 'ГУУФЗ' },
      },
      {
        hint: 'Центр дій у кіберпросторі',
        code: '10031000161110000000',
        amp: { [amps.uniqueDesignation]: 'КбЦ' },
      },
      {
        hint: 'Загін кіберрозвідки',
        code: '10031000151110000000',
        amp: { [amps.uniqueDesignation]: 'КбР' },
      },
      {
        hint: 'Загін кіберзахисту',
        code: '10031000151110000000',
        amp: { [amps.uniqueDesignation]: 'КбЗ' },
      },
      {
        hint: 'Загін кібератак',
        code: '10031000151110000000',
        amp: { [amps.uniqueDesignation]: 'КбА' },
      },
    ],
  },
  {
    name: 'Озброєння та військова техніка',
    children: [
      {
        hint: 'Радіолокаційна станція',
        code: '10031500002203000000',
        amp: {},
      },
      {
        hint: 'Датчик комплексу РСА',
        code: '10031500002202000000',
        amp: {},
      },
      {
        hint: 'Танк',
        code: '10031500001202000000',
        amp: {},
      },
      {
        hint: 'БМП',
        code: '10031500001201010000',
        amp: {},
      },
      {
        hint: 'БТР',
        code: '10031500001201030000',
        amp: {},
      },
      {
        hint: 'Автомобіль',
        code: '10031500001401000000',
        amp: {},
      },
      {
        hint: 'Загальне позначення мінометів',
        code: '10031500001114000000',
        amp: {},
      },
      {
        hint: 'Міномет малого калібру (до 60 мм)',
        code: '10031500001114010000',
        amp: {},
      },
      {
        hint: 'Міномет середнього калібру (до 107мм)',
        code: '10031500001114020000',
        amp: {},
      },
      {
        hint: 'Міномет великого калібру (107мм і більше)',
        code: '10031500001114030000',
        amp: {},
      },
      {
        hint: 'Легкий (ручний) кулемет',
        code: '10031500001102010000',
        amp: {},
      },
      {
        hint: 'Середній (ротний або станковий) кулемет',
        code: '10031500001102020000',
        amp: {},
      },
      {
        hint: 'Важкий (великокаліберний) кулемет',
        code: '10031500001102030000',
        amp: {},
      },
      {
        hint: 'Гранатомет',
        code: '10031500001103000000',
        amp: {},
      },
      {
        hint: 'Легкий гранатомет (підствольний)',
        code: '10031500001103010000',
        amp: {},
      },
      {
        hint: 'Багатозарядний гранатомет',
        code: '10031500001103020000',
        amp: {},
      },
      {
        hint: 'Важкий (автоматичний) гранатомет',
        code: '10031500001103030000',
        amp: {},
      },
      {
        hint: 'Протитанкова ракета легка',
        code: '10031500001117010000',
        amp: {},
      },
      {
        hint: 'Протитанкова ракета середня',
        code: '10031500001117020000',
        amp: {},
      },
      {
        hint: 'Протитанкова ракета важка',
        code: '10031500001117030000',
        amp: {},
      },
      {
        hint: 'Пускова установка - легкий ПТРК',
        code: '10031500001112010000',
        amp: {},
      },
      {
        hint: 'Пускова установка - середній ПТРК',
        code: '10031500001112020000',
        amp: {},
      },
      {
        hint: 'Пускова установка - важкий ПТРК',
        code: '10031500001112030000',
        amp: {},
      },
      {
        hint: 'Протитанкова гармата',
        code: '10031500351106010000',
        amp: {},
      },
      {
        hint: 'ПТРК (на колісній базі)',
        code: '10031500311112020000',
        amp: {},
      },
      {
        hint: 'ПТРК (на гусеничній базі)',
        code: '10031500331112020000',
        amp: {},
      },
      {
        hint: '122 мм гаубиця, що буксирується',
        code: '10031500351109010000',
        amp: {},
      },
      {
        hint: '152 мм гаубиця, що буксирується',
        code: '10031500351109020000',
        amp: {},
      },
      {
        hint: '122 мм самохідна гаубиця',
        code: '10031500331109010000',
        amp: {},
      },
      {
        hint: '152 мм самохідна гаубиця',
        code: '10031500331109020000',
        amp: {},
      },
      {
        hint: '120 мм самохідна гармата',
        code: '10031500331107010000',
        amp: {},
      },
      {
        hint: '152 мм самохідна гармата',
        code: '10031500331107020000',
        amp: {},
      },
      {
        hint: '203 мм самохідна гармата',
        code: '10031500331107030000',
        amp: {},
      },
      {
        hint: 'Ракетна пускова установка малої дальності',
        code: '10031500321116010000',
        amp: {},
      },
      {
        hint: 'Ракетна пускова установка середньої дальності',
        code: '10031500321116020000',
        amp: {},
      },
      {
        hint: 'Ракетна пускова установка великої дальності',
        code: '10031500321116030000',
        amp: {},
      },
      {
        hint: 'Пускова установка ТР',
        code: '10031500321113000000',
        amp: {},
      },
      {
        hint: '82 мм міномет, що буксирується',
        code: '10031500351114020000',
        amp: {},
      },
      {
        hint: 'Загальне позначення (ПЗРК)',
        code: '10031500001111000000',
        amp: {},
      },
      {
        hint: 'Бойова машина 9А34 (9А35)',
        code: '10031500331111010000',
        amp: {},
      },
      {
        hint: 'Зенітна самохідна установка 2С6',
        code: '10031500331105020000',
        amp: {},
      },
      {
        hint: 'Бойова машина 9А33БМ3',
        code: '10031500321111010000',
        amp: {},
      },
      {
        hint: 'Зенітна самохідна установка 2А6',
        code: '10031500331105010000',
        amp: {},
      },
      {
        hint: 'Зенітна установка ЗУ-23-2',
        code: '10031500311105010000',
        amp: {},
      },
      {
        hint: 'Транспортно-заряджаюча машина',
        code: '10031500321401000000',
        amp: {
          [amps.typeId]: 0,
          [amps.type]: 'ТЗМ',
        },
      },
      {
        hint: 'Радіолокаційна станція',
        code: '10031500312203000000',
        amp: {
          [amps.typeId]: 0,
          [amps.type]: 'П-19',
        },
      },
      {
        hint: 'Командно-штабна машина (без зазначення засобів зв\'язку) на БМП',
        code: '10031500321201020000',
        amp: {},
      },
      {
        hint: 'Командно-штабна машина (без зазначення засобів зв\'язку) на ББМ',
        code: '10031500001201050000',
        amp: { [amps.specialHeadquarters]: 'С2' },
      },
      {
        hint: 'КМУ (1В110, 1В111)',
        code: '10031500321401000000',
        amp: {
          [amps.additionalInformation]: 'КМУ',
          [amps.typeId]: 0,
          [amps.type]: '1В110',
        },
      },
      {
        hint: 'КМУ (1В119, ЛБР – ARM-M1114 )',
        code: '10031500311201050000',
        amp: {
          [amps.additionalInformation]: 'КМУ',
          [amps.typeId]: 0,
          [amps.type]: '1В119',
        },
      },
      {
        hint: 'ПРП – 3 (4)',
        code: '10031500321201010000',
        amp: {
          [amps.typeId]: 0,
          [amps.type]: 'ПРП-3',
        },
      },
      {
        hint: 'СНАР (АРК, AN/TPQ)',
        code: '10031500331201030000',
        amp: {
          [amps.typeId]: 0,
          [amps.type]: 'CHAP',
        },
      },
      {
        hint: 'АЗК-7',
        code: '10031500321401000000',
        amp: {
          [amps.typeId]: 0,
          [amps.type]: 'АЗК-7',
        },
      },
      {
        hint: 'Топоприв\'язник 1Т12',
        code: '10031500321401000000',
        amp: {
          [amps.typeId]: 0,
          [amps.type]: '1Т12',
        },
      },
    ],
  },
  {
    name: 'Авіація',
    children: [
      {
        hint: 'Літак (загальне позначення)',
        code: '10030100001101000000',
        amp: {},
      },
      {
        hint: 'Літак винищувач',
        code: '10030100001101000400',
        amp: {},
      },
      {
        hint: 'Літак винищувач середній (типу МіГ-29)',
        code: '10030100001101000402',
        amp: {},
      },
      {
        hint: 'Літак винищувач важкий (типу Су-27, Су-30)',
        code: '10030100001101000401',
        amp: {},
      },
      {
        hint: 'Літак штурмовик',
        code: '10030100001101000100',
        amp: {},
      },
      {
        hint: 'Літак радіоелектронної боротьби (РЕБ)',
        code: '10030100001101001600',
        amp: {},
      },
      {
        hint: 'Розвідувальний літак',
        code: '10030100001101001800',
        amp: {},
      },
      {
        hint: 'Тренувальний літак',
        code: '10030100001101001900',
        amp: {},
      },
      {
        hint: 'Літак багатоцільовий',
        code: '10030100001101003600',
        amp: {},
      },
      {
        hint: 'Літак допоміжний (загального застосування)',
        code: '10030100001101000700',
        amp: {},
      },
      {
        hint: 'Літак бомбардувальник',
        code: '10030100001101000200',
        amp: {},
      },
      {
        hint: 'Літак бомбардувальник середній (типу Су-24)',
        code: '10030100001101000202',
        amp: {},
      },
      {
        hint: 'Літак бомбардувальник важкий (типу Ту-22)',
        code: '10030100001101000201',
        amp: {},
      },
      {
        hint: 'Літак транспортний',
        code: '10030100001101000300',
        amp: {},
      },
      {
        hint: 'Літак транспортний легкий (типу Ан-2)',
        code: '10030100001101000303',
        amp: {},
      },
      {
        hint: 'Літак транспортний середній (типу Ан-26)',
        code: '10030100001101000302',
        amp: {},
      },
      {
        hint: 'Літак транспортний важкий (типу Іл-76)',
        code: '10030100001101000301',
        amp: {},
      },
      {
        hint: 'Літак санітарний (медичної евакуації)',
        code: '10030100001101001400',
        amp: {},
      },
      {
        hint: 'Літак протичовновий',
        code: '10030100001101002200',
        amp: {},
      },
      {
        hint: 'Літак - повітряний пункт управління',
        code: '10030100001101001100',
        amp: {},
      },
      {
        hint: 'Безпілотний літальний апарат',
        code: '10030100001103000000',
        amp: {},
      },
      {
        hint: 'Безпілотний літальний апарат легкий',
        code: '10030100001103000003',
        amp: {},
      },
      {
        hint: 'Безпілотний літальний апарат середній',
        code: '10030100001103000002',
        amp: {},
      },
      {
        hint: 'Безпілотний літальний апарат важкий',
        code: '10030100001103000001',
        amp: {},
      },
      {
        hint: 'Військовий повітряний засіб із рухомим крилом (вертоліт)',
        code: '10030100001102000000',
        amp: {},
      },
      {
        hint: 'Бойовий (ударний) повітряний засіб (вертоліт)',
        code: '10030100001102000100',
        amp: {},
      },
      {
        hint: 'Транспортний повітряний засіб (вертоліт)',
        code: '10030100001102000300',
        amp: {},
      },
      {
        hint: 'Повітряний засіб (вертоліт) радіоелектронної боротьби (РЕБ)',
        code: '10030100001102001600',
        amp: {},
      },
      {
        hint: 'Розвідувальний повітряний засіб (вертоліт)',
        code: '10030100001102001800',
        amp: {},
      },
      {
        hint: 'Багатоцільовий повітряний засіб (вертоліт)',
        code: '10030100001102003600',
        amp: {},
      },
      {
        hint: 'Допоміжний (загального застосування) повітряний засіб (вертоліт)',
        code: '10030100001102000700',
        amp: {},
      },
      {
        hint: 'Вертоліт - повітряний пункт управління',
        code: '10030100001102001100',
        amp: {},
      },
      {
        hint: 'Вертоліт санітарний (медичної евакуації)',
        code: '10030100001102001400',
        amp: {},
      },
      {
        hint: 'Цивільне повітряне судно',
        code: '10030100001201000000',
        amp: {},
      },
      {
        hint: 'Цивільний вертоліт',
        code: '10030100001202000000',
        amp: {},
      },
      {
        hint: 'Бригада тактичної авіації (винищувальна)',
        code: '10031000181208000000',
        amp: { [amps.additionalInformation]: 'F' },
      },
      {
        hint: 'Бригада тактичної авіації (штурмова)',
        code: '10031000181208000000',
        amp: { [amps.additionalInformation]: 'A' },
      },
      {
        hint: 'Бригада тактичної авіації (бомбардувальна)',
        code: '10031000181208000000',
        amp: { [amps.additionalInformation]: 'B' },
      },
      {
        hint: 'Бригада тактичної авіації (розвідувальна)',
        code: '10031000181208000000',
        amp: { [amps.additionalInformation]: 'R' },
      },
      {
        hint: 'Авіаційна ескадрилья (винищувальна)',
        code: '10031000161208000000',
        amp: { [amps.additionalInformation]: 'F' },
      },
      {
        hint: 'Авіаційна ескадрилья (штурмова)',
        code: '10031000161208000000',
        amp: { [amps.additionalInformation]: 'A' },
      },
      {
        hint: 'Авіаційна ескадрилья (бомбардувальна)',
        code: '10031000161208000000',
        amp: { [amps.additionalInformation]: 'B' },
      },
      {
        hint: 'Авіаційна ескадрилья (розвідувальна)',
        code: '10031000161208000000',
        amp: { [amps.additionalInformation]: 'R' },
      },
      {
        hint: 'Авіаційна ланка (винищувальна)',
        code: '10031000151208000000',
        amp: { [amps.additionalInformation]: 'F' },
      },
      {
        hint: 'Авіаційна ланка (штурмова)',
        code: '10031000151208000000',
        amp: { [amps.additionalInformation]: 'A' },
      },
      {
        hint: 'Авіаційна ланка (бомбардувальна)',
        code: '10031000151208000000',
        amp: { [amps.additionalInformation]: 'B' },
      },
      {
        hint: 'Авіаційна ланка (розвідувальна)',
        code: '10031000151208000000',
        amp: { [amps.additionalInformation]: 'R' },
      },
      {
        hint: 'Бригада транспортної авіації',
        code: '10031000181208000000',
        amp: { [amps.additionalInformation]: 'C' },
      },
      {
        hint: 'Навчальна авіаційна бригада',
        code: '10031000181207000000',
        amp: { [amps.additionalInformation]: 'T' },
      },
      {
        hint: 'Техніко-експлуатаційна частина (авіаційна)',
        code: '10031000161208003100',
        amp: {},
      },
      {
        hint: 'Спеціальна інженерна служба',
        code: '10031000151407000000',
        amp: { [amps.additionalInformation]: 'Інж.С' },
      },
      {
        hint: 'Група технічної розвідки',
        code: '10031000141611000000',
        amp: { [amps.additionalInformation]: 'ТхР' },
      },
      {
        hint: 'Евакуаційна група',
        code: '10031000141611000000',
        amp: { [amps.additionalInformation]: 'ЕВ' },
      },
      {
        hint: 'Авіаційний склад ракетного озброєння та боєприпасів',
        code: '10032000001103000000',
        amp: { [amps.additionalInformation]: 'Авіа' },
      },
      {
        hint: `Об'єднаний центр забезпечення авіаційними засобами ураження, озброєння та військової техніки. Арсенал авіаційних засобів ураження`,
        code: '10032000001208010000',
        amp: { [amps.additionalInformation]: 'Авіа' },
      },
      {
        hint: 'Арсенал',
        code: '10032000001208010000',
        amp: {},
      },
      {
        hint: 'Авіаційний склад ракетного озброєння та боєприпасів',
        code: '10031000001622007800',
        amp: {},
      },
      {
        hint: `Об'єднаний центр зберігання засобів ураження, озброєння та військової техніки`,
        code: '10031000001643000000',
        amp: {},
      },
      {
        hint: `Об'єднаний центр матеріально-технічного забезпечення`,
        code: '10031000001645000000',
        amp: {},
      },
      {
        hint: 'База авіаційно-технічного забезпечення',
        code: '10031000001645007800',
        amp: {},
      },
      {
        hint: 'Окремий інженерно-аеродромний батальйон',
        code: '10031000161611007800',
        amp: {},
      },
      {
        hint: 'Батальйон аеродромно-технічного забезпечення',
        code: '10031000161634007800',
        amp: {},
      },
      {
        hint: 'Авіаційна комендатура оперативного аеродрому',
        code: '10031000001603000000',
        amp: { [amps.uniqueDesignation]: 'Ав.К' },
      },
      {
        hint: 'Рубіж введення винищувачів до бою',
        code: '10032500000170420000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          color: '#3366ff',
          left: ENDS_STROKE1,
          right: ENDS_STROKE1,
        },
      },
      {
        hint: 'Район повітряного бою',
        code: '10032500001200000000rpb',
        amp: {
          isSvg: true,
          type: entityKind.AREA,
          color: '#3366ff',
          pointAmplifier: { [amps.T]: 'РПБ' },
        },
      },
      {
        hint: 'Завдання повітряного удару',
        code: '10032500000170430000',
        amp: {
          isSvg: true,
          type: entityKind.CURVE,
          color: '#3366ff',
          right: ENDS_ARROW2,
        },
      },
      {
        hint: 'Напрямок дій авіації / Напрямок дій повітряного десанту',
        code: '10032500001514010000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Напрямок дій вертольотів',
        code: '10032500001514020000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
    ],
  },
  {
    name: 'Зенітні ракетні війська Повітряних Сил',
    children: [
      {
        hint: 'Зенітна ракетна бригада (загальне позначення)',
        code: '10031000181301020000',
        amp: {},
      },
      {
        hint: 'Зенітний ракетний полк, який озброєний багатоканальними ЗРК великої дальності',
        code: '10031000171301020029',
        amp: { [amps.additionalInformation]: 'LR' },
      },
      {
        hint: 'Зенітна ракетна бригада, яка озброєна багатоканальними ЗРК середньої дальності',
        code: '10031000181301020029',
        amp: { [amps.additionalInformation]: 'MR' },
      },
      {
        hint: 'Зенітний ракетний полк, який озброєний багатоканальними ЗРК малої дальності',
        code: '10031000171301020029',
        amp: { [amps.additionalInformation]: 'SR' },
      },
      {
        hint: 'Зенітний ракетний дивізіон, який озброєний ЗРК великої дальності',
        code: '10031000161301020000',
        amp: { [amps.additionalInformation]: 'LR' },
      },
      {
        hint: 'Зенітна ракетна батарея, яка озброєна ЗРК малої дальності',
        code: '10031000151301020029',
        amp: { [amps.additionalInformation]: 'SR' },
      },
      {
        hint: 'Технічний дивізіон зенітної ракетної бригади (полку) (загальне позначення)',
        code: '10031000161301023100',
        amp: {},
      },
      {
        hint: 'Технічна батарея зенітної ракетної бригади (полку), яка озброєна ЗРК малої дальності',
        code: '10031000151301023100',
        amp: { [amps.additionalInformation]: 'SR' },
      },
      {
        hint: 'Технічна батарея зенітної ракетної бригади (полку), яка озброєна ЗРК середньої дальності',
        code: '10031000151301023100',
        amp: { [amps.additionalInformation]: 'MR' },
      },
      {
        hint: 'Зона ураження / виявлення (кругова)',
        code: '10032500000170190000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: 'transparent',
        },
      },
      {
        hint: 'Зона ураження / виявлення (сектор)',
        code: '10032500000170760000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: 'transparent',
        },
      },
      // {
      //   hint: 'Основний сектор стрільби на середніх та великих висотах',
      //   code: '10032500000170810000',
      //   amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      // },
      // {
      //   hint: 'Відповідальний сектор стрільби зенітного ракетного підрозділу на малих та гранично-малих висотах',
      //   code: '10032500000170820000',
      //   amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      // },
      {
        hint: 'Коридор прольоту авіації через зону вогню військової частини ЗРВ',
        code: '10032500001701000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          pointAmplifier: {
            [amps.A]: 'NAME:\nWIDTH:\nMIN ALT:\nMAX ALT:\nDTG START:\nDTG END:',
          },
        },
      },
      {
        hint: 'Пункт бойового управління на буксирній тязі',
        code: '10031500351401000000',
        amp: { [amps.specialHeadquarters]: 'С2' },
      },
      {
        hint: 'Пункт бойового управління самохідний',
        code: '10031500321401000000',
        amp: { [amps.specialHeadquarters]: 'С2' },
      },
      {
        hint: 'Пускова установка ЗРК на буксирній тязі середньої дальності',
        code: '10031500351111000000',
        amp: { [amps.additionalInformation]: 'MR' },
      },
      {
        hint: 'Пускова установка ЗРК самохідна середньої дальності',
        code: '10031500321111000000',
        amp: { [amps.additionalInformation]: 'MR' },
      },
      {
        hint: 'Самохідна вогнева (пуско-зарядна) установка ЗРК на гусеничному бронетранспортері малої дальності',
        code: '10031500331111000000',
        amp: { [amps.additionalInformation]: 'SR' },
      },
      {
        hint: 'Транспортна машина ЗРК',
        code: '10031500321401000000',
        amp: {
          [amps.typeId]: 0,
          [amps.type]: 'ТМ',
        },
      },
      {
        hint: 'Радіолокатор виявлення на буксирній тязі',
        code: '10031500352203000000',
        amp: {},
      },
      {
        hint: 'Радіолокатор виявлення самохідний',
        code: '10031500322203000000',
        amp: {},
      },
      {
        hint: 'Радіолокатор виявлення на гусеничному бронетранспортері',
        code: '10031500332203000000',
        amp: {},
      },
    ],
  },
  {
    name: 'Зв\'язок, радіотехнічне забезпечення, автоматизовані та інформаційні системи',
    children: [
      {
        hint: 'Командний пункт радіотехнічної бригади',
        code: '10031002181301005000',
        amp: {},
      },
      {
        hint: 'Командний пункт радіотехнічного батальйону',
        code: '10031002161301005000',
        amp: {},
      },
      {
        hint: 'Командно-спостережний пункт окремої радіолокаційної роти',
        code: '10031002151301005000',
        amp: {},
      },
      {
        hint: 'Радіотехнічна бригада',
        code: '10031000181301005000',
        amp: {},
      },
      {
        hint: 'Радіотехнічний батальйон',
        code: '10031000161301005000',
        amp: {},
      },
      {
        hint: 'Окрема радіолокаційна рота',
        code: '10031000151301005000',
        amp: {},
      },
      {
        hint: 'Окремий радіолокаційний взвод',
        code: '10031000141301005000',
        amp: {},
      },
      {
        hint: 'Обслуга засобу радіолокації',
        code: '10031000111301005000',
        amp: {},
      },
      {
        hint: 'Батальйон зв\'язку та радіотехнічного забезпечення',
        code: '10031000161110005000',
        amp: {},
      },
      {
        hint: 'Привідний радіомаркерний пункт',
        code: '10031500311401000000',
        amp: {
          [amps.typeId]: 0,
          [amps.type]: 'ПАР-10',
        },
      },
      {
        hint: 'Радіолокаційна система посадки',
        code: '10031500311401000000',
        amp: {
          [amps.typeId]: 0,
          [amps.type]: 'РСП-10МН',
        },
      },
      {
        hint: 'Автоматичний радіопеленгатор ультракороткохвильового діапазону',
        code: '10031500311401000000',
        amp: {
          [amps.typeId]: 0,
          [amps.type]: 'АРП-11',
        },
      },
      {
        hint: 'Радіотехнічна система ближньої навігації',
        code: '10031500311401000000',
        amp: {
          [amps.typeId]: 0,
          [amps.type]: 'РСБН-4Н',
        },
      },
      {
        hint: 'Курсовий радіомаяк',
        code: '10031500311401000000',
        amp: {
          [amps.typeId]: 0,
          [amps.type]: 'ПРМГ-5М',
        },
      },
      {
        hint: 'Радіотехнічна система дальньої навігації',
        code: '10031500311401000000',
        amp: {
          [amps.typeId]: 0,
          [amps.type]: 'РСДН-10',
        },
      },
      {
        hint: 'Засіб радіолокації',
        code: '10031500002203000000',
        amp: {},
      },
      {
        hint: 'Зона радіолокаційної інформації, Поле ближньої радіонавігації, Поле управління авіацією (кругова)',
        code: '10032500000170190000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: 'transparent',
        },
      },
      {
        hint: 'Зона радіолокаційної інформації, Поле ближньої радіонавігації, Поле управління авіацією (сектор)',
        code: '10032500000170760000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: 'transparent',
        },
      },
      {
        hint: 'Потрібний рубіж видачі розвідувальної інформації',
        code: '10032500001100000000pi',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          pointAmplifier: { [amps.N]: 'PL РІ' },
        },
      },
      {
        hint: 'Потрібний рубіж видачі бойової інформації',
        code: '10032500001100000000bi',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          pointAmplifier: { [amps.N]: 'PL БІ' },
        },
      },
    ],
  },
  {
    name: 'Військово-Морські Сили',
    children: [
      {
        hint: 'Бригада надводних кораблів',
        code: '10031002181701000000',
        amp: {},
      },
      {
        hint: 'Морська авіаційна бригада',
        code: '10031002181207004600',
        amp: {},
      },
      {
        hint: 'Бригада морської піхоти',
        code: '10031002181211014600',
        amp: {},
      },
      {
        hint: 'Окрема берегова реактивна артилерійська бригада',
        code: '10031002181701004100',
        amp: {},
      },
      {
        hint: 'Окрема берегова артилерійська бригада',
        code: '10031002181303004600',
        amp: {},
      },
      {
        hint: 'Загін морської охорони ДПС',
        code: '10031002181701000500',
        amp: {},
      },
      {
        hint: 'Командно-розвідувальний центр',
        code: '10031002171213004600',
        amp: { [amps.uniqueDesignation]: 'КРЦ' },
      },
      {
        hint: 'Центр РЕР',
        code: '10031002171511004600',
        amp: {},
      },
      {
        hint: 'Центр НГГМЗ',
        code: '10031002171421004600',
        amp: {},
      },
      {
        hint: 'Дивізіон надводних кораблів',
        code: '10031002161701000000',
        amp: { [amps.uniqueDesignation]: 'НК' },
      },
      {
        hint: 'Береговий ракетний полк',
        code: '10031002171307004600',
        amp: {},
      },
      {
        hint: 'Дивізіон  кораблів (катерів) охорони рейду',
        code: '10031002161701000000',
        amp: { [amps.uniqueDesignation]: 'КОВР' },
      },
      {
        hint: 'Морський розвідувальний пункт',
        code: '10031002161213004600',
        amp: { [amps.specialHeadquarters]: 'МРП' },
      },
      {
        hint: 'Окремий батальйон морської піхоти',
        code: '10031002161211014600',
        amp: {},
      },
      {
        hint: 'Дивізіон пошуково-рятувальних суден',
        code: '10031002161418004600',
        amp: {},
      },
      {
        hint: 'Дивізіон суден забезпечення',
        code: '10031002161600004600',
        amp: {},
      },
      {
        hint: 'Окремий береговий ракетний дивізіон',
        code: '10031002161307004600',
        amp: {},
      },
      {
        hint: 'Самохідний артилерійський дивізіон',
        code: '10031002161303014600',
        amp: {},
      },
      {
        hint: 'Загін боротьби з ПДСЗ',
        code: '10031002160000004600',
        amp: { [amps.specialHeadquarters]: 'БПДСЗ' },
      },
      {
        hint: 'Великий підводний човен',
        code: '10033500000000000000',
        amp: { [amps.specialHeadquarters]: 'ВПЧ' },
      },
      {
        hint: 'Середній підводний човен',
        code: '10033500000000000000',
        amp: { [amps.specialHeadquarters]: 'СПЧ' },
      },
      {
        hint: 'Малий підводний човен',
        code: '10033500000000000000',
        amp: { [amps.specialHeadquarters]: 'МПЧ' },
      },
      {
        hint: 'Надмалий підводний човен',
        code: '10033500000000000000',
        amp: { [amps.specialHeadquarters]: 'НМПЧ' },
      },
      {
        hint: 'Навчальний підводний човен',
        code: '10033500000000000000',
        amp: { [amps.specialHeadquarters]: 'НПЧ' },
      },
      {
        hint: 'Підводний безекіпажний апарат',
        code: '10033500001104000000',
        amp: {},
      },
      {
        hint: 'Фрегат КРЗ',
        code: '10033000001202041500',
        amp: {},
      },
      {
        hint: 'Фрегат',
        code: '10033000001202040000',
        amp: {},
      },
      {
        hint: 'Корвет КРЗ',
        code: '10033000001202051500',
        amp: {},
      },
      {
        hint: 'Корвет',
        code: '10033000001202050000',
        amp: {},
      },
      {
        hint: 'Ракетний катер',
        code: '10033000001202020000',
        amp: {},
      },
      {
        hint: 'Великий патрульний корабель',
        code: '10033000001205020002',
        amp: {},
      },
      {
        hint: 'Середній патрульний корабель',
        code: '10033000001205020004',
        amp: {},
      },
      {
        hint: 'Малий патрульний корабель',
        code: '10033000001205020003',
        amp: {},
      },
      {
        hint: 'Патрульний катер',
        code: '10033000001205020000',
        amp: {},
      },
      {
        hint: 'Протидиверсійний катер',
        code: '10033000000000000000',
        amp: { [amps.specialHeadquarters]: 'ПДРКА' },
      },
      {
        hint: 'Мінний загороджувач',
        code: '10033000001204010000',
        amp: {},
      },
      {
        hint: 'Протимінний корабель',
        code: '10033000001204050000',
        amp: {},
      },
      {
        hint: 'Морський тральщик',
        code: '10033000001204020000',
        amp: {},
      },
      {
        hint: 'Базовий тральщик',
        code: '10033000001204000000',
        amp: {},
      },
      {
        hint: 'Рейдовий тральщик',
        code: '10033000000000000000',
        amp: { [amps.specialHeadquarters]: 'РТЩ' },
      },
      {
        hint: 'Великий десантний корабель',
        code: '10033000001203070002',
        amp: {},
      },
      {
        hint: 'Середній десантний корабель',
        code: '10033000001203070004',
        amp: {},
      },
      {
        hint: 'Малий десантний корабель',
        code: '10033000001203070003',
        amp: {},
      },
      {
        hint: 'Десантний катер',
        code: '10033000001203080000',
        amp: {},
      },
      {
        hint: 'Корабель управління',
        code: '10033000001301030000',
        amp: {},
      },
      {
        hint: 'Великий розвідувальний корабель',
        code: '10033000001301040002',
        amp: {},
      },
      {
        hint: 'Середній розвідувальний корабель',
        code: '10033000001301040004',
        amp: {},
      },
      {
        hint: 'Малий розвідувальний корабель',
        code: '10033000001301040003',
        amp: {},
      },
      {
        hint: 'Великий артилерійський катер',
        code: '10033000000000000000',
        amp: { [amps.specialHeadquarters]: 'ВАКА' },
      },
      {
        hint: 'Малий броньований артилерійський катер',
        code: '10033000000000000000',
        amp: { [amps.specialHeadquarters]: 'МБАКА' },
      },
      {
        hint: 'Артилерійський катер',
        code: '10033000000000000000',
        amp: { [amps.specialHeadquarters]: 'АКА' },
      },
      {
        hint: 'Рятувальне буксирне судно',
        code: '10033000000000000000',
        amp: { [amps.specialHeadquarters]: 'РБС' },
      },
      {
        hint: 'Протипожежне буксирне судно',
        code: '10033000000000000000',
        amp: { [amps.specialHeadquarters]: 'ПЖБС' },
      },
      {
        hint: 'Морський рятувальний буксир',
        code: '10033000000000000000',
        amp: { [amps.specialHeadquarters]: 'МРБ' },
      },
      {
        hint: 'Морське водолазне судно',
        code: '10033000000000000000',
        amp: { [amps.specialHeadquarters]: 'МВС' },
      },
      {
        hint: 'Рейдовий водолазний катер',
        code: '10033000000000000000',
        amp: { [amps.specialHeadquarters]: 'РВКА' },
      },
      {
        hint: 'Протипожежний катер',
        code: '10033000000000000000',
        amp: { [amps.specialHeadquarters]: 'ПЖКА' },
      },
      {
        hint: 'Санітарний катер',
        code: '10033000000000000000',
        amp: { [amps.specialHeadquarters]: 'АН' },
      },
      {
        hint: 'Навчальний корабель',
        code: '10033000000000000000',
        amp: { [amps.specialHeadquarters]: 'НК' },
      },
      {
        hint: 'Судно-мішень',
        code: '10033000000000000000',
        amp: { [amps.specialHeadquarters]: 'СМ' },
      },
      {
        hint: 'Навчально-тренувальне судно',
        code: '10033000000000000000',
        amp: { [amps.specialHeadquarters]: 'НТС' },
      },
      {
        hint: 'Навчальний катер',
        code: '10033000000000000000',
        amp: { [amps.specialHeadquarters]: 'НКА' },
      },
      {
        hint: 'Катер-торпедолов',
        code: '10033000000000000000',
        amp: { [amps.specialHeadquarters]: 'ТЛ' },
      },
      {
        hint: 'Плавучий склад',
        code: '10033000000000000000',
        amp: { [amps.specialHeadquarters]: 'ПСКЛ' },
      },
      {
        hint: 'Судно комплексного постачання',
        code: '10033000001301020000',
        amp: {},
      },
      {
        hint: 'Морський суховантажний транспорт',
        code: '10033000000000000000',
        amp: { [amps.specialHeadquarters]: 'МСВТР' },
      },
      {
        hint: 'Морський водоналивний транспорт',
        code: '10033000000000000000',
        amp: { [amps.specialHeadquarters]: 'МВТР' },
      },
      {
        hint: 'Морський танкер',
        code: '10033000001301100000',
        amp: {},
      },
      {
        hint: 'Морський транспорт озброєння',
        code: '10033000001301010000',
        amp: {},
      },
      {
        hint: 'Суховантажна баржа',
        code: '10033000001302020000',
        amp: {},
      },
      {
        hint: 'Судно нафто-сміттєзбирач',
        code: '10033000000000000000',
        amp: { [amps.specialHeadquarters]: 'НСЗ' },
      },
      {
        hint: 'Плавмайстерня',
        code: '10033000001301110000',
        amp: {},
      },
      {
        hint: 'Кілекторне судно',
        code: '10033000000000000000',
        amp: { [amps.specialHeadquarters]: 'КІЛС' },
      },
      {
        hint: 'Судно розмагнічування',
        code: '10033000000000000000',
        amp: { [amps.specialHeadquarters]: 'СР' },
      },
      {
        hint: 'Судно контролю фізичних полів',
        code: '10033000000000000000',
        amp: { [amps.specialHeadquarters]: 'СКФП' },
      },
      {
        hint: 'Морський буксир',
        code: '10033000001301120000',
        amp: {},
      },
      {
        hint: 'Плавучий кран',
        code: '10033000000000000000',
        amp: { [amps.specialHeadquarters]: 'ПКН' },
      },
      {
        hint: 'Судно зв\'язку',
        code: '10033000000000000000',
        amp: { [amps.specialHeadquarters]: 'СЗВ' },
      },
      {
        hint: 'Плавказарма',
        code: '10033000000000000000',
        amp: { [amps.specialHeadquarters]: 'ПКЗ' },
      },
      {
        hint: 'Катер зв\'язку',
        code: '10033000000000000000',
        amp: { [amps.specialHeadquarters]: 'КАЗВ' },
      },
      {
        hint: 'Рейдовий буксир',
        code: '10033000000000000000',
        amp: { [amps.specialHeadquarters]: 'РБ' },
      },
      {
        hint: 'Морський катер',
        code: '10033000000000000000',
        amp: { [amps.specialHeadquarters]: 'МКА' },
      },
      {
        hint: 'Рейдовий (роз\'їзний) катер',
        code: '10033000000000000000',
        amp: { [amps.specialHeadquarters]: 'РРКА' },
      },
      {
        hint: 'Великий гідрографічний катер',
        code: '10033000000000000000',
        amp: { [amps.specialHeadquarters]: 'ВГКА' },
      },
      {
        hint: 'Малий гідрографічний катер',
        code: '10033000000000000000',
        amp: { [amps.specialHeadquarters]: 'МГКА' },
      },
      {
        hint: 'Надводний безекіпажний апарат',
        code: '10033000001207000000',
        amp: {},
      },
      {
        hint: 'Протичовновий літак',
        code: '10030100001101002200',
        amp: {},
      },
      {
        hint: 'Протичовновий вертоліт',
        code: '10030100001102002200',
        amp: {},
      },
      {
        hint: 'Пошуково-рятувальний літак',
        code: '10030100001101002600',
        amp: {},
      },
      {
        hint: 'Пошуково-рятувальний вертоліт',
        code: '10030100001102002600',
        amp: {},
      },
      {
        hint: 'Протикорабельна ракета',
        code: '10030200001100000202',
        amp: {},
      },
      {
        hint: 'Крилата ракета морського базування для ураження надводних та берегових цілей',
        code: '10030200001100000702',
        amp: {},
      },
      {
        hint: 'Морська міна',
        code: '10033600001100000000',
        amp: {},
      },
      {
        hint: 'Нейтралізована морська міна',
        code: '10033600001109000000',
        amp: {},
      },
      {
        hint: 'Донна міна',
        code: '10033600001101000000',
        amp: {},
      },
      {
        hint: 'Якірна міна',
        code: '10033600001102000000',
        amp: {},
      },
      {
        hint: 'Дрейфуюча міна',
        code: '10033600001103000000',
        amp: {},
      },
      {
        hint: 'Плаваюча міна',
        code: '10033600001105000000',
        amp: {},
      },
      {
        hint: 'Район тралення',
        code: '10032500000170440000',
        amp: {
          isSvg: true,
          type: entityKind.POLYGON,
          lineType: types.dashed.value,
        },
      },
      {
        hint: 'Торпеда',
        code: '10032500002110000000',
        amp: {},
      },
      {
        hint: 'Радіогідроакустичний буй в бойовому положенні',
        code: '10032500002135000000',
        amp: {},
      },
      {
        hint: 'Радіогідроакустичний буй нейтралізований',
        code: '10032500002135100000',
        amp: {},
      },
      {
        hint: 'Корабельна ударна група (з керованою ракетною зброєю)',
        code: '10033000001210031500',
        amp: { [amps.uniqueDesignation]: 'У' },
      },
      {
        hint: 'Корабельна ударна група (катерна ударна група)',
        code: '10033000001210030000',
        amp: { [amps.uniqueDesignation]: 'У' },
      },
      {
        hint: 'Корабельна пошуково-ударна група',
        code: '10033000001210030000',
        amp: { [amps.uniqueDesignation]: 'ПУ' },
      },
      {
        hint: 'Корабельна тральна група',
        code: '10033000001210030000',
        amp: { [amps.uniqueDesignation]: 'Т' },
      },
      {
        hint: 'Корабельна група загородження',
        code: '10033000001210030000',
        amp: { [amps.uniqueDesignation]: 'З' },
      },
      {
        hint: 'Корабельна десантна група',
        code: '10033000001210030000',
        amp: { [amps.uniqueDesignation]: 'Д' },
      },
      {
        hint: 'Десантний загін',
        code: '10033000001210040000',
        amp: { [amps.uniqueDesignation]: 'Д' },
      },
      {
        hint: 'Розвідувально-диверсійна група',
        code: '10033000001210030000',
        amp: { [amps.uniqueDesignation]: 'РД' },
      },
      {
        hint: 'Несення дозорної служби, спостереження',
        code: '10032500003422010000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Несення дозорної служби, охорона об\'єкту',
        code: '10032500003422020000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Несення дозорної служби, патрулювання',
        code: '10032500003422030000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Район протимінних дій',
        code: '10032500000170460000',
        amp: {
          isSvg: true,
          type: entityKind.RECTANGLE,
          pointAmplifier: { [amps.T]: 'РПД' },
        },
      },
      {
        hint: 'Район пошуку підводних човнів',
        code: '10032500000170470000',
        amp: {
          isSvg: true,
          type: entityKind.RECTANGLE,
          pointAmplifier: { [amps.T]: 'РП' },
        },
      },
      {
        hint: 'Район постановки мін',
        code: '10032500000170480000',
        amp: {
          isSvg: true,
          type: entityKind.RECTANGLE,
          pointAmplifier: { [amps.T]: 'MW' },
        },
      },
      {
        hint: 'Підтримка вогнем, ведення прямого вогню по противнику з метою підтримки маневру іншого підрозділу',
        code: '10032500001521000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Охорона та оборона пункту базування',
        code: '10032500003421000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Стеження за противником',
        code: '10032500000170490000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
        },
      },
      {
        hint: 'Район ізоляції',
        code: '10032500000170500000',
        amp: {
          isSvg: true,
          type: entityKind.POLYGON,
          lineType: types.blockageIsolation.value,
        },
      },
      {
        hint: 'Пункт призначення',
        code: '10032500002102000000',
        amp: {},
      },
      {
        hint: 'Точка фіксації акустичного контакту',
        code: '10032500002123000000',
        amp: {},
      },
      {
        hint: 'Точка фіксації електромагнітного контакту',
        code: '10032500002124000000',
        amp: {},
      },
      {
        hint: 'Точка фіксації контакту оптичними засобами',
        code: '10032500002126000000',
        amp: {},
      },
      {
        hint: 'Пошук',
        code: '10032500002131000000',
        amp: {},
      },
      {
        hint: 'Район пошуку',
        code: '10032500002132000000',
        amp: {},
      },
      {
        hint: 'Постраждале судно',
        code: '10032500002180000000',
        amp: {},
      },
      {
        hint: 'Затоплений літак',
        code: '10032500002181000000',
        amp: {},
      },
      {
        hint: 'Людина у воді',
        code: '10032500002182000000',
        amp: {},
      },
      {
        hint: 'Пункт базування',
        code: '10032500002128000000',
        amp: { [amps.additionalInformation]: 'ПБ' },
      },
      {
        hint: 'Порт',
        code: '10032500002128000000',
        amp: { [amps.additionalInformation]: 'П' },
      },
      {
        hint: 'Морський порт',
        code: '10032000001213090000',
        amp: {},
      },
      {
        hint: 'Точка позначення затопленого об\'єкта',
        code: '10032500002121000000',
        amp: {},
      },
    ],
  },
  {
    name: 'Десантно-штурмові війська',
    children: [
      {
        hint: 'Окрема десантно-штурмова бригада',
        code: '10031000180000000100',
        amp: {},
      },
      {
        hint: 'Окрема повітрянодесантна бригада',
        code: '10031000180000000001',
        amp: {},
      },
      {
        hint: 'Окрема аеромобільна бригада',
        code: '10031000181201000000',
        amp: {},
      },
      {
        hint: 'Аеромобільний батальйон без броньованої техніки',
        code: '10031000161201000000',
        amp: {},
      },
      {
        hint: 'Десантно-штурмовий батальйон без броньованої техніки',
        code: '10031000161211000100',
        amp: {},
      },
      {
        hint: 'Парашутно-десантний батальйон без броньованої техніки',
        code: '10031000161211000001',
        amp: {},
      },
      {
        hint: 'Десантно-штурмовий батальйон на БТР',
        code: '10031000161211020151',
        amp: {},
      },
      {
        hint: 'Парашутно-десантний батальйон на БМД (БМП)',
        code: '10031000161211020001',
        amp: {},
      },
      {
        hint: 'Аеромобільно-десантна рота',
        code: '10031000151201000000',
        amp: {},
      },
      {
        hint: 'Десантно-штурмова рота на колісних бронеавтомобілях',
        code: '10031000151211020151',
        amp: {},
      },
      {
        hint: 'Парашутно-десантна рота на БМД (БМП)',
        code: '10031000151211020001',
        amp: {},
      },
      {
        hint: 'Аеромобільно-десантний взвод без броньованої техніки',
        code: '10031000141201000000',
        amp: {},
      },
      {
        hint: 'Десантно-штурмовий взвод без броньованої техніки',
        code: '10031000141211000100',
        amp: {},
      },
      {
        hint: 'Парашутно-десантний взвод без броньованої техніки',
        code: '10031000141211000001',
        amp: {},
      },
      {
        hint: 'Бригадна тактична група (БрТГр)',
        code: '10031004180000000100',
        amp: {},
      },
      {
        hint: 'Окрема повітрянодесантна бригада посилена 1 батальйоном 80 одшбр',
        code: '10031000180000000001',
        amp: { [amps.reinforcedReduced]: 'RF' },
      },
      {
        hint: 'Окрема аеромобільна бригада без батальйонної тактичної групи',
        code: '10031000181201000000',
        amp: { [amps.reinforcedReduced]: 'RD' },
      },
      {
        hint: 'Батальйонна тактична група (БТГр) на БМД (БМП)',
        code: '10031004161211020001',
        amp: {},
      },
      {
        hint: 'Танкова рота десантно-штурмової бригади',
        code: '10031000151205000100',
        amp: {},
      },
      {
        hint: 'Танкова рота повітрянодесантної бригади',
        code: '10031000151205000001',
        amp: {},
      },
      {
        hint: 'Розвідувальна рота десантно-штурмової бригади',
        code: '10031000151213000100',
        amp: {},
      },
      {
        hint: 'Розвідувальна рота повітряно-десантної бригади',
        code: '10031000151213000001',
        amp: {},
      },
      {
        hint: 'Інженерно-саперний взвод десантно-штурмової бригади',
        code: '10031000141407000100',
        amp: {},
      },
      {
        hint: 'Інженерно-саперний взвод повітряно-десантної бригади',
        code: '10031000141407000001',
        amp: {},
      },
      {
        hint: 'Інженерно-саперний взвод аеромобільної бригади',
        code: '10031000141407000000',
        amp: { [amps.additionalInformation]: 'Аер.' },
      },
      {
        hint: 'Реактивна батарея',
        code: '10031000151303004100',
        amp: {},
      },
      {
        hint: 'Гаубичний дивізіон окремої аеромобільної бригади',
        code: '10031000161303000000',
        amp: { [amps.uniqueDesignation]: 'гадн' },
      },
      {
        hint: 'Гаубично-самохідний дивізіон',
        code: '10031000161303010001',
        amp: {},
      },
    ],
  },
  {
    name: 'Сили спеціальних операцій',
    children: [
      {
        hint: 'Група спеціального призначення Сил спеціальних операцій',
        code: '10031000131218000000',
        amp: {},
      },
      {
        hint: 'Загін спеціальних операцій Сил спеціальних операцій',
        code: '10031000161218000000',
        amp: {},
      },
      {
        hint: 'Тактична група спеціальних операцій (SOTG)',
        code: '10031004161218000000',
        amp: {},
      },
      {
        hint: 'Окремий центр спеціальних операцій',
        code: '10031000171218000000',
        amp: {},
      },
      {
        hint: 'Морський підрозділ плавзасобів зі складу Сил спеціальних операцій',
        code: '10031000001701006300',
        amp: {},
      },
      {
        hint: 'Морський центр спеціальних операцій',
        code: '10031000171218004600',
        amp: {},
      },
      {
        hint: 'Формування спеціальних бойових малих підводних човнів',
        code: '10031000001218046300',
        amp: {},
      },
      {
        hint: 'Група бойових плавців',
        code: '10031000131214000000',
        amp: {},
      },
      {
        hint: 'Група водолазів мінерів',
        code: '10031000130000000000',
        amp: { [amps.specialHeadquarters]: 'DMT' },
      },
      {
        hint: 'Спеціальний засіб для виводу підрозділів Сил спеціальних операцій водним шляхом надводним способом',
        code: '10031000001218030000',
        amp: {},
      },
      {
        hint: 'Вертолітний підрозділ зі складу Сил спеціальних операцій',
        code: '10031000001206006300',
        amp: {},
      },
      {
        hint: 'Вертолітний підрозділ пошуку та рятування зі складу Сил спеціальних операцій',
        code: '10031000001206006357',
        amp: {},
      },
      {
        hint: 'Авіаційний підрозділ зі складу Сил спеціальних операцій',
        code: '10031000001208006300',
        amp: {},
      },
      {
        hint: 'Навчально-тренувальний центр Сил спеціальних операцій',
        code: '10031000171218000000',
        amp: { [amps.additionalInformation]: 'Т' },
      },
      {
        hint: 'Інформаційно-телекомунікаційний вузол Сил спеціальних операцій',
        code: '10031000161110006300',
        amp: {},
      },
      {
        hint: 'Військова частина (підрозділ) забезпечення та управління Сил спеціальних операцій',
        code: '10031000001600006300',
        amp: {},
      },
      {
        hint: 'Центр інформаційно-психологічних операцій',
        code: '10031000171106000000',
        amp: { [amps.uniqueDesignation]: 'ЦІПсО' },
      },
      {
        hint: 'Ведення спеціальної розвідки Гр СпП ССпО',
        code: '10032500001522000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Район підрозділу зі складу руху опору',
        code: '10032500000170520000',
        amp: {
          isSvg: true,
          type: entityKind.AREA,
          color: '#ff0404',
          lineType: types.solidWithDots.value,
          pointAmplifier: { [amps.N]: 'UWU "ALFA"' },
        },
      },
      {
        hint: 'Район виконання завдань Гр СпП ССпО',
        code: '100325000012000000000spr',
        amp: {
          isSvg: true,
          type: entityKind.AREA,
          color: '#3366ff',
          intermediateAmplifierType: 'text',
          shownIntermediateAmplifiers: [ 0, 1, 2 ],
          intermediateAmplifier: { [amps.N]: 'SR(DA)' },
        },
      },
      {
        hint: 'Район евакуації',
        code: '10032500001507000000',
        amp: {
          isSvg: true,
          type: entityKind.AREA,
          color: '#3366ff',
          pointAmplifier: { [amps.T]: 'ЕВАК' },
        },
      },
      {
        hint: 'Виведення через державний кордон',
        code: '10032500000170540000',
        amp: {
          isSvg: true,
          type: entityKind.CURVE,
          intermediateAmplifierType: 'text',
          shownIntermediateAmplifiers: [ 0 ],
          intermediateAmplifier: { [amps.N]: 'INFIL' },
          right: ENDS_ARROW2,
        },
      },
      {
        hint: 'Повернення через лінію зіткнення військ',
        code: '10032500000170550000',
        amp: {
          isSvg: true,
          type: entityKind.CURVE,
          intermediateAmplifierType: 'text',
          shownIntermediateAmplifiers: [ 0 ],
          intermediateAmplifier: { [amps.N]: 'EXINFIL' },
          right: ENDS_ARROW2,
        },
      },
      {
        hint: 'Розвідувальні завдання пошуком',
        code: '10032500000170560000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Розвідувальні (спеціальні) завдання засідкою',
        code: '10032500001417000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Розвідувальні (спеціальні) завдання нападом',
        code: '10032500001520000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
    ],
  },
  {
    name: 'Інженерні війська',
    children: [
      {
        hint: 'Підрозділ підтримки',
        code: '10031000001600000000',
        amp: {},
      },
      {
        hint: 'Інженерний підрозділ',
        code: '10031000001407000000',
        amp: {},
      },
      {
        hint: 'Пункт управління окремого полку підтримки',
        code: '10031002171600000000',
        amp: {},
      },
      {
        hint: 'Стаціонарний об\'єкт зберігання',
        code: '10031000001640000000',
        amp: {},
      },
      {
        hint: 'Загін забезпечення руху',
        code: '10031004141407030000',
        amp: { [amps.uniqueDesignation]: 'ІДВ' },
      },
      {
        hint: 'Рухомий загін загороджень',
        code: '10031004151407000000',
        amp: {},
      },
      {
        hint: 'Рухомий загін загороджень на вертольотах',
        code: '10031004141407007800',
        amp: {},
      },
      {
        hint: 'Рухомий загін загороджень на плаваючих засобах',
        code: '10031004141407000040',
        amp: {},
      },
      {
        hint: 'Пункт польового водопостачання',
        code: '10031004121647000000',
        amp: {},
      },
      {
        hint: `Ефект руйнування спрямований на використання вогню і ефекту загороджень, щоб примусити противника розділити свої формування, порушити бойовий порядок, витратити час, змінити план, поспішно здійснити розмінування та зірвати атаку`,
        code: '10032500002705020000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: `Ефект блокування  об'єднує вогонь, що прикриває загородження та загородження з метою зупинки противника вздовж шляхів підходу або перешкоджає його проходженню через зону бойових дій`,
        code: '10032500002705010000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: `Ефект затримання  спрямований на планування вогню і загороджень для затримання атакуючих у певній зоні, зазвичай в зоні бойових дій`,
        code: '10032500003411000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Система траншей',
        code: '10032500002909000000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          lineType: types.trenches.value,
        },
      },
      {
        hint: 'Укриття (бліндаж)',
        code: '10032500002809000000',
        amp: {},
      },
      {
        hint: 'Надземне укриття',
        code: '10032500002810000000',
        amp: {},
      },
      {
        hint: 'Підземне укриття',
        code: '10032500002811000000',
        amp: {},
      },
      {
        hint: 'Зона загороджень',
        code: '10032500000170580000',
        isFlip: true,
        amp: {
          isSvg: true,
          type: entityKind.POLYGON,
          color: '#339966',
          lineType: types.blockage.value,
        },
      },
      {
        hint: 'Завал',
        code: '10032500002801000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#339966',
        },
      },
      {
        hint: 'Рубіж мінування',
        code: '10032500000170600000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          color: '#3366ff',
          lineType: types.dashed.value,
          right: ENDS_STROKE1,
          left: ENDS_STROKE1,
        },
      },
      {
        hint: 'Мінне поле (Мінне загородження)',
        code: '10032500002707010000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          pointAmplifiers: { [amps.N]: '', [amps.T]: '', [amps.W]: '' },
          params: {
            mineType: MINE_TYPES.ANTI_TANK,
            controlType: CONTROL_TYPES.UNCONTROLLED,
            dummy: false,
          },
        },
      },
      {
        hint: 'Ряд протитанкових мін',
        code: '10032500000170610000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          lineType: types.rowMinesAntyTank.value,
        },
      },
      {
        hint: 'Ряд протипіхотних мін',
        code: '10032500000170620000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          lineType: types.rowMinesLand.value,
        },
      },
      {
        hint: 'Протитанкова міна',
        code: '10032500002803000000',
        amp: {},
      },
      {
        hint: 'Протипіхотна міна',
        code: '10032500002802000000',
        amp: {},
      },
      {
        hint: 'Міна невизначеного типу',
        code: '10032500002806000000',
        amp: {},
      },
      {
        hint: 'Розтяжка',
        code: '10032500002905000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
        },
      },
      {
        hint: 'Мінна пастка',
        code: '10032500002807000000',
        amp: {},
      },
      {
        hint: 'Протипіхотна міна направленої дії',
        code: '10032500002802010000',
        amp: {},
      },
      {
        hint: 'Протитанкова міна встановлена з елементом невилучення',
        code: '10032500002804000000',
        amp: {},
      },
      {
        hint: 'Район мінування',
        code: '10032500002708000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          pointAmplifier: { [amps.T]: '', [amps.W]: '' },
        },
      },
      {
        hint: 'Група мін',
        code: '10032500002904000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
        },
      },
      {
        hint: 'Прохід в протитанковому мінному полі (шириною до 6 метрів)',
        code: '10032500002906000000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          color: '#3366ff',
          right: ENDS_FORK,
          left: ENDS_FORK,
        },
      },
      {
        hint: `Прохід в протитанковому мінному полі (шириною більше 6 метрів) із зазначенням часу відкриття та закриття проходу`,
        code: '10032500002711000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Протитанковий рів',
        code: '10032500002902020000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          color: '#339966',
          lineType: types.moatAntiTank.value,
        },
      },
      {
        hint: 'Протитанковий рів посилений протираковими мінами',
        code: '10032500002902030000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          color: '#339966',
          lineType: types.moatAntiTankMine.value,
        },
      },
      {
        hint: 'Протитанковий рів в процесі обладнання',
        code: '10032500002902010000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          color: '#339966',
          lineType: types.moatAntiTankUnfin.value,
        },
      },
      {
        hint: 'Лінія загороджень (яка поєднує в собі різні типи загороджень)',
        code: '10032500002901000000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          color: '#339966',
          lineType: types.blockage.value,
        },
      },
      {
        hint: 'Однорядне дротяне загородження',
        code: '10032500002903020000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          color: '#339966',
          lineType: types.blockageWire1.value,
        },
      },
      {
        hint: 'Дворядне дротяне загородження',
        code: '10032500002903030000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          color: '#339966',
          lineType: types.blockageWire2.value,
        },
      },
      {
        hint: 'Дротяне загородження на низьких кілках (типу спотикач)',
        code: '10032500002903050000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          color: '#339966',
          lineType: types.blockageWireLow.value,
        },
      },
      {
        hint: 'Дротяне загородження на високих кілках',
        code: '10032500002903060000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          color: '#339966',
          lineType: types.blockageWireHigh.value,
        },
      },
      {
        hint: 'Спіральне однорядне дротяне загородження',
        code: '10032500002903070000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          color: '#339966',
          lineType: types.blockageSpiral.value,
        },
      },
      {
        hint: 'Спіральне дворядне дротяне загородження',
        code: '10032500002903080000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          color: '#339966',
          lineType: types.blockageSpiral2.value,
        },
      },
      {
        hint: 'Спіральне трьохрядне дротяне загородження',
        code: '10032500002903090000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          color: '#339966',
          lineType: types.blockageSpiral3.value,
        },
      },
      {
        hint: 'Ділянка десантної переправи із зазначенням засобів переправи',
        code: '10032500002713000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
        },
      },
      {
        hint: 'Паромна переправа',
        code: '10032500002907000000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          right: ENDS_ARROW2,
          left: ENDS_ARROW2,
        },
      },
      {
        hint: 'Ділянка переправ',
        code: '10032500002908000000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          right: ENDS_FORK,
          left: ENDS_FORK,
        },
      },
      {
        hint: 'Наплавний міст з парку ПМП',
        code: '10032500002714000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
        },
      },
      {
        hint: 'Десантно доступна ділянка',
        code: '10032500002104000000',
        amp: {},
      },
      {
        hint: 'Хибний об\'єкт',
        code: '1003250000230200',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
        },
      },
      {
        hint: 'Причіпний мінний загороджувач (ПМЗ)',
        code: '10031500351310010000',
        amp: {},
      },
      {
        hint: 'Мінний загороджувач (ГМЗ)',
        code: '10031500331310010000',
        amp: {},
      },
      {
        hint: 'Універсальний мінний загороджувач УМЗ',
        code: '10031500321310010000',
        amp: {},
      },
      {
        hint: 'Інженерна машина розгороджень',
        code: '10031500331309020000',
        amp: {},
      },
      {
        hint: 'Установка розмінування',
        code: '10031500331309000000',
        amp: {},
      },
      {
        hint: 'Причіпна установка розмінування',
        code: '10031500351309000000',
        amp: {},
      },
      {
        hint: 'Бойова машина розмінування',
        code: '10031500331309020000',
        amp: {},
      },
      {
        hint: 'Засоби розмінування переносні',
        code: '10031500001309000000',
        amp: {},
      },
      {
        hint: 'Важкий механізований міст',
        code: '10031500311305000000',
        amp: {},
      },
      {
        hint: 'Мостовий танковий укладач',
        code: '10031500331305000000',
        amp: {},
      },
      {
        hint: 'Паромно-мостова машина',
        code: '10031500331304000000',
        amp: {},
      },
      {
        hint: 'Понтонно-мостовий парк ПМП',
        code: '10031500311306000000',
        amp: {},
      },
      {
        hint: 'Установка будівництва мосту',
        code: '10031500321302000000',
        amp: {},
      },
      {
        hint: 'Плаваючий транспортер середній',
        code: '10031500521312000000',
        amp: {},
      },
      {
        hint: 'Інженерно розвідувальна машина',
        code: '10031500331313000000',
        amp: {},
      },
      {
        hint: 'Екскаватор типу ЕОВ-4421(ЕО-2621)',
        code: '10031500001314000000',
        amp: {},
      },
      {
        hint: 'Бульдозер на гусеничній базі',
        code: '10031500331311000000',
        amp: {},
      },
      {
        hint: 'Бульдозер на автомобільній базі',
        code: '10031500311311000000',
        amp: {},
      },
      {
        hint: 'Шляхопрокладач',
        code: '10031500001308010000',
        amp: {},
      },
      {
        hint: 'Землерийна машина',
        code: '10031500331308000000',
        amp: {},
      },
      {
        hint: 'Полкова землерийна машина',
        code: '10031500311308000000',
        amp: {},
      },
      {
        hint: 'Бурильна машина',
        code: '10031500311307000000',
        amp: {},
      },
      {
        hint: 'Катер',
        code: '10033000001208000000',
        amp: {},
      },
      {
        hint: 'Військово-фільтрувальна станція ВФС',
        code: '10031500311410000000',
        amp: {
          [amps.typeId]: 0,
          [amps.type]: 'ВФС',
        },
      },
    ],
  },
  {
    name: 'Радіоелектронна боротьба',
    children: [
      {
        hint: 'Командний пункт батальйону РЕБ',
        code: '10031002161505040000',
        amp: {},
      },
      {
        hint: 'Батальйон РЕБ',
        code: '10031000161505040000',
        amp: {},
      },
      {
        hint: 'Рота РЕБ',
        code: '10031000151505040000',
        amp: {},
      },
      {
        hint: 'Спеціальний центр РЕБ',
        code: '10031000161501000000',
        amp: { [amps.additionalInformation]: 'ЕР' },
      },
      {
        hint: 'Вузол РЕБ',
        code: '10031000151501000000',
        amp: { [amps.additionalInformation]: 'ЕР' },
      },
      {
        hint: 'Група контролю радіоелектронної обстановки',
        code: '10031000131501000000',
        amp: { [amps.uniqueDesignation]: 'ЕР ТМ' },
      },
      {
        hint: 'Батальйон РЕБ (без роти радіоперешкод)',
        code: '10031000161505040000',
        amp: { [amps.reinforcedReduced]: 'RD' },
      },
      {
        hint: 'Вузол РЕБ (без групи контролю радіоелектронної обстановки)',
        code: '10031000151501000000',
        amp: { [amps.reinforcedReduced]: 'RD', [amps.additionalInformation]: 'ЕР' },
      },
      {
        hint: 'Група контролю радіоелектронної обстановки Українського державного центру радіочастот (UCRF)',
        code: '10031500311401000000',
        amp: { [amps.additionalInformation]: 'УДЦР' },
      },
      {
        hint: `Взвод компактних тактичних систем пеленгування, спроможних здійснювати виявлення місцеположення радіоелектронних засобів`,
        code: '10031000141504000000',
        amp: {},
      },
      {
        hint: 'Станція перешкод на гусеничній базі',
        code: '10031500331201010000',
        amp: {},
      },
      {
        hint: 'Станція перешкод на колісній базі підвищеної прохідності',
        code: '10031500321401000000',
        amp: {},
      },
      {
        hint: `Станція перешкод радіопідривникам артилерійських боєприпасів на броньованій колісній базі підвищеної прохідності`,
        code: '10031500321201010000',
        amp: {},
      },
      {
        hint: 'Компактна тактична система пеленгування на колісній базі',
        code: '10031500311401000000',
        amp: {},
      },
      {
        hint: 'Пункт управління підрозділу РЕБ на колісній базі підвищеної прохідності',
        code: '10031500321401000000',
        amp: {
          [amps.typeId]: 0,
          [amps.type]: 'ПУ',
        },
      },
      {
        hint: 'Цивільний телекомунікатор',
        code: '10032000001212020000',
        amp: {},
      },
      {
        hint: 'Цивільне телебачення',
        code: '10032000001212021300',
        amp: {},
      },
      {
        hint: 'Створення активних перешкод радіоелектронним засобам противника',
        code: '10032500000170630000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Район контролю радіоелектронної обстановки',
        code: '10032500001200000000rez',
        amp: {
          isSvg: true,
          type: entityKind.RECTANGLE,
          color: '#3366ff',
          intermediateAmplifierType: 'text',
          shownIntermediateAmplifiers: [ 0, 2 ],
          intermediateAmplifier: { [amps.N]: 'РЕЗ' },
        },
      },
      {
        hint: 'Район, вільний від радіоелектронних засобів',
        code: '10032500000170650000',
        amp: {
          isSvg: true,
          type: entityKind.POLYGON,
          color: '#3366ff',
          pointAmplifier: { [amps.T]: 'FREE\nCOM' },
          lineType: types.blockage.value,
        },
      },
      {
        hint: 'Межа зони розвідки КХ засобів зв\'язку',
        code: '10032500000170660000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          pointAmplifier: { [amps.T]: 'P KX' },
        },
      },
      {
        hint: 'Межа зони радіоподавлення (КХ радіозв\'язк)',
        code: '10032500000170670000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          pointAmplifier: { [amps.T]: 'РЕП КХ' },
        },
      },

      {
        hint: 'Зона морської радіотехнічної розвідки, Межа зони подавлення',
        code: '10032500000170190000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: 'transparent',
        },
      },
      {
        hint: 'Бригада РЕБ противника',
        code: '10061000181505000000',
        amp: {},
      },
      {
        hint: 'Середнє розвідувальне судно противника',
        code: '10063000000000000604',
        amp: {},
      },
    ],
  },
  {
    name: 'ХБРЯ захист',
    children: [
      {
        hint: 'Командний пункт полку ХБРЯ захисту',
        code: '10031002171401000000',
        amp: {},
      },
      {
        hint: 'Командно-спостережний пункт батальйону ХБРЯ захисту',
        code: '10031002161401000000',
        amp: {},
      },
      {
        hint: 'Командно-спостережний пункт роти ХБРЯ захисту',
        code: '10031002151401000000',
        amp: {},
      },
      {
        hint: 'Командно-спостережний пункт взводу ХБРЯ захисту',
        code: '10031002141401000000',
        amp: {},
      },
      {
        hint: 'Район зосередження',
        code: '10032500001502000000',
        amp: {
          isSvg: true,
          type: entityKind.AREA,
          color: '#3366ff',
          pointAmplifier: { [amps.T]: 'AA' },
        },
      },
      {
        hint: 'Полк ХБРЯ захисту',
        code: '10031000171401000000',
        amp: {},
      },
      {
        hint: 'Батальйон ХБРЯ розвідки',
        code: '10031000161401030000',
        amp: {},
      },
      {
        hint: 'Рота ХБРЯ розвідки',
        code: '10031000151401030000',
        amp: {},
      },
      {
        hint: 'Взвод ХБРЯ розвідки',
        code: '10031000141401030000',
        amp: {},
      },
      {
        hint: 'Відділення ХБРЯ розвідки',
        code: '10031000121401030000',
        amp: {},
      },
      {
        hint: 'Батальйон ХБРЯ захисту',
        code: '10031000161401000000',
        amp: {},
      },
      {
        hint: 'Рота ХБРЯ захисту',
        code: '10031000151401000000',
        amp: {},
      },
      {
        hint: 'Взвод ХБРЯ розвідки',
        code: '10031000141401000000',
        amp: {},
      },
      {
        hint: 'Відділення ХБРЯ захисту',
        code: '10031000121401000000',
        amp: {},
      },
      {
        hint: 'Батальйон ХБРЯ захисту (дегазації обмундирування)',
        code: '10031000161401001500',
        amp: {},
      },
      {
        hint: 'Рота ХБРЯ захисту (дегазації обмундирування)',
        code: '10031000151401001500',
        amp: {},
      },
      {
        hint: 'Взвод ХБРЯ захисту (дегазації обмундирування)',
        code: '10031000141401001500',
        amp: {},
      },
      {
        hint: 'Відділення ХБРЯ захисту (дегазації обмундирування)',
        code: '10031000121401001500',
        amp: {},
      },
      {
        hint: 'Батальйон ХБРЯ захисту (аерозольного маскування)',
        code: '10031000161401006000',
        amp: {},
      },
      {
        hint: 'Рота ХБРЯ захисту (аерозольного маскування)',
        code: '10031000151401006000',
        amp: {},
      },
      {
        hint: 'Взвод ХБРЯ захисту (аерозольного маскування)',
        code: '10031000141401006000',
        amp: {},
      },
      {
        hint: 'Відділення ХБРЯ захисту (аерозольного маскування)',
        code: '10031000121401006000',
        amp: {},
      },
      {
        hint: 'Вогнеметний батальйон ХБРЯ захисту',
        code: '10031000160000000000',
        amp: { [amps.specialHeadquarters]: 'ВП' },
      },
      {
        hint: 'Вогнеметна рота ХБРЯ захисту',
        code: '10031000150000000000',
        amp: { [amps.specialHeadquarters]: 'ВП' },
      },
      {
        hint: 'Вогнеметний взвод ХБРЯ захисту',
        code: '10031000140000000000',
        amp: { [amps.specialHeadquarters]: 'ВП' },
      },
      {
        hint: 'Вогнеметне відділення ХБРЯ захисту',
        code: '10031000120000000000',
        amp: { [amps.specialHeadquarters]: 'ВП' },
      },
      {
        hint: 'Зведений загін ХБРЯ захисту',
        code: '10031004151401000000',
        amp: {},
      },
      {
        hint: 'Дозор ХБРЯ розвідки',
        code: '10032500003422020000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Район (сектор) ХБРЯ розвідки',
        code: '10032500001522000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          color: '#3366ff',
        },
      },
      {
        hint: 'Пост ХБРЯ спостереження розгорнутий штатними підрозділами',
        code: '10032500001602030000',
        amp: {},
      },
      {
        hint: 'Відділення ХБРЯ захисту дозиметричного та хімічного контролю',
        code: '10031000121401030000',
        amp: { [amps.additionalInformation]: 'ДХК' },
      },
      {
        hint: 'Хіміко-радіометрична лабораторія ХБРЯ захисту',
        code: '10031000131401030000',
        amp: { [amps.additionalInformation]: 'ХРЛ' },
      },
      {
        hint: 'Розрахунково-аналітичний центр Командування Сил підтримки',
        code: '10031000161401030000',
        amp: { [amps.uniqueDesignation]: 'РАЦ', [amps.higherFormation]: 'КСП' },
      },
      {
        hint: 'Розрахунково-аналітична станція ХБРЯ захисту',
        code: '10031000151401030000',
        amp: { [amps.uniqueDesignation]: 'РАСт' },
      },
      {
        hint: 'Розрахунково-аналітична група ХБРЯ захисту',
        code: '10031000131401030000',
        amp: { [amps.uniqueDesignation]: 'РАГ' },
      },
      {
        hint: 'Рубіж переведення засобів індивідуального та колективного захисту в бойове положення',
        code: '10032500001101000000rpzikz',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          color: '#3366ff',
          pointAmplifier: { [amps.N]: 'PL РПЗІКЗ' },
          lineType: types.waved.value,
          nodalPointIcon: NODAL_POINT_ICONS.CROSS_CIRCLE,
          shownNodalPointAmplifiers: [ 0, 1 ],
        },
      },
      {
        hint: `Рубіж одягання засобів індивідуального захисту та увімкнення систем фільтровентиляції засобів колективного захисту`,
        code: '10032500001101000000roziz',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          color: '#3366ff',
          pointAmplifier: { [amps.N]: 'PL РОЗІЗ' },
          lineType: types.waved.value,
          nodalPointIcon: NODAL_POINT_ICONS.CROSS_CIRCLE,
          shownNodalPointAmplifiers: [ 0, 1 ],
        },
      },
      {
        hint: 'Виявлення факту хімічного зараження',
        code: '10032500002813000000',
        amp: {},
      },
      {
        hint: 'Виявлення факту біологічного зараження',
        code: '10032500002814000000',
        amp: {},
      },
      {
        hint: 'Виявлення факту радіологічного зараження',
        code: '10032500002817000000',
        amp: {},
      },
      {
        hint: 'Виявлення факту ядерного зараження',
        code: '10032500002815000000',
        amp: {},
      },
      {
        hint: 'Межа зони радіаційного забруднення місцевості за даними розвідки',
        code: '10032500002722000000',
        amp: {
          isSvg: true,
          type: entityKind.AREA,
          color: '#3366ff',
          intermediateAmplifierType: 'text',
          shownIntermediateAmplifiers: [ 2 ],
          intermediateAmplifier: { [amps.N]: 'A' },
        },
      },
      {
        hint: 'Мінімально безпечні відстані радіаційного забруднення місцевості',
        code: '10032500002721000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED, color: 'transparent' },
      },
      {
        hint: 'Аміакопровід',
        code: '10032500000170690000',
        amp: {
          isSvg: true,
          type: entityKind.CURVE,
          lineType: types.chain.value,
        },
      },
      {
        hint: `Обхід зон з високою концентрацією отруйних та небезпечних хімічних речовин (високими рівнями потужності дози випромінювання)`,
        code: '10032500003403000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      // TODO when done karandash (done)
      {
        hint: 'Пункт спеціальної обробки (ПуСО)',
        code: '10032500002818000000',
        amp: {
          type: entityKind.POINT,
          [amps.uniqueDesignation1]: 'ПуСО',
          [amps.staffComments]: 'ПуСО',
        },
      },
      // TODO when done karandash (done)
      {
        hint: 'Дегазаційний пункт (ДП)',
        code: '10032500002818000000',
        amp: {
          type: entityKind.POINT,
          [amps.uniqueDesignation1]: 'ДП',
          [amps.staffComments]: 'ДП',
        },
      },
      {
        hint: 'Район спеціальної обробки  (РСО)',
        code: '10032500001501000000',
        amp: {
          isSvg: true,
          type: entityKind.AREA,
          color: '#3366ff',
          pointAmplifier: { [amps.T]: 'PCO' },
        },
      },
      {
        hint: 'Продегазований прохід на зараженій ділянці місцевості',
        code: '10032500000170800000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          color: '#3366ff',
          left: ENDS_FORK,
          right: ENDS_FORK,
        },
      },
      {
        hint: 'Район хімічного зараження',
        code: '10032500002718000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
        },
      },
      {
        hint: 'Район біологічного зараження',
        code: '10032500002717000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
        },
      },
      {
        hint: 'Район радіологічного зараження',
        code: '10032500002720000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
        },
      },
      {
        hint: 'Район ядерного зараження',
        code: '10032500002719000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
        },
      },
      {
        hint: 'Район хімічного зараження - токсичні промислові речовини',
        code: '10032500002718010000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
        },
      },
      {
        hint: 'Район біологічного зараження - токсичні промислові речовини',
        code: '10032500002717010000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
        },
      },
      {
        hint: 'Район радіологічного зараження - токсичні промислові речовини',
        code: '10032500002720010000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
        },
      },
      {
        hint: 'Аерозольне маскування рубежу безпосередньо перед районами розташування своїх військ',
        code: '10032500001102000000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          color: '#3366ff',
          shownIntermediateAmplifiers: [ 0 ],
          intermediateAmplifier: { [amps.W]: 'AM' },
          left: ENDS_STROKE1,
          right: ENDS_STROKE1,
        },
      },
      {
        hint: 'Район, який маскується аерозолем в районах розташування своїх військ',
        code: '10032500001200000000am',
        amp: {
          isSvg: true,
          type: entityKind.AREA,
          color: '#3366ff',
          pointAmplifier: { [amps.N]: 'AM' },
        },
      },
      {
        hint: 'Головний напрямок ведення вогню',
        code: '10032500001405000000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
        },
      },
      {
        hint: 'База ремонту та зберігання озброєння засобів ХБРЯ захисту',
        code: '10031000171401003100',
        amp: {},
      },
      {
        hint: 'Склад зберігання озброєння і засобів ХБРЯ захисту',
        code: '10031000001621000000',
        amp: {},
      },
      {
        hint: 'Ремонтний цех (ремонтна рота) ремонту та зберігання озброєння і засобів ХБРЯ захисту',
        code: '10031000151401003100',
        amp: {},
      },
      {
        hint: 'Взвод ремонту озброєння і засобів ХБРЯ захисту',
        code: '10031000141401003100',
        amp: {},
      },
      {
        hint: 'Відділення ремонту озброєння і засобів ХБРЯ захисту',
        code: '10031000121401003100',
        amp: {},
      },
      {
        hint: 'Реактивний піхотний вогнемет РПВ',
        code: '10031500001104000000',
        amp: {
          [amps.typeId]: 0,
          [amps.type]: 'РПВ',
        },
      },
      {
        hint: 'Розвідувальний літак із встановленою на ньому апаратурою  ХБРЯ розвідки',
        code: '10030100001101001800',
        amp: { [amps.additionalInformation]: 'ХБРЯз' },
      },
      {
        hint: 'Розвідувальний вертоліт  із встановленою на ньому апаратурою ХБРЯ розвідки',
        code: '10030100001102001800',
        amp: { [amps.additionalInformation]: 'ХБРЯз' },
      },
      {
        hint: 'Безпілотний літальний апарат (середній)  із встановленою на ньому апаратурою ХБРЯ розвідки',
        code: '10030100001103001802',
        amp: { [amps.additionalInformation]: 'ХБРЯз' },
      },
      {
        hint: 'Спеціальна машина ХБРЯ розвідки РХМ-1К(С) (МТ-ЛБ) (дозор ХБРЯ розвідки)',
        code: '10031500331201030000',
        amp: { [amps.additionalInformation]: 'ДХБРЯр' },
      },
      {
        hint: 'Спеціальна машина ХБРЯ розвідки УАЗ-469 ХБР, РХМ-4-01(БТР-80), БРДМ- 2ХБР (дозор ХБРЯ розвідки)',
        code: '10031500321401000000',
        amp: { [amps.additionalInformation]: 'ДХБРЯз' },
      },
      {
        hint: 'Розрахунково-аналітична станція РАСт-2М',
        code: '10031500321401000000',
        amp: {
          [amps.typeId]: 0,
          [amps.type]: 'РАСт-2М',
        },
      },
      {
        hint: 'Контрольно-розподільчий пересувний пункт КРПП',
        code: '10031500321401000000',
        amp: { [amps.additionalInformation]: 'КРПП' },
      },
      {
        hint: 'Автомобільна лабораторія',
        code: '10031500321401000000',
        amp: {
          [amps.typeId]: 0,
          [amps.type]: 'АЛ',
        },
      },
      {
        hint: 'Авторозливна станція',
        code: '10031500321401000000',
        amp: {
          [amps.typeId]: 0,
          [amps.type]: 'АРС',
        },
      },
      {
        hint: 'Дегазаційний комплект виносний',
        code: '10031500321401000000',
        amp: {
          [amps.typeId]: 0,
          [amps.type]: 'ДКВ',
        },
      },
      {
        hint: 'Авіаційний дегазаційно-дезактиваційний комплект АДДК',
        code: '10031500321401000000',
        amp: {
          [amps.typeId]: 0,
          [amps.type]: 'АДДК',
        },
      },
      {
        hint: 'Автодегазаційна станція',
        code: '10031500321401000000',
        amp: {
          [amps.typeId]: 0,
          [amps.type]: 'АГВ',
        },
      },
      {
        hint: 'Бучильна установка',
        code: '10031500321401000000',
        amp: {
          [amps.typeId]: 0,
          [amps.type]: 'БУ',
        },
      },
      {
        hint: 'Спеціальна машина аерозольного маскування ТДА-М',
        code: '10031500321401000000',
        amp: {
          [amps.typeId]: 0,
          [amps.type]: 'ТДА-М',
        },
      },
      {
        hint: 'Атомна електростанція',
        code: '10032000001205010300',
        amp: {},
      },
      {
        hint: 'Об\'єкт, що містить небезпечні хімічні речовини (НХР)',
        code: '10032000001106000200',
        amp: {},
      },
      {
        hint: 'Об\'єкт, що містить біологічні засоби (БЗ)',
        code: '10032000001106000100',
        amp: {},
      },
      {
        hint: 'Об\'єкт, що містить радіологічні речовини (РР)',
        code: '10032000001106000400',
        amp: {},
      },
      {
        hint: 'Об\'єкт, що містить ядерні речовини (ЯР)',
        code: '10032000001106000300',
        amp: {},
      },
      {
        hint: 'Об\'єкт атомної промисловості',
        code: '10032000001115000000',
        amp: {},
      },
    ],
  },
  {
    name: 'Топогеодезичне та навігаційне забезпечення',
    children: [
      {
        hint: 'Центр топогеодезичного та навігаційного забезпечення (картографічний центр)',
        code: '10031000171421000000',
        amp: { [amps.uniqueDesignation]: 'кц' },
      },
      {
        hint: 'Центр топогеодезичного та навігаційного забезпечення (редакційно-видавничний)',
        code: '10031000171421000000',
        amp: { [amps.uniqueDesignation]: 'рвц' },
      },
      {
        hint: 'Центр топогеодезичного та навігаційного забезпечення (топогеодезичний)',
        code: '10031000171421000000',
        amp: { [amps.uniqueDesignation]: 'тгц' },
      },
      {
        hint: 'Центр топогеодезичного та навігаційного забезпечення (фотограмметричний)',
        code: '10031000171421000000',
        amp: { [amps.uniqueDesignation]: 'фц' },
      },
      {
        hint: 'Військова частина топогеодезичного та навігаційного забезпечення (військово картографічна частина)',
        code: '10031000161421000000',
        amp: { [amps.uniqueDesignation]: 'вкч' },
      },
      {
        hint: 'Військова частина топогеодезичного та навігаційного забезпечення (картографічна частина)',
        code: '10031000161421000000',
        amp: { [amps.uniqueDesignation]: 'кч' },
      },
      {
        hint: 'Військова частина топогеодезичного та навігаційного забезпечення (топографічна частина)',
        code: '10031000161421000000',
        amp: { [amps.uniqueDesignation]: 'тч' },
      },
      {
        hint: 'Склад топографічних карт',
        code: '10031000161621006800',
        amp: {},
      },
      {
        hint: 'Підрозділ військової частини топогеодезичного та навігаційного забезпечення',
        code: '10031000151421000000',
        amp: {},
      },
      {
        hint: 'Окремий розрахунок топогеодезичного та навігаційного забезпечення',
        code: '10031000111421000000',
        amp: {},
      },
      {
        hint: 'Автомобіль штабний топографічний',
        code: '10031500311401000000',
        amp: {
          [amps.typeId]: 0,
          [amps.type]: 'АШТ',
        },
      },
      {
        hint: 'Cпеціальний геодезичний автомобіль',
        code: '10031500311401000000',
        amp: {
          [amps.typeId]: 0,
          [amps.type]: 'СГА',
        },
      },
      {
        hint: 'Автомобіль топогеодезичного та навігаційного забезпечення',
        code: '10031500311401000000',
        amp: {},
      },
      {
        hint: 'Район виконання спеціальних робіт із зазначенням виду робіт: \n' +
                'ОВ – оперативно виправлена\n' +
                'ДР – ділянки ріки\n' +
                'Рл – рельєфна\n' +
                'ОГ – оглядово-географічна\n' +
                'ГД – геодезичних даних\n' +
                'Рз – розвідувальна\n' +
                'Кд – кодована \n' +
                'Ор – орієнтирів \n',
        code: '10032500000170700000',
        amp: {
          isSvg: true,
          type: entityKind.RECTANGLE,
          color: '#3366ff',
          intermediateAmplifierType: 'text',
          shownIntermediateAmplifiers: [ 0, 2 ],
          intermediateAmplifier: { [amps.N]: 'ОВ' },
        },
      },
      {
        hint: 'Район створення (виправлення) плану міста (масштаб 1:5 000)',
        code: '10032500000170710000',
        amp: {
          isSvg: true,
          type: entityKind.RECTANGLE,
          color: '#3366ff',
          intermediateAmplifierType: 'text',
          shownIntermediateAmplifiers: [ 1 ],
          intermediateAmplifier: { [amps.N]: '1:5000' },
        },
      },
      {
        hint: 'Район створення фотодокументів про місцевість (масштаб 1:30 000)',
        code: '10032500000170710000',
        amp: {
          isSvg: true,
          type: entityKind.RECTANGLE,
          color: '#3366ff',
          lineType: types.chain.value,
          intermediateAmplifierType: 'text',
          shownIntermediateAmplifiers: [ 1 ],
          intermediateAmplifier: { [amps.N]: '1:30000' },
        },
      },
    ],
  },
  {
    name: 'Гідрометеорологічне забезпечення',
    children: [
      {
        hint: 'Гідрометеорологічна служба ЗС України Командування Сил підтримки',
        code: '10031000131306000000',
        amp: { [amps.uniqueDesignation]: 'ГМС', [amps.higherFormation]: 'КСП' },
      },
      {
        hint: 'Гідрометеорологічний центр',
        code: '10031000151213003200',
        amp: { [amps.uniqueDesignation]: 'ГМЦ', [amps.higherFormation]: 'КСП' },
      },
      {
        hint: `Метеорологічна група Державного науково-дослідного інституту сертифікації та випробування озброєння, військової техніки`,
        code: '10031000121306000000',
        amp: { [amps.uniqueDesignation]: 'метгр', [amps.higherFormation]: 'ДНДІ' },
      },
      {
        hint: 'Метеорологічна служба ПС',
        code: '10031000121306000000',
        amp: { [amps.uniqueDesignation]: 'метсл', [amps.higherFormation]: 'ПС' },
      },
      {
        hint: 'Авіаційний метеорологічний центр КЦ ПС',
        code: '10031000151213003200',
        amp: { [amps.uniqueDesignation]: 'АМЦ', [amps.higherFormation]: 'КЦ ПС' },
      },
      {
        hint: 'Метеорологічна служба Повітряного командування',
        code: '10031000121213003200',
        amp: { [amps.uniqueDesignation]: 'метсл', [amps.higherFormation]: 'ПвК' },
      },
      {
        hint: 'Метеорологічне бюро ЦУО',
        code: '10031000131213003200',
        amp: { [amps.uniqueDesignation]: 'метсл', [amps.higherFormation]: 'ЦУО' },
      },
      {
        hint: 'Метеорологічна група авіаційної бригади',
        code: '10031000141208003200',
        amp: { [amps.uniqueDesignation]: 'метгр' },
      },
      {
        hint: 'Метеорологічна група авіаційної комендатури Повітряного командування',
        code: '10031000121213003200',
        amp: { [amps.uniqueDesignation]: 'метгр' },
      },
      {
        hint: 'Метеорологічна служба ВВНЗ (ХНУ ПС)',
        code: '10031000121306000000',
        amp: {
          [amps.uniqueDesignation]: 'метсл',
          [amps.additionalInformation]: 'ХНУ',
          [amps.higherFormation]: 'ПС',
        },
      },
      {
        hint: 'Метеорологічна група ДКЛА',
        code: '10031000121219003200',
        amp: { [amps.uniqueDesignation]: 'метгр', [amps.higherFormation]: 'оп ДКЛА' },
      },
      {
        hint: 'Кафедра військової підготовки фахівців гідрометеорологічної служби цивільного ВНЗ',
        code: '10032000001204020000',
        amp: { [amps.uniqueDesignation]: 'КВП' },
      },
      {
        hint: 'Гідрометеорологічна служба ВМС',
        code: '10031000121306004600',
        amp: { [amps.uniqueDesignation]: 'ГМС', [amps.higherFormation]: 'ВМС' },
      },
      {
        hint: 'Гідрометеорологічний відділ ЦНГГМ ВМС',
        code: '10031000131306004600',
        amp: { [amps.uniqueDesignation]: 'ЦНГГМ', [amps.higherFormation]: 'ВМС' },
      },
      {
        hint: 'Метеорологічна група морської авіаційної бригади ВМС',
        code: '10031000131306004600',
        amp: { [amps.uniqueDesignation]: 'метгр' },
      },
      {
        hint: 'Метеорологічне бюро КП ВМБ ВМС',
        code: '10031000141306004600',
        amp: { [amps.uniqueDesignation]: 'метбюро', [amps.higherFormation]: 'ВМБ' },
      },
      {
        hint: 'Гідрометеорологічна служба СВ',
        code: '10031000121306000000',
        amp: {
          [amps.uniqueDesignation]: 'ГМС',
          [amps.higherFormation]: 'СВ',
        },
      },
      {
        hint: 'Метеорологічне бюро КП АА СВ',
        code: '10031000131306007800',
        amp: {
          [amps.uniqueDesignation]: 'метбюро',
          [amps.higherFormation]: 'КП АА',
        },
      },
      {
        hint: 'Метеорологічний взвод омбр (отбр)',
        code: '10031000141211023200',
        amp: {},
      },
      {
        hint: 'Метеорологічний взвод огпбр',
        code: '10031000141211003227',
        amp: {},
      },
      {
        hint: 'Метеорологічна станція військового полігону',
        code: '10031000001306000000',
        amp: { [amps.uniqueDesignation]: 'местст', [amps.higherFormation]: 'вп' },
      },
      {
        hint: 'Пересувна метеорологічна станція із зазначенням типу (ПМС-70, 72)',
        code: '10031500321401000000',
        amp: {
          [amps.typeId]: 0,
          [amps.type]: 'ПМС',
        },
      },
      {
        hint: 'Державна гідрометеорологічна служба',
        code: '10032000000000000000',
        amp: { [amps.specialHeadquarters]: 'ДГМС' },
      },
      {
        hint: 'Український гідрометеорологічний центр',
        code: '10032000000000000000',
        amp: { [amps.specialHeadquarters]: 'УГМЦ' },
      },
      {
        hint: 'Регіональний центр з гідрометеорології',
        code: '10032000000000000000',
        amp: { [amps.specialHeadquarters]: 'РЦГМ' },
      },
      {
        hint: 'Обласний центр з гідрометеорології',
        code: '10032000000000000000',
        amp: { [amps.specialHeadquarters]: 'ОЦГМ' },
      },
      {
        hint: 'Стаціонарна метеорологічна радіолокаційна станція',
        code: '10031000001306005000',
        amp: {},
      },
    ],
  },
  {
    name: 'Кінологічна служба',
    children: [
      {
        hint: 'Кінологічна служба Командування Сил підтримки',
        code: '10031000130000000000',
        amp: { [amps.specialHeadquarters]: 'DOG' },
      },
      {
        hint: 'Кінологічне відділення',
        code: '10031000120000000000',
        amp: { [amps.specialHeadquarters]: 'ОЦГМ' },
      },
      {
        hint: 'Кінологічний розрахунок',
        code: '10031000110000000000',
        amp: { [amps.specialHeadquarters]: 'ОЦГМ' },
      },
    ],
  },
  {
    name: 'Логістичне забезпечення',
    children: [
      {
        hint: 'Ремонтно-відновлювальна частина (підрозділ). Загальне позначення',
        code: '10031000001611000000',
        amp: {},
      },
      {
        hint: 'Ремонтно-відновлювальний полк',
        code: '10031000171611000000',
        amp: {},
      },
      {
        hint: 'Ремонтно-відновлювальний батальйон комплексного ремонту',
        code: '10031000161611000000',
        amp: {},
      },
      {
        hint: 'Ремонтна рота комплексного ремонту',
        code: '10031000151611000000',
        amp: {},
      },
      {
        hint: 'Взвод технічного забезпечення',
        code: '10031000141611000000',
        amp: { [amps.additionalInformation]: 'ТхЗ' },
      },
      {
        hint: 'Ремонтно-відновлювальний батальйон бронетанкового озброєння і техніки',
        code: '10031000161611000000',
        amp: { [amps.additionalInformation]: 'БТОТ' },
      },
      {
        hint: 'Ремонтна рота ракетно-артилерійського озброєння',
        code: '10031000151611000000',
        amp: { [amps.additionalInformation]: 'РАО' },
      },
      {
        hint: 'Ремонтний взвод бронетанкового озброєння і техніки',
        code: '10031000141611000000',
        amp: { [amps.additionalInformation]: 'БТОТ' },
      },
      {
        hint: 'Ремонтне відділення автомобільної техніки',
        code: '10031000121611000000',
        amp: { [amps.additionalInformation]: 'АТ' },
      },
      {
        hint: 'Взвод технічної розвідки',
        code: '10031000141611000000',
        amp: { [amps.additionalInformation]: 'ТхР' },
      },
      {
        hint: 'Відділення технічної розвідки',
        code: '10031000121611000000',
        amp: { [amps.additionalInformation]: 'ТхР' },
      },
      {
        hint: 'Евакуаційний батальйон',
        code: '10031000161611000000',
        amp: { [amps.additionalInformation]: 'ЕВ' },
      },
      {
        hint: 'Евакуаційний взвод',
        code: '10031000141611000000',
        amp: { [amps.additionalInformation]: 'ЕВ' },
      },
      {
        hint: 'Евакуаційне відділення бронетанкового озброєння і техніки',
        code: '10031000121611000000',
        amp: { [amps.additionalInformation]: 'ЕВ', [amps.staffComments]: 'БТОТ' },
      },
      {
        hint: 'Евакуаційне відділення автомобільної техніки',
        code: '10031000121611000000',
        amp: { [amps.additionalInformation]: 'ЕВ', [amps.staffComments]: 'АТ' },
      },
      {
        hint: 'Відділення технічного обслуговування бронетанкового озброєння і техніки',
        code: '10031000121611000000',
        amp: { [amps.additionalInformation]: 'ТО', [amps.staffComments]: 'БТОТ' },
      },
      {
        hint: 'Відділення технічного обслуговування ракетно-артилерійського озброєння',
        code: '10031000121611000000',
        amp: { [amps.additionalInformation]: 'ТО', [amps.staffComments]: 'РАО' },
      },
      {
        hint: 'Відділення технічного обслуговування автомобільної техніки',
        code: '10031000121611000000',
        amp: { [amps.additionalInformation]: 'ТО', [amps.staffComments]: 'АТ' },
      },
      {
        hint: 'Відділення спеціальних робіт',
        code: '10031000121611000000',
        amp: { [amps.additionalInformation]: 'СПЕЦ' },
      },
      {
        hint: 'Регіональна метрологічна військова частина',
        code: '10031000001611000000',
        amp: { [amps.additionalInformation]: 'РМВЧ' },
      },
      {
        hint: 'Військова метрологічна лабораторія',
        code: '10031000001611000000',
        amp: { [amps.additionalInformation]: 'ВМЛ' },
      },
      {
        hint: 'Пункт технічного спостереження',
        code: '10032500001301000000',
        amp: {
          type: entityKind.POINT,
          [amps.uniqueDesignation1]: 'ПТС',
          [amps.staffComments]: 'ПТС',
        },
      },
      {
        hint: 'Група технічної розвідки',
        code: '10031004001611000000',
        amp: { [amps.additionalInformation]: 'ГТР' },
      },
      {
        hint: 'Пункт передачі пошкоджених зразків ОВТ',
        code: '10032500001301000000',
        amp: { [amps.uniqueDesignation1]: 'ПП' },
      },
      {
        hint: 'Евакуаційна група',
        code: '10031004001611000000',
        amp: { [amps.additionalInformation]: 'ЕГ' },
      },
      {
        hint: 'Ремонтно-евакуаційна група',
        code: '10031004001611000000',
        amp: { [amps.additionalInformation]: 'РЕГ' },
      },
      {
        hint: 'Ремонтна група',
        code: '10031004001611000000',
        amp: { [amps.additionalInformation]: 'РемГ' },
      },
      {
        hint: 'Збірний пункт пошкоджених машин',
        code: '10032500001301000000',
        amp: {
          type: entityKind.POINT,
          [amps.uniqueDesignation1]: 'ЗППМ',
          [amps.staffComments]: 'ЗППМ',
        },
      },
      {
        hint: 'Запасний збірний пункт пошкоджених машин',
        code: '10032510001301000000',
        amp: {
          type: entityKind.POINT,
          [amps.dtg]: 'З',
          [amps.uniqueDesignation1]: 'ЗППМ',
          [amps.staffComments]: 'ЗППМ',
        },
      },
      {
        hint: 'Пункт технічної допомоги',
        code: '10032500001301000000',
        amp: {
          type: entityKind.POINT,
          [amps.uniqueDesignation1]: 'ПТД',
          [amps.staffComments]: 'ПТД',
        },
      },
      {
        hint: 'Замикання похідної колони головних сил',
        code: '10031004001611000000',
        amp: {
          [amps.additionalInformation]: 'ЗПК',
          [amps.staffComments]: 'ГС',
        },
      },
      {
        hint: 'Замикання похідної колони підрозділів технічного та тилового забезпечення',
        code: '10031004001611000000',
        amp: {
          [amps.additionalInformation]: 'ЗПК',
          [amps.staffComments]: 'ТТ',
        },
      },
      {
        hint: 'Виїзна метрологічна група',
        code: '10031004001611000000',
        amp: { [amps.additionalInformation]: 'ВМГ' },
      },
      {
        hint: `Райони зосередження пошкоджених зразків ОВТ (масового виходу зі строю ОВТ) з вказівкою часу координат та кількістю ОВТ`,
        code: '10032500001502000000rzp',
        amp: {
          isSvg: true,
          type: entityKind.AREA,
          color: '#3366ff',
          intermediateAmplifierType: 'text',
          shownIntermediateAmplifiers: [ 0 ],
          intermediateAmplifier: { [amps.N]: 'РЗП ОВТ' },
        },
      },
      {
        hint: 'Пункт бойового постачання',
        code: '10032500003217050000',
        amp: {},
      },
      {
        hint: 'Пункт зустрічі ракет та боєприпасів',
        code: '10032500001301000000',
        amp: {
          type: entityKind.POINT,
          [amps.uniqueDesignation1]: 'ПЗ',
          [amps.staffComments]: 'ПЗ',
        },
      },
      {
        hint: 'Склад з ракетами та боєприпасами',
        code: '10031000001641000000',
        amp: {},
      },
      {
        hint: 'Запаси ракет та боєприпасів, які розміщені на ґрунті',
        code: '10031000001604000000',
        amp: {},
      },
      {
        hint: 'Склад бронетанкового майна',
        code: '10031000001645000000',
        amp: { [amps.additionalInformation]: 'БТМ' },
      },
      {
        hint: 'Склад автомобільного майна',
        code: '10031000001645000000',
        amp: { [amps.additionalInformation]: 'АМ' },
      },
      {
        hint: 'Центральна база зберігання ракет та боєприпасів',
        code: '10031000001622000000',
        amp: { [amps.uniqueDesignation]: 'ЦБ РіБ' },
      },
      {
        hint: 'Рухомий засіб технічного обслуговування та ремонту типу МТО-АТ',
        code: '10031500321401000000',
        amp: {
          [amps.typeId]: 0,
          [amps.type]: 'МТО-АТ',
        },
      },
      {
        hint: 'Сідельний тягач з напівпричепом',
        code: '10031500001406000000',
        amp: {},
      },
      {
        hint: 'Броньована ремонтно-евакуаційна машина на базі танку (танковий тягач, гусеничний тягач)',
        code: '10031500331203000000',
        amp: {},
      },
      {
        hint: 'Броньована ремонтно-евакуаційна машина на базі БТР',
        code: '10031500321201080000',
        amp: {},
      },
      {
        hint: 'Технічне обслуговування в обсязі ЩТО',
        code: '10031000000000003100',
        amp: { [amps.specialHeadquarters]: 'ОВТ', [amps.staffComments]: 'ЩТО' },
      },
      {
        hint: 'Окрема база матеріального забезпечення ВМС',
        code: '10031000001634004600',
        amp: {},
      },
      {
        hint: 'Батальйон матеріального забезпечення',
        code: '10031000161634000000',
        amp: {},
      },
      {
        hint: 'Рота матеріального забезпечення',
        code: '10031000151634000000',
        amp: {},
      },
      {
        hint: 'Автомобільний батальйон',
        code: '10031000161636000000',
        amp: {},
      },
      {
        hint: 'Автомобільна рота підвезення боєприпасів',
        code: '10031000151636000000',
        amp: { [amps.additionalInformation]: 'БП' },
      },
      {
        hint: 'Автомобільна рота підвезення пального',
        code: '10031000151636000000',
        amp: { [amps.additionalInformation]: 'ПММ' },
      },
      {
        hint: 'Автомобільна рота підвезення продовольчого, речового та військово-технічного майна',
        code: '10031000151636000000',
        amp: { [amps.additionalInformation]: 'МТЗ' },
      },
      {
        hint: 'Господарський взвод',
        code: '10031000141634000000',
        amp: {},
      },
      {
        hint: 'Автотранспортний взвод',
        code: '10031000141636000000',
        amp: { [amps.additionalInformation]: 'ТР' },
      },
      {
        hint: 'Автомобільний взвод підвезення боєприпасів',
        code: '10031000141636000000',
        amp: { [amps.additionalInformation]: 'БП' },
      },
      {
        hint: 'Автомобільний взвод підвезення пального',
        code: '10031000141636000000',
        amp: { [amps.additionalInformation]: 'ПММ' },
      },
      {
        hint: 'Автомобільний взвод підвезення продовольчого, речового та військово-технічного майна',
        code: '10031000141636000000',
        amp: { [amps.additionalInformation]: 'МТЗ' },
      },
      {
        hint: 'Автомобільний взвод підвезення військово-технічного майна',
        code: '10031000141636000000',
        amp: { [amps.additionalInformation]: 'ВТМ' },
      },
      {
        hint: 'Відділення хлібозаводу',
        code: '10031000120000000000',
        amp: { [amps.specialHeadquarters]: 'ПМХ' },
      },
      {
        hint: 'Лазня',
        code: '10031000121610000000',
        amp: {},
      },
      {
        hint: 'Мобільний лазневий комплекс для миття особового складу та прання речового майна',
        code: '10031500311401000000',
        amp: { [amps.additionalInformation]: 'МЛПК' },
      },
      {
        hint: 'Їдальня',
        code: '10031000120000000000',
        amp: { [amps.specialHeadquarters]: 'ЇД' },
      },
      {
        hint: 'Пересувний механізований хлібозавод',
        code: '10031000000000000000',
        amp: { [amps.specialHeadquarters]: 'ПМХ' },
      },
      {
        hint: 'Продовольчий склад',
        code: '10031000001637000000',
        amp: {},
      },
      {
        hint: 'Речовий склад',
        code: '10031000001642000000',
        amp: {},
      },
      {
        hint: 'Склад військово-технічного майна',
        code: '10031000001645000000',
        amp: {},
      },
      {
        hint: 'Склад артилерійських боєприпасів',
        code: '10031000001641000000',
        amp: { [amps.additionalInformation]: 'Арт' },
      },
      {
        hint: 'Склад стрілецької зброї',
        code: '10031000001641000000',
        amp: { [amps.additionalInformation]: 'СЗ' },
      },
      {
        hint: 'Склад пального та мастильних матеріалів',
        code: '10031000001620000000',
        amp: {},
      },
      {
        hint: 'Транспортний засіб для перевезення води',
        code: '10031500311410000000',
        amp: {},
      },
      {
        hint: 'Заправник',
        code: '10031500311409000000',
        amp: {},
      },
      {
        hint: 'Вантажівка з напівпричепом',
        code: '10031500001406000000',
        amp: {},
      },
      {
        hint: 'Центри забезпечення, склади (бази) зберігання МТЗ Центру',
        code: '10032000001112000000',
        amp: {},
      },
      {
        hint: 'Центри забезпечення, склади (бази) зберігання ПММ Центру',
        code: '10032000001112000000',
        amp: { [amps.additionalInformation]: 'ПММ' },
      },
      {
        hint: 'Пункт заправки ПММ',
        code: '10032500003217090000',
        amp: {},
      },
      {
        hint: 'Пересувна станція перекачування ПММ',
        code: '10031500311409000000',
        amp: {},
      },
      {
        hint: 'Трубопровідні військові частини (підрозділи)',
        code: '10031000001626000000',
        amp: {},
      },
      {
        hint: 'Ремонтні підрозділи (майстерні)',
        code: '10031000001636003100',
        amp: {},
      },
      {
        hint: 'Склад (база) зберігання МТЗ номенклатури продовольчої служби',
        code: '10032000001201050000',
        amp: {},
      },
      {
        hint: 'Підприємства національної економіки ПММ',
        code: '10032000001205050000',
        amp: {},
      },
      {
        hint: 'Підприємства Державної агенції України',
        code: '10032000001109000000',
        amp: {},
      },
    ],
  },
  {
    name: 'Служба військових сполучень',
    children: [
      {
        hint: 'Управління військових сполучень на залізниці',
        code: '10031000001630000008',
        amp: {},
      },
      {
        hint: 'Комендатура військових сполучень залізничної дільниці та станції',
        code: '10031000001630000008',
        amp: { [amps.additionalInformation]: 'К' },
      },
      {
        hint: 'Залізнична станція навантаження (розвантаження, перевантаження) військ',
        code: '10031000001630000000',
        amp: {},
      },
      {
        hint: 'Управління аеропорту',
        code: '10031000001603000008',
        amp: {},
      },
      {
        hint: 'Комендатура військових сполучень аеропорту',
        code: '10031000001603000008',
        amp: { [amps.additionalInformation]: 'К' },
      },
      {
        hint: 'Аеропорт',
        code: '10031000001603000000',
        amp: {},
      },
      {
        hint: 'Управління військових сполучень на морському та річковому транспорті',
        code: '10031000001633000008',
        amp: {},
      },
      {
        hint: 'Порт навантаження (розвантаження), посадки (висадки)',
        code: '10031000001633000000',
        amp: {},
      },
      {
        hint: 'Локомотив',
        code: '10031500001501000000',
        amp: {},
      },
    ],
  },
  {
    name: 'Медичне забезпечення',
    children: [
      {
        hint: 'Медична рота / Медичний пункт',
        code: '10031000151613000000',
        amp: {},
      },
      {
        hint: 'Медичний пункт  батальйону',
        code: '10031000161613000000',
        amp: {},
      },
      {
        hint: 'Мобільна група підсилення (лікарсько-сестринська бригада)',
        code: '10031500311402000000',
        amp: { [amps.uniqueDesignation]: 'МГП' },
      },
      {
        hint: 'Медичний склад',
        code: '10031000001644000000',
        amp: {},
      },
      {
        hint: 'Пересувна група медичного постачання',
        code: '10031500311402000000',
        amp: { [amps.uniqueDesignation]: 'ПГМП' },
      },
      {
        hint: 'Військовий госпіталь (стаціонарний)',
        code: '10032000001207020000',
        amp: { [amps.uniqueDesignation]: 'ВГ' },
      },
      {
        hint: 'Військовий мобільний госпіталь',
        code: '10031000161614000000',
        amp: { [amps.uniqueDesignation]: 'ВМГ' },
      },
      {
        hint: 'Цивільна лікарня (міська клінічна лікарня)',
        code: '10032000001207020000',
        amp: { [amps.uniqueDesignation]: 'МКЛ' },
      },
      {
        hint: 'Стабілізаційний пункт',
        code: '10032500001301000000',
        amp: {
          type: entityKind.POINT,
          [amps.uniqueDesignation1]: 'СтП',
          [amps.staffComments]: 'СтП',
        },
      },
      {
        hint: 'Санітарний бронетранспортер',
        code: '10031500001201040000',
        amp: {},
      },
      {
        hint: 'Санітарний автомобіль',
        code: '10031500001402000000',
        amp: {},
      },
      {
        hint: 'Військово-медичний клінічний центр регіону',
        code: '10032000001207020000',
        amp: { [amps.uniqueDesignation]: 'ВМКЦ' },
      },
      {
        hint: 'Національний військово-медичний клінічний центр “ГВКГ”',
        code: '10032000001207020000',
        amp: { [amps.uniqueDesignation]: 'НВМКЦ' },
      },
      {
        hint: 'Центр медичної реабілітації та санаторно-курортного лікування',
        code: '10032000001207010000',
        amp: { [amps.uniqueDesignation]: 'ЦМРСЛ' },
      },
      {
        hint: 'Санітарний літак',
        code: '10030100001101001400',
        amp: {},
      },
      {
        hint: 'Вертоліт аеромедичної евакуації',
        code: '10030100001102001400',
        amp: {},
      },
      {
        hint: 'Регіональне санітарно-епідеміологічне управління',
        code: '10032000001207010000',
        amp: { [amps.uniqueDesignation]: 'РСЕУ' },
      },
      {
        hint: 'Пункт збору  поранених',
        code: '10032500003211000000',
        amp: {},
      },
      {
        hint: 'Військова санітарна летючка',
        code: '10031000001613000036',
        amp: { [amps.uniqueDesignation]: 'ВСЛ' },
      },
      {
        hint: 'Окрема автомобільна санітарна рота',
        code: '10031000151613000051',
        amp: { [amps.uniqueDesignation]: 'АСР' },
      },
      {
        hint: 'Пересувний кабінет (стоматологічний)',
        code: '10031500001402000000',
        amp: { [amps.additionalInformation]: 'ПСК' },
      },
      {
        hint: 'Пересувний кабінет (автоперев\'язувальна)',
        code: '10031500001402000000',
        amp: { [amps.additionalInformation]: 'АП' },
      },
      {
        hint: 'Пересувний кабінет (реанімобіль)',
        code: '10031500001402000000',
        amp: { [amps.additionalInformation]: 'Р' },
      },
    ],
  },
  {
    name: 'Військова служба правопорядку',
    children: [
      {
        hint: 'Головне управління ВСП (ВП)',
        code: '10031002231412000000',
        amp: {},
      },
      {
        hint: 'Центральне (територіальне) управління ВСП (ВП)',
        code: '10031002221412000000',
        amp: {},
      },
      {
        hint: 'Зональний відділ ВСП (ВП)',
        code: '10031002151412000000',
        amp: {},
      },
      {
        hint: 'Спеціальний відділ, дисциплінарний батальйон ВСП (ВП), Центр спеціального призначення ВСП (ВП)',
        code: '10031002161412000000',
        amp: {},
      },
      {
        hint: 'Підрозділ ВСП (ВП)',
        code: '10031000001412000000',
        amp: {},
      },
    ],
  },
  {
    name: 'Суспільно-політична обстановка та адміністративно-територіальний устрій',
    children: [
      { hint: 'Підрозділ МПЗ', code: '10031000001615000000', amp: {} },
      {
        hint: 'Пункт психологічної допомоги',
        code: '10032500001301000000',
        amp: { [amps.additionalInformation]: 'ПсхД' },
      },
      {
        hint: 'Будинок офіцерів',
        code: '10032000000000000000',
        amp: { [amps.uniqueDesignation]: 'ГБО', [amps.higherFormation]: 'ГУМПЗ' },
      },
      {
        hint: 'Військовий (армійський), оркестр, концертна група',
        code: '10031000001605010000',
        amp: { [amps.higherFormation]: 'ВМУ' },
      },
      {
        hint: 'Похідний автомобільний клуб (ПАК) військовий (армійський)',
        code: '10031500311401000000',
        amp: { [amps.commonIdentifier]: 'ПАК-Д' },
      },
      {
        hint: 'Державна адміністрація (обласна)',
        code: '10032000000000000000',
        amp: { [amps.specialHeadquarters]: 'ОДА' },
      },
      {
        hint: 'Державна адміністрація (районна)',
        code: '10032000000000000000',
        amp: { [amps.specialHeadquarters]: 'РДА' },
      },
      {
        hint: 'Державна адміністрація (сільська, міська рада об\'єднаної територіальної громади)',
        code: '10032000000000000000',
        amp: { [amps.specialHeadquarters]: 'АДМ' },
      },
      {
        hint: 'Військово-цивільна адміністрація',
        code: '10032000000000000000',
        amp: { [amps.specialHeadquarters]: 'ВЦА' },
      },
      { hint: 'Цивільно-військове співробітництво', code: '10031000001103000000', amp: {} },
      {
        hint: 'Обласний військовий комісаріат',
        code: '10032000000000000000',
        amp: { [amps.specialHeadquarters]: 'ОВК' },
      },
      {
        hint: 'Районний військовий комісаріат',
        code: '10032000000000000000',
        amp: { [amps.specialHeadquarters]: 'РВК' },
      },
      {
        hint: 'Район компактного проживання національних меншин',
        code: '10032500001200000000kpnm',
        amp: {
          isSvg: true,
          type: entityKind.AREA,
          hatch: HATCH_TYPE.LEFT_TO_RIGHT,
          fill: 'black',
          pointAmplifier: { [amps.T]: 'КПНМ' },
        },
      },
      {
        hint: 'Масові заворушення (бунт), акції, демонстрації, мітинги, акти непокори цивільного населення',
        code: '10064000001201000000',
        amp: {},
      },
      { hint: 'Табір внутрішньопереміщених, відселених осіб, біженці', code: '10032000001119010000', amp: {} },
      { hint: 'Цвинтар, кладовище', code: '10031000001616000000', amp: {} },
      {
        hint: 'Неурядова громадська, (політична) організація',
        code: '10031100000000001400',
        amp: { [amps.specialHeadquarters]: 'НГПО' },
      },
      { hint: 'Релігійна організація (загальне позначення)', code: '10031000001631000000', amp: {} },
      {
        hint: `Релігійна (культова) споруда, комплекс споруд для культових, релігійних потреб, відправ служб, читання молитов і звернень до бога, служіння богу`,
        code: '10032000001210040000',
        amp: {},
      },
      {
        hint: `Загострена криміногенна обстановка (порушення громадського порядку, вандалізм, зґвалтування, насильство, розбій, пограбування людей, будинків, транспорту)`,
        code: '10064000001101140000',
        amp: {},
      },
      { hint: 'Арешт', code: '10034000001101010000', amp: {} },
      {
        hint: 'Жертва, яка постраждала від криміналітету, замах на вбивство',
        code: '10031100001107000000',
        amp: {},
      },
      { hint: 'Вбивство', code: '10031100001105000000', amp: {} },
      { hint: 'Вбивство групи людей, масові вбивства', code: '10031100001106000000', amp: {} },
      { hint: 'Підпал, пожежа', code: '10064000001101020000', amp: {} },
      { hint: 'Вибух, підрив, терористичний акт', code: '10064000001106000000', amp: {} },
      {
        hint: 'Заклад відбування покарання, місця утримання полонених',
        code: '10032000000000000000',
        amp: { [amps.specialHeadquarters]: 'PRISON' },
      },
      { hint: 'Друковані засоби масової інформації', code: '10032000001116000000', amp: {} },
      { hint: 'Цивільне радіо (FM)', code: '10031000001107000000', amp: { [amps.additionalInformation]: 'FM' } },
      { hint: 'Цивільне телебачення', code: '10032000001212021300', amp: {} },
      { hint: 'Пошта, поштове відділення', code: '10032000001209000000', amp: {} },
      {
        hint: `Місце проведення офіційної зустрічі, прес-конференції, брифінгу: PR, зустрічі військового командування з журналістами`,
        code: '10032000001210000000',
        amp: {},
      },
      { hint: 'Навчальний заклад (будівля)', code: '10032000001204020000', amp: {} },
      {
        hint: 'Об\'єкти та споруди, які знаходяться під захистом міжнародного права. Культурні цінності',
        code: '10032000000000000000',
        amp: { [amps.specialHeadquarters]: 'МГП' },
      },
      {
        hint: 'Сектор, межі (зони) стійкого прийому цивільних радіозасобів та телезасобів',
        code: '10032500000170760000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED, color: 'transparent' },
      },
      {
        hint: 'Район, до якого сплановано відселення (евакуацію) населення, біженців із районів воєнних дій',
        code: '10032500000170770000',
        amp: { isSvg: true, type: entityKind.AREA, pointAmplifier: { [amps.T]: 'DPRE' } },
      },
      {
        hint: 'Загальновійськовий полігон',
        code: '10032000000000000000',
        amp: { [amps.specialHeadquarters]: 'ЗВП' },
      },
      { hint: 'Батальйон резерву', code: '10031000160000000000', amp: { [amps.specialHeadquarters]: 'Рез' } },
      // TODO when done karadash start
      {
        hint: 'Пункт прийому особового складу',
        code: '10032500001301000000',
        amp: {
          type: entityKind.POINT,
          [amps.uniqueDesignation1]: 'ППОС',
          [amps.staffComments]: 'ППОС',
        },
      },
      {
        hint: 'Пункт прийому техніки',
        code: '10032500001301000000',
        amp: {
          type: entityKind.POINT,
          [amps.uniqueDesignation1]: 'ППТ',
          [amps.staffComments]: 'ППТ',
        },
      },
      {
        hint: 'Пункт зустрічі поповнення',
        code: '10032500001301000000',
        amp: {
          type: entityKind.POINT,
          [amps.uniqueDesignation1]: 'ПЗП',
          [amps.staffComments]: 'ПЗП',
        },
      },
      {
        hint: 'Пункт попереднього збору військовозобов\'язаних',
        code: '10032500001301000000',
        amp: {
          type: entityKind.POINT,
          [amps.uniqueDesignation1]: 'ППЗВ',
          [amps.staffComments]: 'ППЗВ',
        },
      },
      {
        hint: 'Пункт попереднього збору техніки',
        code: '10032500001301000000',
        amp: {
          type: entityKind.POINT,
          [amps.uniqueDesignation1]: 'ППЗТ',
          [amps.staffComments]: 'ППЗТ',
        },
      },
      {
        hint: 'Пункт збору селищної ради',
        code: '10032500001301000000',
        amp: {
          type: entityKind.POINT,
          [amps.uniqueDesignation1]: 'ПЗСР',
          [amps.staffComments]: 'ПЗСР',
        },
      },
      {
        hint: 'Штаб оповіщення',
        code: '10032500001301000000',
        amp: {
          type: entityKind.POINT,
          [amps.uniqueDesignation1]: 'ШО',
          [amps.staffComments]: 'ШО',
        },
      },
    ],
  },
  {
    name: 'Космічні системи',
    children: [
      {
        hint: 'Космічний апарат',
        code: '10030500001101000000',
        amp: {},
      },
      {
        hint: 'Космічний апарат зв\'язку',
        code: '10030500001111000000',
        amp: {},
      },
      {
        hint: 'Розвідувальний КА',
        code: '10030500001115000000',
        amp: {},
      },
      {
        hint: 'Навігаційний КА',
        code: '10030500001114000000',
        amp: {},
      },
      {
        hint: 'Метеорологічний КА',
        code: '10030500001118000000',
        amp: {},
      },
      {
        hint: 'Орбітальне угруповання',
        code: '10030500001107000000',
        amp: {},
      },
      {
        hint: 'Космічний корабель',
        code: '10030500001101000000',
        amp: {},
      },
      {
        hint: 'Космічний корабель (вантажний)',
        code: '10030500001101000000',
        amp: { [amps.additionalInformation]: 'В' },
      },
      {
        hint: 'Орбітальна станція',
        code: '10030500001116000000',
        amp: {},
      },
      {
        hint: 'Район запуску космічних засобів',
        code: '10032500001200000000rzap',
        amp: {
          isSvg: true,
          type: entityKind.AREA,
          color: '#3366ff',
          pointAmplifier: { [amps.T]: 'РЗапКосм' },
        },
      },
      {
        hint: 'Район посадки космічних засобів',
        code: '10032500001200000000rpos',
        amp: {
          isSvg: true,
          type: entityKind.AREA,
          color: '#3366ff',
          pointAmplifier: { [amps.T]: 'РПосКосм' },
        },
      },
    ],
  },
]
