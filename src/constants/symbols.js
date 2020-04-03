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

export const amps = {
  specialHeadquarters: 'specialHeadquarters', // 1Назва командування
  higherFormation: 'higherFormation', // 1Вище формування
  uniqueDesignation: 'uniqueDesignation', // 1Призначення
  additionalInformation: 'additionalInformation', // 1Додаткова інформація
  reinforcedReduced: 'reinforcedReduced', // 1Посилення/Послаблення
  staffComments: 'staffComments', // 1Коментар
  affiliation: 'affiliation',
  dtg: 'dtg', // 1Дата-час
  type: 'type', // 1Озброєння
  N: 'middle', // Амплификатор в форме линий
  // Если что, в формах любых линий есть топ, ботом и мидл, но лейбл у них разный, например W и H это ботом
  T: 'top', // --||--
  W: 'bottom', // --||--
  A: 'additional',
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
export const symbols = [
  {
    name: 'Пункти управління',
    children: [
      {
        hint: 'Командний пункт ЗС України',
        code: '10031002250000009800',
        amp: { [amps.specialHeadquarters]: 'ЗСУ' },
      },
      {
        hint: 'Командний пункт Об’єднаних Сил ЗС України',
        code: '10031006250000009800',
        amp: { [amps.specialHeadquarters]: 'ОС' },
      },
      {
        hint: 'Командний пункт Сухопутних військ ЗС України',
        code: '10031006240000009800',
        amp: { [amps.specialHeadquarters]: 'СВ ЗСУ' },
      },
      {
        hint: 'Командний пункт Повітряних Сил ЗС України',
        code: '10031002240000009800',
        amp: { [amps.specialHeadquarters]: 'ПС ЗСУ' },
      },
      {
        hint: 'Командний пункт Військово-Морських Сил ЗС України',
        code: '10031006241701009800',
        amp: { [amps.higherFormation]: 'ВМС' },
      },
      {
        hint: 'Командний пункт десантно-штурмових військ ЗС України',
        code: '10031006240000009800',
        amp: { [amps.specialHeadquarters]: 'ДШВ ЗСУ' },
      },
      {
        hint: 'Командний пункт Сил спеціальних операцій ЗС України',
        code: '10031002240000009800',
        amp: { [amps.specialHeadquarters]: 'ССО ЗСУ' },
      },
      {
        hint: 'Командний пункт оперативного командування',
        code: '10031002230000009800',
        amp: { [amps.specialHeadquarters]: 'ОК' },
      },
      {
        hint: 'Командний пункт повітряного командування',
        code: '10031006230000009800',
        amp: { [amps.specialHeadquarters]: 'ПвК' },
      },
      {
        hint: 'Командний пункт оперативного угруповання військ (сил)',
        code: '10031002230000009800',
        amp: { [amps.specialHeadquarters]: 'ОУВ (с)' },
      },
      {
        hint: 'Командний пункт  морського командування',
        code: '10031006221701009800',
        amp: { [amps.uniqueDesignation]: 'МК' },
      },
      {
        hint: 'Командний пункт  морської піхоти ЗС України',
        code: '10031006221701009800',
        amp: { [amps.uniqueDesignation]: 'МП' },
      },
      {
        hint: 'Командний пункт оперативно-тактичного угруповання',
        code: '10031002220000009800',
        amp: { [amps.specialHeadquarters]: 'ОТУ' },
      },
      {
        hint: 'Командний пункт корпусу резерву',
        code: '10031006220000009800',
        amp: { [amps.specialHeadquarters]: 'КР' }
      },
      {
        hint: 'Пункт управління адміністрації Державної спеціальної служби транспорту (ДССТ)',
        code: '10031002240000009800',
        amp: { [amps.specialHeadquarters]: 'ДССТ' },
      },
      {
        hint: 'Пункт управління Державної прикордонної служби України (ДПС)',
        code: '10031002240000009800',
        amp: { [amps.specialHeadquarters]: 'ДПС' },
      },
      {
        hint: 'Пункт управління Державної служби спеціального зв\'язку та захисту інформації України (ДССЗЗІ)',
        code: '10031002240000009800',
        amp: { [amps.specialHeadquarters]: 'ДССЗЗІ' },
      },
      {
        hint: 'Пункт управління Міністерства юстиції України',
        code: '10031002240000009800',
        amp: { [amps.specialHeadquarters]: 'Мін\'юст' },
      },
      {
        hint: 'Пункт управління апарату Національної поліції України',
        code: '10031002240000009800',
        amp: { [amps.specialHeadquarters]: 'НП' },
      },
      {
        hint: 'Пункт управління Головного управління Національної гвардії України',
        code: '10031002240000009800',
        amp: { [amps.specialHeadquarters]: 'НГ' },
      },
      {
        hint: 'Пункт управління Центрального управління Служби безпеки України',
        code: '10031002240000009800',
        amp: { [amps.specialHeadquarters]: 'СБУ' },
      },
      { hint: 'Командний пункт механізованої бригади', code: '10031002181211020000', amp: {} },
      { hint: 'Командний пункт мотопіхотного полку', code: '10031002171211040000', amp: {} },
      { hint: 'Командно-спостережний пункт гірсько-піхотного батальйону', code: '10031002161211000027', amp: {} },
      { hint: 'Командно-спостережний пункт танкової роти', code: '10031002151205000000', amp: {} },
    ],
  },
  {
    name: 'Загальновійськові',
    children: [
      { hint: 'Механізована бригада', code: '10031000181211020000', amp: {} },
      { hint: 'Гірсько-піхотна бригада', code: '10031000181211000027', amp: {} },
      { hint: 'Окрема бригада армійської авіації', code: '10031000181206000000', amp: {} },
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
      { hint: 'Загін морської охорони', code: '10031000001701000500', amp: {} },
      { hint: 'Прикордонний загін', code: '10031000181211000500', amp: {} },
      {
        hint: 'Окрема бригада територіальної оборони',
        code: '10031000181211040000',
        amp: { [amps.uniqueDesignation]: 'ТрО' },
      },
      { hint: 'Відділ прикордонної служби', code: '10031000151211000500', amp: {} },
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
      { hint: 'Мотопіхотний батальйон', code: '10031000161211040000', amp: {} },
      { hint: 'Танковий батальйон', code: '10031000161205000000', amp: {} },
      { hint: 'Гірсько-штурмовий батальйон', code: '10031000161211000127', amp: {} },
      { hint: 'Механізований взвод', code: '10031000141211020000', amp: {} },
      { hint: 'Механізований взвод на БТР', code: '10031000141211020051', amp: {} },
      { hint: 'Рота вогневої підтримки', code: '10031000150000000000', amp: { [amps.specialHeadquarters]: 'ВП' } },
      { hint: 'Взвод снайперів', code: '10031000141215000000', amp: {} },
      { hint: 'Взвод управління', code: '10031000140000000008', amp: {} },
      { hint: 'Протитанкове відділення', code: '10031000121204000000', amp: {} },
      {
        hint: 'Вихідний рубіж, вихідний рубіж для форсування',
        code: '10032500001410000000ld',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          nodalPointIcon: NODAL_POINT_ICONS.CROSS_CIRCLE,
          shownNodalPointAmplifiers: [ 0, 1 ],
          lineType: types.dashed.value,
          pointAmplifier: { [amps.T]: 'LD' },
        },
      },
      {
        hint: 'Рубіж регулювання',
        code: '10032500001403000000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          nodalPointIcon: NODAL_POINT_ICONS.CROSS_CIRCLE,
          shownNodalPointAmplifiers: [ 0, 1 ],
          lineType: types.dashed.value,
          pointAmplifier: { [amps.N]: 'PL' },
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
          pointAmplifier: { [amps.T]: 'HL' },
        },
      },
      { hint: 'Вогневий рубіж', code: '10032500001521000000', amp: { isSvg: true, type: entityKind.SOPHISTICATED } },
      {
        hint: 'Рубіж загороджувального вогню',
        code: '10032500002407010000',
        amp: { isSvg: true, type: entityKind.POLYLINE, left: ENDS_STROKE1, right: ENDS_STROKE1 },
      },
      {
        hint: 'Рубіж дії бойових підрозділу',
        code: '10032500000170010000',
        amp: { isSvg: true, type: entityKind.POLYLINE }
      },
      {
        hint: 'Район зосередження',
        code: '10032500001502000000',
        amp: { isSvg: true, type: entityKind.AREA, pointAmplifier: { [amps.T]: 'AA' } },
      },
      { hint: 'Район оборони', code: '10032500001512000000', amp: { isSvg: true, type: entityKind.AREA } },
      {
        hint: 'Район базування військової частини, підрозділу авіації',
        code: '10032500001204000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED, textAmplifiers: { H: 'H' } },
      },
      { hint: 'Базовий табір бригади', code: '10031000181409000000', amp: {} },
      {
        hint: 'Межа смуги вогню основного сектора обстрілу',
        code: '10032500001405000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      { hint: 'Ділянка прориву', code: '10032500003402000000', amp: { isSvg: true, type: entityKind.SOPHISTICATED } },
      { hint: 'Ділянка висадки морського десанту (пункт висадки)', code: '10032500002104000000', amp: {} },
      {
        hint: 'Ділянка форсування',
        code: '10032500002713000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED }
      },
      {
        hint: 'Район десантування (висадки розвідгруп)',
        code: '10032500001508000000',
        amp: { isSvg: true, type: entityKind.AREA, pointAmplifier: { [amps.W]: 'Дес' } },
      },
      {
        hint: 'Район розвантаження',
        code: '10032500001506000000',
        amp: { isSvg: true, type: entityKind.AREA, pointAmplifier: { [amps.W]: 'Розвантаж' } },
      },
      {
        hint: 'Зона приземлення (для евакуації розвідгруп)',
        code: '10032500001507000000',
        amp: { isSvg: true, type: entityKind.AREA, pointAmplifier: { [amps.W]: 'Евак' } },
      },
      {
        hint: 'Вихідний район десантування (район завантаження)',
        code: '10032500001509000000',
        amp: { isSvg: true, type: entityKind.AREA, pointAmplifier: { [amps.W]: 'ВРД' } },
      },
      { hint: 'Район базування', code: '10032500000170030000', amp: { isSvg: true, type: entityKind.AREA } },
      { hint: 'Посадочна площадка', code: '10032000001213000000', amp: {} },
      {
        hint: 'Площадка підскоку',
        code: '10032500003103000000',
        amp: { isSvg: true, type: entityKind.AREA, pointAmplifier: { [amps.T]: 'FAPR' } },
      },
      {
        hint: 'Майданчик посадочний',
        code: '10032500000170040000',
        amp: { isSvg: true, type: entityKind.AREA, pointAmplifier: { [amps.T]: 'МПос' } },
      },
      {
        hint: 'Майданчик підскоку, засідки',
        code: '10032500000170050000',
        amp: { isSvg: true, type: entityKind.AREA, pointAmplifier: { [amps.T]: 'МПідск' } },
      },
      {
        hint: 'Атакувати вогнем – вогневе ураження противника без зближення та захоплення його об’єктів',
        code: '10032500000170060000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: 'Підрозділи, які зупинені на рубежі (атака відбита)',
        code: '10032500000170070000',
        amp: { isSvg: true, type: entityKind.CURVE, right: ENDS_ARROW1 },
      },
      {
        hint: 'Напрямок головного удару',
        code: '10032500001514030000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED }
      },
      {
        hint: 'Інший напрямок удару',
        code: '10032500001514040000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED }
      },
      {
        hint: 'Хибний напрямок наступу',
        code: '10032500001514060000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED }
      },
      { hint: 'Засідка', code: '10032500001417000000', amp: { isSvg: true, type: entityKind.SOPHISTICATED } },
      {
        hint: 'Рубіж блокування противника (блокування)',
        code: '10032500003401000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: 'Обхід маневр навколо перешкоди або позицій противника з метою збереження темпу просування',
        code: '10032500003403000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: 'Втягування противника у  вогневий район (мішок), обмеження руху противника у визначеній зоні',
        code: '10032500003404000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      { hint: 'Прочісування', code: '10032500003405000000', amp: { isSvg: true, type: entityKind.SOPHISTICATED } },
      {
        hint: 'Дезорганізувати - порушення бойового порядку противника',
        code: '10032500003410000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: 'Сковування противника',
        code: '10032500001512040000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED }
      },
      { hint: 'Вклинення', code: '10032500003418000000', amp: { isSvg: true, type: entityKind.SOPHISTICATED } },
      {
        hint: 'Затримати - затримання маневру противника у визначеному місці та у визначений час',
        code: '10032500003408000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: 'Демонструвати - ввести противника в оману демонстрацією сили без контакту з противником',
        code: '10032500000170080000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: `Хибні дії – хибні дії, які здійснюються для примушення противника до використання резервів або маневру ними, викриття системи вогню, перенесення вогню засобів вогневої підтримки.`,
        code: '10032500000170090000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: 'Відхід – здійснення відходу без контакту з противником',
        code: '10032500003420000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: 'Відхід під натиском',
        code: '10032500003424000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED }
      },
      {
        hint: 'Замінити підрозділи – здійснення заміни підрозділів',
        code: '10032500003419000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: 'Переслідувати – зайняття позицій на маршрутах відходу противника в ході переслідування',
        code: '10032500000170100000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: 'Захоплення ‒ знищити противника у визначеному районі, захопити його',
        code: '10032500003423000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: `Прикрити - забезпечення безпеки головних сил затримкою, дезорганізацією бойового порядку, введенням в оману противника`,
        code: '10032500003422010000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: 'Охороняти - захистити головні сили від раптового нападу противника, затримати просування противника',
        code: '10032500003422020000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: 'Спостерігати - спостереження, виявлення та передача інформації про противника головним силам',
        code: '10032500003422030000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: 'Просування та заміна  – рух за першим ешелоном в готовності до його заміни',
        code: '10032500003412000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED, textAmplifiers: { T: 'T' } },
      },
      {
        hint: 'Просування та підтримка підрозділів – рух за першим ешелоном та підтримка його дії',
        code: '10032500003413000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED, textAmplifiers: { T: 'T' } },
      },
      { hint: 'Знищити', code: '10032500003409000000', amp: {} },
      { hint: 'Подавити (нейтралізувати)', code: '10032500003416000000', amp: {} },
      { hint: 'Запобігти (перешкодити)', code: '10032500003414000000', amp: {} },
      {
        hint: 'Ізолювання противника',
        code: '10032500003415000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED }
      },
      {
        hint: 'Зайняття визначеного району без вогневого контакту з противником',
        code: '10032500003417000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: `Закріпитися – захопити (зайняти) та утримувати позицію, яку противник може використати в ході ведення бою та запобігти її руйнуванню`,
        code: '10032500000170110000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: 'Запобігти захопленню визначеної ділянки місцевості (об’єкту) противником',
        code: '10032500001512050000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: 'Взяти під контроль',
        code: '10032500003421000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED }
      },
      {
        hint: 'Імовірний напрямок удару повітряного противника',
        code: '10062500001514010000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: 'Напрямок удару своєї авіації',
        code: '10032500001406010000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED, textAmplifiers: { T: 'T' } },
      },
      {
        hint: 'Рубіж постановки завад (придушення ППО)',
        code: '10032500000170120000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          color: '#ff0404',
          pointAmplifier: { [amps.T]: 'SEAD' },
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
          right: ENDS_ARROW2
        },
      },
      {
        hint: 'Зона чергування постановників завад',
        code: '10062500001701000000',
        amp: { isSvg: true, type: entityKind.POLYLINE, color: '#ff0404' },
      },
      {
        hint: 'Зона баражування літаків-розвідників (ДРЛВ, ДРЛВУ)',
        code: '10032500000170140000',
        amp: {
          isSvg: true,
          type: entityKind.CURVE,
          color: '#ff0404',
          lineType: types.dashed.value,
          right: ENDS_ARROW2
        },
      },
      {
        hint: 'Головний напрямок атаки',
        code: '10032500001406020000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED, textAmplifiers: { T: 'T' } },
      },
      {
        hint: 'Підтримка атаки',
        code: '10032500001406030000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED, textAmplifiers: { T: 'T' } },
      },
      {
        hint: 'Хибна атака',
        code: '10032500001406050000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED, textAmplifiers: { T: 'T' } },
      },
      {
        hint: 'Смуга руху підрозділів, що проникають в розташування противника',
        code: '10032500001408000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
    ],
  },
  {
    name: 'Ракетні війська і артилерія',
    children: [
      { hint: 'Артилерійська бригада', code: '10031000181303000000', amp: {} },
      { hint: 'Бригадна артилерійська група', code: '10031004171303000000', amp: {} },
      { hint: 'Ракетна бригада', code: '10031000181307000000', amp: {} },
      { hint: 'Реактивна артилерійська бригада', code: '10031000181303004100', amp: {} },
      { hint: 'Реактивний артилерійський полк', code: '10031000171303004100', amp: {} },
      { hint: 'Артилерійський полк', code: '10031000171303000000', amp: {} },
      { hint: 'Артилерійський дивізіон', code: '10031000161303000000', amp: {} },
      { hint: 'Самохідний артилерійський дивізіон', code: '10031000161303010000', amp: {} },
      { hint: 'Реактивний артилерійський дивізіон', code: '10031000161303004100', amp: {} },
      { hint: 'Протитанковий артилерійський дивізіон', code: '10031000161204000000', amp: {} },
      { hint: 'Розвідувальний артилерійський дивізіон', code: '10031000161303030000', amp: {} },
      { hint: 'Ракетний дивізіон', code: '10031000161307000000', amp: {} },
      { hint: 'Гаубична самохідна артилерійська батарея', code: '10031000151303010000', amp: {} },
      { hint: 'Артилерійська батарея', code: '1003100151303000000', amp: {} },
      { hint: 'Реактивна артилерійська батарея', code: '10031000151303004100', amp: {} },
      { hint: 'Стартова батарея', code: '10031000151307000000', amp: {} },
      { hint: 'Протитанкова артилерійська батарея', code: '10031000151204000000', amp: {} },
      { hint: 'Батарея звукової розвідки', code: '10031000151303036200', amp: {} },
      { hint: 'Батарея радіолокаційної розвідки', code: '10031000151303035000', amp: {} },
      { hint: 'Батарея артилерійської розвідки', code: '10031000151303030000', amp: {} },
      { hint: 'Батарея безпілотних літальних апаратів', code: '10031000151219000000', amp: {} },
      { hint: 'Метеорологічна батарея', code: '10031000151303003200', amp: {} },
      { hint: 'Гаубичний самохідний (самохідний) артилерійський взвод', code: '10031000141303010000', amp: {} },
      { hint: 'Артилерійський взвод', code: '10031000141303000000', amp: {} },
      { hint: 'Реактивний артилерійський взвод', code: '10031000141303004100', amp: {} },
      { hint: 'Розрахунок пускової установки', code: '10031000111303005900', amp: {} },
      { hint: 'Взвод управління дивізіону', code: '10031000141303000008', amp: {} },
      { hint: 'Протитанковий артилерійський взвод', code: '10031000141204000000', amp: {} },
      { hint: 'Мінометна батарея', code: '10031000151308000000', amp: {} },
      { hint: 'Мінометний взвод', code: '10031000141308000000', amp: {} },
      { hint: 'Взвод оптичної розвідки', code: '10031000141303032200', amp: {} },
      { hint: 'Топогеодезичний взвод', code: '10031000141421000000', amp: {} },
      { hint: 'Відділення транспортування і перевантаження', code: '10031000121636003400', amp: {} },
      { hint: 'Вогонь по одиночній цілі із зазначенням номера цілі', code: '10032500001603000000', amp: {} },
      {
        hint: 'Зосереджений вогонь',
        code: '10032500002408020000',
        amp: { isSvg: true, type: entityKind.RECTANGLE, pointAmplifier: { [amps.W]: '№' } },
      },
      {
        hint: 'Одинарний нерухомий загороджувальний вогонь',
        code: '10032500002407010000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          textAmplifiers: { N: 'N', B: 'B' },
        },
      },
      {
        hint: 'Рухомий загороджувальний вогонь із зазначенням найменування вогню',
        code: '10032500000170150000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          textAmplifiers: { N: 'N', B: 'B', T: 'T' },
        },
      },
      {
        hint: 'Рухомий загороджувальний вогонь із зазначенням найменування вогню',
        code: '10032500000170780000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          textAmplifiers: { N: 'N', B: 'B' },
        },
      },
      {
        hint: 'Послідовне зосередження вогню',
        code: '10032500000170160000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          textAmplifiers: { T: 'T' },
          params: { count: 5, number: 101 },
        },
      },
      {
        hint: 'Зона цілі',
        code: '10032500002408050000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          textAmplifiers: { N: 'N' },
        },
      },
      {
        hint: 'Смуга ураження керованими снарядами дивізіону (Олово) із зазначенням смуг (зон) ураження батарей',
        code: '10032500000170170000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: 'Район дистанційного мінування місцевості',
        code: '10032500002708000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED, pointAmplifier: { [amps.T]: '', [amps.W]: '' } },
      },
      {
        hint: 'Район розповсюдження агітаційного матеріалу',
        code: '10032500000170180000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: 'Район особливої уваги (РОУ)',
        code: '10032500001202000000',
        amp: { isSvg: true, type: entityKind.POLYGON, pointAmplifier: { [amps.T]: 'POУ' } },
      },
      {
        hint: 'Основний напрямок стрільби (пуску)',
        code: '10032500000170790000',
        amp: { isSvg: true, type: entityKind.POLYLINE, right: ENDS_ARROW2 },
      },
      { hint: 'Вогнева позиція', code: '10032500002501000000', amp: {} },
      { hint: 'Стартова позиція', code: '10032500002503000000', amp: {} },
      { hint: 'Технічна позиція', code: '10032500002504000000', amp: {} },
      {
        hint: 'Район вогневих позицій',
        code: '10032500002405000000rvp',
        amp: { isSvg: true, type: entityKind.POLYGON, pointAmplifier: { [amps.W]: 'РВП' } },
      },
      {
        hint: 'Основний позиційний район',
        code: '10032500002405000000opr',
        amp: { isSvg: true, type: entityKind.POLYGON, pointAmplifier: { [amps.W]: 'ОПР' } },
      },
      {
        hint: 'Рубіж досяжності вогневих засобів',
        code: '10032500000170190000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED }
      },
      {
        hint: 'Ракетний удар',
        code: '10032500000170200000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          pointAmplifier: { [amps.N]: '', [amps.T]: '', [amps.W]: '', [amps.A]: '' },
        }
      },
      {
        hint: 'Район зосередження',
        code: '10032500001502000000',
        amp: { isSvg: true, type: entityKind.AREA, pointAmplifier: { [amps.T]: 'AA' } },
      },
      {
        hint: 'Евакуація населення та надання медичної допомоги (табір розміщення)',
        code: '10032500001507000000',
        amp: { isSvg: true, type: entityKind.AREA, pointAmplifier: { [amps.T]: 'Евак' } },
      },
      { hint: 'Піші дозорні', code: '10032700001101030000', amp: {} },
      {
        hint: 'Зона оглядової розвідки бригади',
        code: '10032500000170220000',
        amp: { isSvg: true, type: entityKind.POLYLINE, pointAmplifier: { [amps.W]: 'ЗОР' } },
      },
      {
        hint: 'Зона детальної розвідки бригади',
        code: '10032500000170230000',
        amp: { isSvg: true, type: entityKind.POLYLINE, pointAmplifier: { [amps.W]: 'ЗДР' } },
      },
      { hint: 'Розвідка боєм', code: '10032500001520000000', amp: { isSvg: true, type: entityKind.SOPHISTICATED } },
      {
        hint: 'Підрозділ (група), який проводить пошук (наліт), із зазначенням належності',
        code: '10032500000170240000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      { hint: 'Розвідувальний загін СпП', code: '10031004151213006300', amp: {} },
      { hint: 'Розвідувальний група СпП', code: '10031004131213006300', amp: {} },
      {
        hint: 'Район висадки розвідувальної групи із зазначенням складу, часу і дати висадки та способу висадки',
        code: '10032500000170260000',
        amp: { isSvg: true, type: entityKind.AREA, pointAmplifier: { [amps.T]: 'П(В)' } },
      },
      { hint: 'Пункт збору військовополонених', code: '10032500003208000000', amp: {} },
      {
        hint: 'Район зосередження військовополонених',
        code: '10032500003102000000',
        amp: { isSvg: true, type: entityKind.AREA, pointAmplifier: { [amps.T]: 'EPWHA' } },
      },
      { hint: 'Пускова установка БПЛА (АПП)', code: '10031000001219000021', amp: {} },
      {
        hint: 'Окремий центр збору, обробки, аналізу інформації технічних видів розвідки',
        code: '10031000001501000000',
        amp: {},
      },
      { hint: 'Регіональний центр РЕР, Центр РЕР ВМС', code: '10031000181501000000', amp: {} },
      { hint: 'Полк радіо та радіотехнічної розвідки', code: '10031000171511000000', amp: {} },
      { hint: 'Окремий центр РЕР', code: '10031000161511000000', amp: {} },
      { hint: 'Маневрений центр РЕР', code: '10031000161511000051', amp: {} },
      { hint: 'Рота РРТР', code: '10031000151213005751', amp: {} },
      { hint: 'Взвод РРТР', code: '10031000141213005751', amp: {} },
    ],
  },
  {
    name: 'Пункти спостереження',
    children: [
      { hint: 'Пункт спостереження (загальне позначення)', code: '10032500001601000000', amp: {} },
      { hint: 'Розвідувальний пункт спостереження', code: '10032500001602010000', amp: {} },
      { hint: 'Передовий пункт спостереження', code: '10032500001602020000', amp: {} },
      {
        hint: 'Пункт спостереження за радіаційною, хімічною та біологічною обстановками',
        code: '10032500001602030000',
        amp: {},
      },
      {
        hint: 'Автоматизований пункт спостереження (обладнаний сенсором або датчиком)',
        code: '10032500001602040000',
        amp: {},
      },
      { hint: 'Пункт спостереження командира (начальника)', code: '10032500001602050000', amp: {} },
    ],
  },
  {
    name: 'Рубежі відкриття вогню',
    children: [
      {
        hint: 'Рубіж відкриття вогню (танків, БМП, стрілецької зброї)',
        code: '10032500000170300000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: 'Зона суцільного багатошарового протитанкового і стрілецького вогню',
        code: '10032500000170310000',
        amp: { isSvg: true, type: entityKind.POLYLINE, lineType: types.chain.value },
      },
    ],
  },
  {
    name: 'Види переправ через водну перешкоду',
    children: [
      { hint: 'Мостова переправа', code: '10032500002714000000', amp: { isSvg: true, type: entityKind.SOPHISTICATED } },
      { hint: 'В брід', code: '10032500002716000000', amp: { isSvg: true, type: entityKind.SOPHISTICATED } },
      {
        hint: 'Паромна',
        code: '10032500002907000000',
        amp: { isSvg: true, type: entityKind.POLYLINE, right: ENDS_ARROW2, left: ENDS_ARROW2 },
      },
      {
        hint: 'На підручних засобах',
        code: '10032500002908000000',
        amp: { isSvg: true, type: entityKind.POLYLINE, left: ENDS_FORK }
      },
      { hint: 'Хибний міст', code: '10031501001305000000', amp: {} },
    ],
  },
  {
    name: 'Протиповітряна оборона',
    children: [
      { hint: 'Командний пункт зенітного ракетного полку', code: '10031002171301020000', amp: {} },
      {
        hint: 'Командний пункт зенітного ракетного (ракетно-артилерійського) дивізіону',
        code: '10031002161301020000',
        amp: {},
      },
      { hint: 'Командний пункт батареї', code: '10031002151301020000', amp: {} },
      { hint: 'Зенітний ракетний взвод', code: '10031000141301020000', amp: {} },
      { hint: 'Взвод забезпечення', code: '10031000141611000000', amp: { [amps.additionalInformation]: 'ТхЗ' } },
      {
        hint: 'Взвод (батарея) управління та радіолокаційної розвідки (начальника протиповітряної оборони)',
        code: '10031000141301005008',
        amp: {},
      },
      { hint: 'Зенітний ракетний (ракетно-артилерійський) дивізіон', code: '10031000161301020000', amp: {} },
      { hint: 'Група регламенту та ремонту', code: '10031000151611000000', amp: {} },
      { hint: 'Технічна батарея', code: '10031000151301003100', amp: { [amps.uniqueDesignation]: 'тб' } },
      {
        hint: 'Сектор відповідальності підрозділу ППО',
        code: '10032500000170320000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED }
      },
      {
        hint: 'Кочуюча БМ (ЗСУ, підрозділ)',
        code: '10032500000170330000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED }
      },
      {
        hint: 'Зона розвідки повітряного противника',
        code: '10032500000170190000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED }
      },
    ],
  },
  {
    name: 'Зв’язок',
    children: [
      { hint: 'Окрема бригада зв’язку', code: '10031000181110000000', amp: {} },
      { hint: 'Окремий полк зв’язку', code: '10031000171110000000', amp: {} },
      {
        hint: 'Інформаційно-телекомунікаційний вузол',
        code: '10031000161110004700',
        amp: { [amps.additionalInformation]: 'ІТВ' },
      },
      { hint: 'Польовий вузол зв’язку', code: '10031000161110004751', amp: { [amps.additionalInformation]: 'ВЗ' } },
      {
        hint: 'Підрозділ із засобами радіозв’язку',
        code: '10031000001110010000',
        amp: { [amps.additionalInformation]: 'РЗ' },
      },
      {
        hint: 'Підрозділ із засобами радіорелейного зв’язку',
        code: '10031000001110020000',
        amp: { [amps.additionalInformation]: 'РРЗ' },
      },
      {
        hint: 'Підрозділ із засобами супутникового зв’язку',
        code: '10031000001110040000',
        amp: { [amps.additionalInformation]: 'СЗ' },
      },
      { hint: 'Станція радіозв’язку', code: '10031500002001000000', amp: { [amps.additionalInformation]: 'РЗ' } },
      {
        hint: 'Станція транкінгового зв’язку',
        code: '10031500002001000000',
        amp: { [amps.additionalInformation]: 'ТрЗ' }
      },
      {
        hint: 'Станція радіорелейного зв’язку',
        code: '10031500002001000000',
        amp: { [amps.additionalInformation]: 'РРЗ' },
      },
      {
        hint: 'Станція тропосферного зв’язку',
        code: '10031500002001000000',
        amp: { [amps.additionalInformation]: 'ТРЗ' }
      },
      {
        hint: 'Станція супутникового зв’язку',
        code: '10031500002001000000',
        amp: { [amps.additionalInformation]: 'CЗ' }
      },
      {
        hint: 'Лінія радіозв’язку',
        code: '10032500000170340000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          intermediateAmplifierType: 'text',
          intermediateAmplifier: { [amps.N]: 'РЗ' }
        },
      },
      {
        hint: 'Лінія транкінгового зв’язку',
        code: '10032500000170350000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          intermediateAmplifierType: 'text',
          intermediateAmplifier: { [amps.N]: 'ТрЗ' }
        },
      },
      {
        hint: 'Лінія радіорелейного зв’язку',
        code: '10032500000170360000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          intermediateAmplifierType: 'text',
          intermediateAmplifier: { [amps.N]: 'РРЗ' }
        },
      },
      {
        hint: 'Лінія тропосферного зв’язку',
        code: '10032500000170370000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          intermediateAmplifierType: 'text',
          intermediateAmplifier: { [amps.N]: 'TРЗ' }
        },
      },
      {
        hint: 'Лінія супутникового зв’язку',
        code: '10032500000170380000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          intermediateAmplifierType: 'text',
          intermediateAmplifier: { [amps.N]: 'CЗ' }
        },
      },
      {
        hint: 'Лінія проводового зв’язку',
        code: '10032500000170390000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          intermediateAmplifierType: 'text',
          intermediateAmplifier: { [amps.N]: 'ПрЗ' }
        },
      },
      {
        hint: 'Вісь (рокада) зв’язку в опорній мережі зв’язку',
        code: '10032500000170400000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          intermediateAmplifierType: 'text',
          intermediateAmplifier: { [amps.N]: '2E1' },
          strokeWidth: 16
        },
      },
      { hint: 'Військовий супутник зв’язку', code: '10030500001111000000', amp: {} },
      { hint: 'Цивільний супутник зв’язку', code: '10030500001206000000', amp: {} },
      { hint: 'Комп’ютерні системи (АСУ, ІС)', code: '10031500002005000000', amp: {} },
      {
        hint: 'База ремонту і зберігання (зберігання і утилізації) засобів зв’язку',
        code: '10031000001110000038',
        amp: {},
      },
      { hint: 'Центральний вузол фельд’єгерсько-поштового зв’язку', code: '10031000171627000000', amp: {} },
      { hint: 'Вузол фельд’єгерсько-поштового зв’язку', code: '10031000161627000000', amp: {} },
      { hint: 'Станція фельд’єгерсько-поштового зв’язку', code: '10031000151627000000', amp: {} },
      { hint: 'Обмінний пункт фельд’єгерсько-поштового зв’язку', code: '10031000131627000000', amp: {} },
      { hint: 'Експедиція (відділення) фельд’єгерсько-поштового зв’язку', code: '10031000121627000000', amp: {} },
      {
        hint: 'Пункт обміну на автомобільному маршруті фельд’єгерсько-поштового зв’язку',
        code: '10032500001301000000',
        amp: { code: '10032500001301000000', amp: { pointAmplifier: { [amps.T]: 'ФПЗ' } } },
      },
      {
        hint: 'Пункт обміну на залізничному маршруті фельд’єгерсько-поштового зв’язку',
        code: '10031000001630000000',
        amp: { [amps.additionalInformation]: 'ФПЗ' },
      },
      {
        hint: 'Автомобіль фельд’єгерсько-поштового зв’язку',
        code: '10031500321401000000',
        amp: { [amps.additionalInformation]: 'ФПЗ' },
      },
      {
        hint: 'Автомобіль фельд’єгерсько-поштового зв’язку броньований',
        code: '10031500321201050000',
        amp: { [amps.additionalInformation]: 'ФПЗ' },
      },
      { hint: 'Потяг (поштовий вагон)', code: '10031500361501000000', amp: { [amps.additionalInformation]: 'ФПЗ' } },
      {
        hint: 'Катер фельд’єгерсько-поштового зв’язку',
        code: '10033000001208000000',
        amp: { [amps.additionalInformation]: 'ФПЗ' },
      },
      {
        hint: 'Маршрут фельд’єгерсько-поштового зв’язку',
        code: '10032500000170410000',
        amp: { isSvg: true, type: entityKind.POLYLINE, right: ENDS_ARROW2 },
      },
      { hint: 'Пошта (поштове відділення)', code: '10032000001209000000', amp: {} },
      {
        hint: 'Державне підприємство спеціального зв’язку',
        code: '10032000000000000000',
        amp: { [amps.specialHeadquarters]: 'ДПСЗ' },
      },
      {
        hint: 'Головне управління урядового фельд’єгерського зв’язку',
        code: '10032000000000000000',
        amp: { [amps.specialHeadquarters]: 'ГУУФЗ' },
      },
    ],
  },
  {
    name: 'Озброєння та військова техніка',
    children: [
      { hint: 'Радіолокаційна станція', code: '10031500002203000000', amp: {} },
      { hint: 'Датчик комплексу РСА', code: '10031500002202000000', amp: {} },
      { hint: 'Танк', code: '10031500001202000000', amp: {} },
      { hint: 'БМП', code: '10031500001201010000', amp: {} },
      { hint: 'БТР', code: '10031500001201030000', amp: {} },
      { hint: 'Автомобіль', code: '10031500001401000000', amp: {} },
      { hint: 'Загальне позначення мінометів', code: '10031500001114000000', amp: {} },
      { hint: 'Малого калібру (до 60 мм)', code: '10031500001114010000', amp: {} },
      { hint: 'Середнього калібру (до 107мм)', code: '10031500001114020000', amp: {} },
      { hint: 'Великого калібру (107мм і більше)', code: '10031500001114030000', amp: {} },
      { hint: 'Легкий (ручний) кулемет', code: '10031500001102010000', amp: {} },
      { hint: 'Середній (ротний або станковий) кулемет', code: '10031500001102020000', amp: {} },
      { hint: 'Важкий (великокаліберний) кулемет', code: '10031500001102030000', amp: {} },
      { hint: 'Гранатомет', code: '10031500001103000000', amp: {} },
      { hint: 'Легкий гранатомет (підствольний)', code: '10031500001103010000', amp: {} },
      { hint: 'Багатозарядний гранатомет', code: '10031500001103020000', amp: {} },
      { hint: 'Важкий (автоматичний) гранатомет', code: '10031500001103030000', amp: {} },
      { hint: 'Протитанкова ракета легка', code: '10031500001117010000', amp: {} },
      { hint: 'Протитанкова ракета середня', code: '10031500001117020000', amp: {} },
      { hint: 'Протитанкова ракета важка', code: '10031500001117030000', amp: {} },
      { hint: 'Пускова установка - легкий ПТРК', code: '10031500001112010000', amp: {} },
      { hint: 'Пускова установка - середній ПТРК', code: '10031500001112020000', amp: {} },
      { hint: 'Пускова установка - важкий ПТРК', code: '10031500001112030000', amp: {} },
      { hint: 'Протитанкова гармата', code: '10031500351106000000', amp: {} },
      { hint: 'ПТРК (на колісній базі)', code: '10031500311112020000', amp: {} },
      { hint: 'ПТРК (на гусеничній базі)', code: '10031500331112020000', amp: {} },
      { hint: '122 мм гаубиця, що буксирується', code: '10031500351109010000', amp: {} },
      { hint: '152 мм гаубиця, що буксирується', code: '10031500351109020000', amp: {} },
      { hint: '122 мм самохідна гаубиця', code: '10031500331109010000', amp: {} },
      { hint: '152 мм самохідна гаубиця', code: '10031500331109020000', amp: {} },
      { hint: '120 мм самохідна гармата', code: '10031500331107010000', amp: {} },
      { hint: '152 мм самохідна гармата', code: '10031500331107020000', amp: {} },
      { hint: '203 мм самохідна гармата', code: '10031500331107030000', amp: {} },
      { hint: 'Ракетна пускова установка малої дальності', code: '10031500321116010000', amp: {} },
      { hint: 'Ракетна пускова установка середньої дальності', code: '10031500321116020000', amp: {} },
      { hint: 'Ракетна пускова установка великої дальності', code: '10031500321116030000', amp: {} },
      { hint: 'Пускова установка ТР', code: '10031500321113000000', amp: {} },
      { hint: '82 мм міномет, що буксирується', code: '10031500351114020000', amp: {} },
      { hint: 'Загальне позначення (ПЗРК)', code: '10031500001111000000', amp: {} },
      { hint: 'Бойова машина 9А34 (9А35)', code: '10031500331111010000', amp: {} },
      { hint: 'Зенітна самохідна установка 2С6', code: '10031500331105020000', amp: {} },
      { hint: 'Бойова машина 9А33БМ3', code: '10031500321111010000', amp: {} },
      { hint: 'Зенітна самохідна установка 2А6', code: '10031500331105010000', amp: {} },
      { hint: 'Зенітна установка ЗУ-23-2', code: '10031500311105010000', amp: {} },
      { hint: 'Транспортно-заряджаюча машина', code: '10031500321401000000', amp: {} },
      { hint: 'Радіолокаційна станція', code: '10031500312203000000', amp: {} },
      { hint: 'Командно-штабна машина (без зазначення засобів зв’язку) на БМП', code: '10031500321201020000', amp: {} },
      {
        hint: 'Командно-штабна машина (без зазначення засобів зв’язку) на ББМ',
        code: '10031500001201050000',
        amp: { [amps.specialHeadquarters]: 'С2' },
      },
      { hint: 'КМУ (1В110, 1В111)', code: '10031500321401000000', amp: {} },
      { hint: 'КМУ (1В119, ЛБР – ARM-M1114 )', code: '10031500311201050000', amp: {} },
      { hint: 'ПРП – 3 (4)', code: '10031500321201010000', amp: {} },
      { hint: 'СНАР (АРК, AN/TPQ)', code: '10031500331201030000', amp: {} },
      { hint: 'АЗК-7', code: '10031500321401000000', amp: {} },
      { hint: 'Топоприв’язник 1Т12', code: '10031500321401000000', amp: {} },
    ],
  },
  {
    name: 'Авіація',
    children: [
      { hint: 'Літак (загальне позначення)', code: '10030100001101000000', amp: {} },
      { hint: 'Літак винищувач', code: '10030100001101000400', amp: {} },
      { hint: 'Літак винищувач середній (типу МіГ-29)', code: '10030100001101000402', amp: {} },
      { hint: 'Літак винищувач важкий (типу Су-27, Су-30)', code: '10030100001101000401', amp: {} },
      { hint: 'Літак штурмовик', code: '10030100001101000100', amp: {} },
      { hint: 'Літак радіоелектронної боротьби (РЕБ)', code: '10030100001101001600', amp: {} },
      { hint: 'Розвідувальний літак', code: '10030100001101001800', amp: {} },
      { hint: 'Тренувальний літак', code: '10030100001101001900', amp: {} },
      { hint: 'Літак багатоцільовий', code: '10030100001101003600', amp: {} },
      { hint: 'Літак допоміжний (загального застосування)', code: '10030100001101000700', amp: {} },
      { hint: 'Літак бомбардувальник', code: '10030100001101000200', amp: {} },
      { hint: 'Літак бомбардувальник середній (типу Су-24)', code: '10030100001101000202', amp: {} },
      { hint: 'Літак бомбардувальник важкий (типу Ту-22)', code: '10030100001101000201', amp: {} },
      { hint: 'Літак транспортний', code: '10030100001101000300', amp: {} },
      { hint: 'Літак транспортний легкий (типу Ан-2)', code: '10030100001101000303', amp: {} },
      { hint: 'Літак транспортний середній (типу Ан-26)', code: '10030100001101000302', amp: {} },
      { hint: 'Літак транспортний важкий (типу Іл-76)', code: '10030100001101000301', amp: {} },
      { hint: 'Літак санітарний (медичної евакуації)', code: '10030100001101001400', amp: {} },
      { hint: 'Літак протичовновий', code: '10030100001101002200', amp: {} },
      { hint: 'Літак - повітряний пункт управління', code: '10030100001101001100', amp: {} },
      { hint: 'Безпілотний літальний апарат', code: '10030100001103000000', amp: {} },
      { hint: 'Безпілотний літальний апарат легкий', code: '10030100001103000003', amp: {} },
      { hint: 'Безпілотний літальний апарат середній', code: '10030100001103000002', amp: {} },
      { hint: 'Безпілотний літальний апарат важкий', code: '10030100001103000001', amp: {} },
      { hint: 'Військовий повітряний засіб із рухомим крилом (вертоліт)', code: '10030100001102000000', amp: {} },
      { hint: 'Бойовий (ударний) повітряний засіб (вертоліт)', code: '10030100001102000100', amp: {} },
      { hint: 'Транспортний повітряний засіб (вертоліт)', code: '10030100001102000300', amp: {} },
      { hint: 'Повітряний засіб (вертоліт) радіоелектронної боротьби (РЕБ)', code: '10030100001102001600', amp: {} },
      { hint: 'Розвідувальний повітряний засіб (вертоліт)', code: '10030100001102001800', amp: {} },
      { hint: 'Багатоцільовий повітряний засіб (вертоліт)', code: '10030100001102003600', amp: {} },
      {
        hint: 'Допоміжний (загального застосування) повітряний засіб (вертоліт)',
        code: '10030100001102000700',
        amp: {}
      },
      { hint: 'Вертоліт - повітряний пункт управління', code: '10030100001102001100', amp: {} },
      { hint: 'Вертоліт санітарний (медичної евакуації)', code: '10030100001102001400', amp: {} },
      { hint: 'Цивільне повітряне судно', code: '10030100001201000000', amp: {} },
      { hint: 'Цивільний вертоліт', code: '10030100001202000000', amp: {} },
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
        amp: { [amps.additionalInformation]: 'A' }
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
        amp: { [amps.additionalInformation]: 'F' }
      },
      { hint: 'Авіаційна ланка (штурмова)', code: '10031000151208000000', amp: { [amps.additionalInformation]: 'A' } },
      {
        hint: 'Авіаційна ланка (бомбардувальна)',
        code: '10031000151208000000',
        amp: { [amps.additionalInformation]: 'B' },
      },
      {
        hint: 'Авіаційна ланка (розвідувальна)',
        code: '10031000151208000000',
        amp: { [amps.additionalInformation]: 'R' }
      },
      {
        hint: 'Бригада транспортної авіації',
        code: '10031000181208000000',
        amp: { [amps.additionalInformation]: 'C' }
      },
      { hint: 'Навчальна авіаційна бригада', code: '10031000181207000000', amp: { [amps.additionalInformation]: 'T' } },
      { hint: 'Техніко-експлуатаційна частина (авіаційна)', code: '10031000161208003100', amp: {} },
      {
        hint: 'Спеціальна інженерна служба',
        code: '10031000151407000000',
        amp: { [amps.additionalInformation]: 'ІнжС' }
      },
      { hint: 'Група технічної розвідки', code: '10031000141611000000', amp: { [amps.additionalInformation]: 'ТхР' } },
      { hint: 'Евакуаційна група', code: '10031000141611000000', amp: { [amps.additionalInformation]: 'ЕВ' } },
      {
        hint: 'Авіаційний склад ракетного озброєння та боєприпасів',
        code: '10032000001103000000',
        amp: { [amps.additionalInformation]: 'Авіа' },
      },
      {
        hint: `Об’єднаний центр забезпечення авіаційними засобами ураження, озброєння та військової техніки. Арсенал авіаційних засобів ураження`,
        code: '10032000001208010000',
        amp: { [amps.additionalInformation]: 'Авіа' },
      },
      { hint: 'Арсенал', code: '10032000001208010000', amp: {} },
      { hint: 'Авіаційний склад ракетного озброєння та боєприпасів', code: '10031000001622007800', amp: {} },
      {
        hint: 'Об’єднаний центр зберігання засобів ураження, озброєння та військової техніки',
        code: '10031000001643000000',
        amp: {},
      },
      { hint: 'Об’єднаний центр матеріально-технічного забезпечення', code: '10031000001645000000', amp: {} },
      { hint: 'База авіаційно-технічного забезпечення', code: '10031000001645007800', amp: {} },
      { hint: 'Окремий інженерно-аеродромний батальйон', code: '10031000161611007800', amp: {} },
      { hint: 'Батальйон аеродромно-технічного забезпечення', code: '10031000161634007800', amp: {} },
      {
        hint: 'Авіаційна комендатура оперативного аеродрому',
        code: '10031000001603000000',
        amp: { [amps.additionalInformation]: 'АвК' },
      },
      {
        hint: 'Рубіж введення винищувачів до бою',
        code: '10032500000170420000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED }
      },
      {
        hint: 'Район повітряного бою',
        code: '10032500001200000000rpb',
        amp: { isSvg: true, type: entityKind.AREA, pointAmplifier: { [amps.T]: 'РПБ' } },
      },
      {
        hint: 'Завдання повітряного удару',
        code: '10032500000170430000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED }
      },
      {
        hint: 'Напрямок дій авіації / повітряного десанту',
        code: '10032500001514010000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: 'Напрямок дій вертольотів',
        code: '10032500001514020000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED }
      },
    ],
  },
  {
    name: 'Зенітні ракетні війська Повітряних Сил',
    children: [
      { hint: 'Зенітна ракетна бригада (загальне позначення)', code: '10031000181301020000', amp: {} },
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
        amp: { isSvg: true, type: entityKind.SOPHISTICATED }
      },
      {
        hint: 'Зона ураження / виявлення (сектор)',
        code: '10032500000170760000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED }
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
        code: '10032500001701010000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          textAmplifiers: { T: 'T', AM: 'AM', X: 'X', X1: 'X1', W: 'W', W1: 'W1' },
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
      { hint: 'Транспортна машина ЗРК', code: '10031500321401000000', amp: {} },
      { hint: 'Радіолокатор виявлення на буксирній тязі', code: '10031500352203000000', amp: {} },
      { hint: 'Радіолокатор виявлення самохідний', code: '10031500322203000000', amp: {} },
      { hint: 'Радіолокатор виявлення на гусеничному бронетранспортері', code: '10031500332203000000', amp: {} },
    ],
  },
  {
    name: 'Зв’язок, радіотехнічне забезпечення, автоматизовані та інформаційні системи',
    children: [
      { hint: 'Командний пункт радіотехнічної бригади', code: '10031002181301005000', amp: {} },
      { hint: 'Командний пункт радіотехнічного батальйону', code: '10031002161301005000', amp: {} },
      { hint: 'Командно-спостережний пункт окремої радіолокаційної роти', code: '10031002151301005000', amp: {} },
      { hint: 'Радіотехнічна бригада', code: '10031000181301005000', amp: {} },
      { hint: 'Радіотехнічний батальйон', code: '10031000161301005000', amp: {} },
      { hint: 'Окрема радіолокаційна рота', code: '10031000151301005000', amp: {} },
      { hint: 'Окремий радіолокаційний взвод', code: '10031000141301005000', amp: {} },
      { hint: 'Обслуга засобу радіолокації', code: '10031000111301005000', amp: {} },
      { hint: 'Засіб радіолокації', code: '10031500002203000000', amp: {} },
      {
        hint: 'Зона радіолокаційної інформації, Поле ближньої радіонавігації, Поле управління авіацією (кругова)',
        code: '10032500000170190000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: 'Зона радіолокаційної інформації, Поле ближньої радіонавігації, Поле управління авіацією (сектор)',
        code: '10032500000170760000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: 'Потрібний рубіж видачі розвідувальної інформації',
        code: '10032500001100000000pi',
        amp: { isSvg: true, type: entityKind.POLYLINE, [amps.N]: 'PL РІ' },
      },
      {
        hint: 'Потрібний рубіж видачі бойової інформації',
        code: '10032500001100000000bi',
        amp: { isSvg: true, type: entityKind.POLYLINE, [amps.N]: 'PL БІ' },
      },
      { hint: 'Батальйон зв’язку та радіотехнічного забезпечення', code: '10031000161110005000', amp: {} },
      { hint: 'Привідний радіомаркерний пункт', code: '10031500311401000000', amp: {} },
      { hint: 'Радіолокаційна система посадки', code: '10031500311401000000', amp: {} },
      { hint: 'Автоматичний радіопеленгатор ультракороткохвильового діапазону', code: '10031500311401000000', amp: {} },
      { hint: 'Радіотехнічна система ближньої навігації', code: '10031500311401000000', amp: {} },
      { hint: 'Курсовий радіомаяк', code: '10031500311401000000', amp: {} },
      { hint: 'Радіотехнічна система дальньої навігації', code: '10031500311401000000', amp: {} },
    ],
  },
  {
    name: 'Військово-Морські Сили',
    children: [
      { hint: 'Бригада надводних кораблів', code: '10031002181701000000', amp: {} },
      { hint: 'Морська авіаційна бригада', code: '10031002181207004600', amp: {} },
      { hint: 'Бригада морської піхоти', code: '10031002181211014600', amp: {} },
      { hint: 'Окрема берегова реактивна артилерійська бригада', code: '10031002181701004100', amp: {} },
      { hint: 'Окрема берегова артилерійська бригада', code: '10031002181303004600', amp: {} },
      { hint: 'Загін морської охорони ДПС', code: '10031002181701000500', amp: {} },
      { hint: 'Командно-розвідувальний центр', code: '10031002171213004600', amp: { [amps.uniqueDesignation]: 'КРЦ' } },
      { hint: 'Центр РЕР', code: '10031002171511004600', amp: {} },
      { hint: 'Центр НГГМЗ', code: '10031002171421004600', amp: {} },
      { hint: 'Дивізіон надводних кораблів', code: '10031002161701000000', amp: { [amps.uniqueDesignation]: 'НК' } },
      { hint: 'Береговий ракетний полк', code: '10031002171307004600', amp: {} },
      {
        hint: 'Дивізіон  кораблів (катерів) охорони рейду',
        code: '10031002161701000000',
        amp: { [amps.uniqueDesignation]: 'КОВР' },
      },
      {
        hint: 'Морський розвідувальний пункт',
        code: '10031002161213004600',
        amp: { [amps.specialHeadquarters]: 'МРП' }
      },
      { hint: 'Окремий батальйон морської піхоти', code: '10031002161211014600', amp: {} },
      { hint: 'Дивізіон пошуково-рятувальних суден', code: '10031002161418004600', amp: {} },
      { hint: 'Дивізіон суден забезпечення', code: '10031002161600004600', amp: {} },
      { hint: 'Окремий береговий ракетний дивізіон', code: '10031002161307004600', amp: {} },
      { hint: 'Самохідний артилерійський дивізіон', code: '10031002161303014600', amp: {} },
      { hint: 'Загін боротьби з ПДСЗ', code: '10031002160000004600', amp: { [amps.specialHeadquarters]: 'БПДСЗ' } },
      { hint: 'Великий підводний човен', code: '10033500000000000000', amp: { [amps.specialHeadquarters]: 'ВПЧ' } },
      { hint: 'Середній підводний човен', code: '10033500000000000000', amp: { [amps.specialHeadquarters]: 'СПЧ' } },
      { hint: 'Малий підводний човен', code: '10033500000000000000', amp: { [amps.specialHeadquarters]: 'МПЧ' } },
      { hint: 'Надмалий підводний човен', code: '10033500000000000000', amp: { [amps.specialHeadquarters]: 'НМПЧ' } },
      { hint: 'Навчальний підводний човен', code: '10033500000000000000', amp: { [amps.specialHeadquarters]: 'НПЧ' } },
      { hint: 'Підводний безекіпажний апарат', code: '10033500001104000000', amp: {} },
      { hint: 'Фрегат КРЗ', code: '10033000001202041500', amp: {} },
      { hint: 'Фрегат', code: '10033000001202040000', amp: {} },
      { hint: 'Корвет КРЗ', code: '10033000001202051500', amp: {} },
      { hint: 'Корвет', code: '10033000001202050000', amp: {} },
      { hint: 'Ракетний катер', code: '10033000001202020000', amp: {} },
      { hint: 'Великий патрульний корабель', code: '10033000001205020002', amp: {} },
      { hint: 'Середній патрульний корабель', code: '10033000001205020004', amp: {} },
      { hint: 'Малий патрульний корабель', code: '10033000001205020003', amp: {} },
      { hint: 'Патрульний катер', code: '10033000001205020000', amp: {} },
      { hint: 'Протидиверсійний катер', code: '10033000000000000000', amp: { [amps.specialHeadquarters]: 'ПДРКА' } },
      { hint: 'Мінний загороджувач', code: '10033000001204010000', amp: {} },
      { hint: 'Протимінний корабель', code: '10033000001204050000', amp: {} },
      { hint: 'Морський тральщик', code: '10033000001204020000', amp: {} },
      { hint: 'Базовий тральщик', code: '10033000001204000000', amp: {} },
      { hint: 'Рейдовий тральщик', code: '10033000000000000000', amp: { [amps.specialHeadquarters]: 'РТЩ' } },
      { hint: 'Великий десантний корабель', code: '10033000001203070002', amp: {} },
      { hint: 'Середній десантний корабель', code: '10033000001203070004', amp: {} },
      { hint: 'Малий десантний корабель', code: '10033000001203070003', amp: {} },
      { hint: 'Десантний катер', code: '10033000001203080000', amp: {} },
      { hint: 'Корабель управління', code: '10033000001301030000', amp: {} },
      { hint: 'Великий розвідувальний корабель', code: '10033000001301040002', amp: {} },
      { hint: 'Середній розвідувальний корабель', code: '10033000001301040004', amp: {} },
      { hint: 'Малий розвідувальний корабель', code: '10033000001301040003', amp: {} },
      {
        hint: 'Великий артилерійський катер',
        code: '10033000000000000000',
        amp: { [amps.specialHeadquarters]: 'ВАКА' }
      },
      {
        hint: 'Малий броньований артилерійський катер',
        code: '10033000000000000000',
        amp: { [amps.specialHeadquarters]: 'МБАКА' },
      },
      { hint: 'Артилерійський катер', code: '10033000000000000000', amp: { [amps.specialHeadquarters]: 'АКА' } },
      { hint: 'Рятувальне буксирне судно', code: '10033000000000000000', amp: { [amps.specialHeadquarters]: 'РБС' } },
      {
        hint: 'Протипожежне буксирне судно',
        code: '10033000000000000000',
        amp: { [amps.specialHeadquarters]: 'ПЖБС' }
      },
      { hint: 'Морський рятувальний буксир', code: '10033000000000000000', amp: { [amps.specialHeadquarters]: 'МРБ' } },
      { hint: 'Морське водолазне судно', code: '10033000000000000000', amp: { [amps.specialHeadquarters]: 'МВС' } },
      { hint: 'Рейдовий водолазний катер', code: '10033000000000000000', amp: { [amps.specialHeadquarters]: 'РВКА' } },
      { hint: 'Протипожежний катер', code: '10033000000000000000', amp: { [amps.specialHeadquarters]: 'ПЖКА' } },
      { hint: 'Санітарний катер', code: '10033000001401160000', amp: {} },
      { hint: 'Навчальний корабель', code: '10033000000000000000', amp: { [amps.specialHeadquarters]: 'НК' } },
      { hint: 'Судно-мішень', code: '10033000000000000000', amp: { [amps.specialHeadquarters]: 'СМ' } },
      { hint: 'Навчально-тренувальне судно', code: '10033000000000000000', amp: { [amps.specialHeadquarters]: 'НТС' } },
      { hint: 'Навчальний катер', code: '10033000000000000000', amp: { [amps.specialHeadquarters]: 'НКА' } },
      { hint: 'Катер-торпедолов', code: '10033000000000000000', amp: { [amps.specialHeadquarters]: 'ТЛ' } },
      { hint: 'Плавучий склад', code: '10033000000000000000', amp: { [amps.specialHeadquarters]: 'ПСКЛ' } },
      { hint: 'Судно комплексного постачання', code: '10033000001301020000', amp: {} },
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
      { hint: 'Морський танкер', code: '10033000001301100000', amp: {} },
      { hint: 'Морський транспорт озброєння', code: '10033000001301010000', amp: {} },
      { hint: 'Суховантажна баржа', code: '10033000001302020000', amp: {} },
      { hint: 'Судно нафто-сміттєзбирач', code: '10033000000000000000', amp: { [amps.specialHeadquarters]: 'НСЗ' } },
      { hint: 'Плавмайстерня', code: '10033000001301110000', amp: {} },
      { hint: 'Кілекторне судно', code: '10033000000000000000', amp: { [amps.specialHeadquarters]: 'КІЛС' } },
      { hint: 'Судно розмагнічування', code: '10033000000000000000', amp: { [amps.specialHeadquarters]: 'СР' } },
      {
        hint: 'Судно контролю фізичних полів',
        code: '10033000000000000000',
        amp: { [amps.specialHeadquarters]: 'СКФП' }
      },
      { hint: 'Морський буксир', code: '10033000001301120000', amp: {} },
      { hint: 'Плавучий кран', code: '10033000000000000000', amp: { [amps.specialHeadquarters]: 'ПКН' } },
      { hint: 'Судно зв’язку', code: '10033000000000000000', amp: { [amps.specialHeadquarters]: 'СЗВ' } },
      { hint: 'Плавказарма', code: '10033000000000000000', amp: { [amps.specialHeadquarters]: 'ПКЗ' } },
      { hint: 'Катер зв’язку', code: '10033000000000000000', amp: { [amps.specialHeadquarters]: 'КАЗВ' } },
      { hint: 'Рейдовий буксир', code: '10033000000000000000', amp: { [amps.specialHeadquarters]: 'РБ' } },
      { hint: 'Морський катер', code: '10033000000000000000', amp: { [amps.specialHeadquarters]: 'МКА' } },
      { hint: 'Рейдовий (роз’їзний) катер', code: '10033000000000000000', amp: { [amps.specialHeadquarters]: 'РРКА' } },
      {
        hint: 'Великий гідрографічний катер',
        code: '10033000000000000000',
        amp: { [amps.specialHeadquarters]: 'ВГКА' }
      },
      { hint: 'Малий гідрографічний катер', code: '10033000000000000000', amp: { [amps.specialHeadquarters]: 'МГКА' } },
      { hint: 'Надводний безекіпажний апарат', code: '10033000001207000000', amp: {} },
      { hint: 'Протичовновий літак', code: '10030100001101002200', amp: {} },
      { hint: 'Протичовновий вертоліт', code: '10030100001102002200', amp: {} },
      { hint: 'Пошуково-рятувальний літак', code: '10030100001101002600', amp: {} },
      { hint: 'Пошуково-рятувальний вертоліт', code: '10030100001102002600', amp: {} },
      { hint: 'Протикорабельна ракета', code: '10030200001100000202', amp: {} },
      {
        hint: 'Крилата ракета морського базування для ураження надводних та берегових цілей',
        code: '10030200001100000702',
        amp: {},
      },
      { hint: 'Морська міна', code: '10033600001100000000', amp: {} },
      { hint: 'Нейтралізована морська міна', code: '10033600001109000000', amp: {} },
      { hint: 'Донна міна', code: '10033600001101000000', amp: {} },
      { hint: 'Якірна міна', code: '10033600001102000000', amp: {} },
      { hint: 'Дрейфуюча міна', code: '10033600001103000000', amp: {} },
      { hint: 'Плаваюча міна', code: '10033600001105000000', amp: {} },
      {
        hint: 'Район тралення',
        code: '10032500000170440000',
        amp: { isSvg: true, type: entityKind.POLYGON, lineType: types.dashed.value }
      },
      { hint: 'Торпеда', code: '10032500002110000000', amp: {} },
      { hint: 'Радіогідроакустичний буй в бойовому положенні', code: '10032500002135000000', amp: {} },
      { hint: 'Радіогідроакустичний буй нейтралізований', code: '10032500002135100000', amp: {} },
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
        amp: { [amps.uniqueDesignation]: 'ПУ' }
      },
      { hint: 'Корабельна тральна група', code: '10033000001210030000', amp: { [amps.uniqueDesignation]: 'Т' } },
      { hint: 'Корабельна група загородження', code: '10033000001210030000', amp: { [amps.uniqueDesignation]: 'З' } },
      { hint: 'Корабельна десантна група', code: '10033000001210030000', amp: { [amps.uniqueDesignation]: 'Д' } },
      { hint: 'Десантний загін', code: '10033000001210040000', amp: { [amps.uniqueDesignation]: 'Д' } },
      { hint: 'Розвідувально-диверсійна група', code: '10033000001210030000', amp: { [amps.uniqueDesignation]: 'РД' } },
      {
        hint: 'Несення дозорної служби, спостереження',
        code: '10032500003422010000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: 'Несення дозорної служби, охорона об’єкту',
        code: '10032500003422020000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: 'Несення дозорної служби, патрулювання',
        code: '10032500003422030000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: 'Район протимінних дій',
        code: '10032500000170460000',
        amp: { isSvg: true, type: entityKind.RECTANGLE, pointAmplifier: { [amps.T]: 'РПД' } },
      },
      {
        hint: 'Район пошуку підводних човнів',
        code: '10032500000170470000',
        amp: { isSvg: true, type: entityKind.RECTANGLE, pointAmplifier: { [amps.T]: 'РП' } },
      },
      {
        hint: 'Район постановки мін',
        code: '10032500000170480000',
        amp: { isSvg: true, type: entityKind.RECTANGLE, pointAmplifier: { [amps.T]: 'MW' } },
      },
      {
        hint: 'Підтримка вогнем, ведення прямого вогню по противнику з метою підтримки маневру іншого підрозділу',
        code: '10032500001521000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: 'Охорона та оборона пункту базування',
        code: '10032500003421000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED }
      },
      {
        hint: 'Стеження за противником',
        code: '10032500000170490000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED }
      },
      { hint: 'Район ізоляції', code: '10032500000170500000', amp: { isSvg: true, type: entityKind.POLYGON } },
      { hint: 'Пункт призначення', code: '10032500002102000000', amp: {} },
      { hint: 'Точка фіксації акустичного контакту', code: '10032500002123000000', amp: {} },
      { hint: 'Точка фіксації електромагнітного контакту', code: '10032500002124000000', amp: {} },
      { hint: 'Точка фіксації контакту оптичними засобами', code: '10032500002126000000', amp: {} },
      { hint: 'Пошук', code: '10032500002131000000', amp: {} },
      { hint: 'Район пошуку', code: '10032500002132000000', amp: {} },
      { hint: 'Постраждале судно', code: '10032500002180000000', amp: {} },
      { hint: 'Затоплений літак', code: '10032500002181000000', amp: {} },
      { hint: 'Людина у воді', code: '10032500002182000000', amp: {} },
      { hint: 'Пункт базування', code: '10032500002128000000', amp: { [amps.additionalInformation]: 'ПБ' } },
      { hint: 'Порт', code: '10032500002128000000', amp: { [amps.additionalInformation]: 'П' } },
      { hint: 'Морський порт', code: '10032000001213090000', amp: {} },
      { hint: 'Точка позначення затопленого об’єкта', code: '10032500002121000000', amp: {} },
    ],
  },
  {
    name: 'Десантно-штурмові війська',
    children: [
      { hint: 'Окрема десантно-штурмова бригада', code: '10031000180000000100', amp: {} },
      { hint: 'Окрема повітрянодесантна бригада', code: '10031000180000000001', amp: {} },
      { hint: 'Окрема аеромобільна бригада', code: '10031000181201000000', amp: {} },
      { hint: 'Аеромобільний батальйон без броньованої техніки', code: '10031000161201000000', amp: {} },
      { hint: 'Десантно-штурмовий батальйон без броньованої техніки', code: '10031000161211000100', amp: {} },
      { hint: 'Парашутно-десантний батальйон без броньованої техніки', code: '10031000161211000001', amp: {} },
      { hint: 'Десантно-штурмовий батальйон на БТР', code: '10031000161211020151', amp: {} },
      { hint: 'Парашутно-десантний батальйон на БМД (БМП)', code: '10031000161211020001', amp: {} },
      { hint: 'Аеромобільно-десантна рота', code: '10031000151201000000', amp: {} },
      { hint: 'Десантно-штурмова рота на колісних бронеавтомобілях', code: '10031000151211020151', amp: {} },
      { hint: 'Парашутно-десантна рота на БМД (БМП)', code: '10031000151211020001', amp: {} },
      { hint: 'Аеромобільно-десантний взвод без броньованої техніки', code: '10031000141201000000', amp: {} },
      { hint: 'Десантно-штурмовий взвод без броньованої техніки', code: '10031000141211000100', amp: {} },
      { hint: 'Парашутно-десантний взвод без броньованої техніки', code: '10031000141211000001', amp: {} },
      { hint: 'Бригадна тактична група (БрТГр)', code: '10031004180000000100', amp: {} },
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
      { hint: 'Батальйонна тактична група (БТГр) на БМД (БМП)', code: '10031004161211020001', amp: {} },
      { hint: 'Танкова рота десантно-штурмової бригади', code: '10031000151205000100', amp: {} },
      { hint: 'Танкова рота повітрянодесантної бригади', code: '10031000151205000001', amp: {} },
      { hint: 'Розвідувальна рота десантно-штурмової бригади', code: '10031000151213000100', amp: {} },
      { hint: 'Розвідувальна рота повітряно-десантної бригади', code: '10031000151213000001', amp: {} },
      { hint: 'Інженерно-саперний взвод десантно-штурмової бригади', code: '10031000141407000100', amp: {} },
      { hint: 'Інженерно-саперний взвод повітряно-десантної бригади', code: '10031000141407000001', amp: {} },
      {
        hint: 'Інженерно-саперний взвод аеромобільної бригади',
        code: '10031000141407000000',
        amp: { [amps.additionalInformation]: 'Аер' },
      },
      { hint: 'Реактивна батарея', code: '10031000151303004100', amp: {} },
      {
        hint: 'Гаубичний дивізіон окремої аеромобільної бригади',
        code: '10031000161303000000',
        amp: { [amps.uniqueDesignation]: 'гадн' },
      },
      { hint: 'Гаубично-самохідний дивізіон', code: '10031000161303010001', amp: {} },
    ],
  },
  {
    name: 'Сили спеціальних операцій',
    children: [
      { hint: 'Група спеціального призначення Сил спеціальних операцій', code: '10031000131218000000', amp: {} },
      { hint: 'Загін спеціального призначення Сил спеціальних операцій', code: '10031000161218000000', amp: {} },
      { hint: 'Тактична група спеціальних операцій (SOTG)', code: '10031004161218000000', amp: {} },
      { hint: 'Окремий полк спеціального призначення Сил спеціальних операцій', code: '10031000171218000000', amp: {} },
      {
        hint: 'Морський підрозділ плавзасобів зі складу Сил спеціальних операцій',
        code: '10031000001701006300',
        amp: {},
      },
      {
        hint: 'Морський центр спеціального призначення Сил спеціальних операцій',
        code: '10031000171218004600',
        amp: {}
      },
      { hint: 'Вертолітний підрозділ зі складу Сил спеціальних операцій', code: '10031000001206006300', amp: {} },
      {
        hint: 'Вертолітний підрозділ пошуку та рятування зі складу Сил спеціальних операцій',
        code: '10031000001206006357',
        amp: {},
      },
      {
        hint: 'Навчально-тренувальний центр Сил спеціальних операцій',
        code: '10031000171218000000',
        amp: { [amps.uniqueDesignation]: 'НТЦ' },
      },
      { hint: 'Авіаційний підрозділ зі складу Сил спеціальних операцій', code: '10031000001208006300', amp: {} },
      { hint: 'Формування спеціальних бойових малих підводних човнів', code: '10031000001218046300', amp: {} },
      { hint: 'Інформаційно-телекомунікаційний вузол Сил спеціальних операцій', code: '10031000161110006300', amp: {} },
      {
        hint: 'Військова частина (підрозділ) забезпечення та управління Сил спеціальних операцій',
        code: '10031000001600006300',
        amp: {},
      },
      {
        hint: 'Ведення спеціальної розвідки Гр СпП ССпО',
        code: '10032500001522000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: 'Район підрозділу зі складу руху опору',
        code: '10032500000170520000',
        amp: { isSvg: true, type: entityKind.AREA }
      },
      {
        hint: 'Район виконання завдань Гр СпП ССпО',
        code: '100325000012000000000spr',
        amp: { isSvg: true, type: entityKind.AREA, pointAmplifier: { [amps.W]: 'СпР' } },
      },
      {
        hint: 'Район евакуації',
        code: '10032500001507000000',
        amp: { isSvg: true, type: entityKind.AREA, pointAmplifier: { [amps.T]: 'ЕВАК' } },
      },
      {
        hint: 'Виведення через державний кордон',
        code: '10032500000170540000',
        amp: { isSvg: true, type: entityKind.CURVE, pointAmplifier: { [amps.W]: 'Bx' }, right: ENDS_ARROW2 },
      },
      {
        hint: 'Повернення через лінію зіткнення військ',
        code: '10032500000170550000',
        amp: { isSvg: true, type: entityKind.CURVE, pointAmplifier: { [amps.W]: 'Вих' }, right: ENDS_ARROW2 },
      },
      {
        hint: 'Pозвідувальні завдання пошуком',
        code: '10032500000170560000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED }
      },
      {
        hint: 'Розвідувальні (спеціальні) завдання засідкою',
        code: '10032500001417000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: 'Розвідувальні (спеціальні) завдання нападом',
        code: '10032500001520000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: 'Центр інформаційно-психологічних операцій',
        code: '10031000171106000000',
        amp: { [amps.uniqueDesignation]: 'ЦІПсО' },
      },
      {
        hint: 'Загін інформаційного забезпечення',
        code: '10031000151106000000',
        amp: { [amps.additionalInformation]: 'Друк' },
      },
      { hint: 'Зведений загін інформаційно-психологічних операцій', code: '10031004161106000000', amp: {} },
      {
        hint: 'Група спостереження та спеціальних дій',
        code: '10031000151106000000',
        amp: { [amps.uniqueDesignation]: 'ГрСС' },
      },
      { hint: 'Група моніторингу інформації', code: '10031000151104000000', amp: {} },
      { hint: 'Центр дій у кіберпросторі', code: '10031000161110000000', amp: { [amps.uniqueDesignation]: 'КбЦ' } },
      { hint: 'Загін кіберрозвідки', code: '10031000151110000000', amp: { [amps.uniqueDesignation]: 'КбР' } },
      { hint: 'Загін кіберзахисту', code: '10031000151110000000', amp: { [amps.uniqueDesignation]: 'КбЗ' } },
      { hint: 'Загін кібератак', code: '10031000151110000000', amp: { [amps.uniqueDesignation]: 'КбА' } },
    ],
  },
  {
    name: 'Інженерні війська',
    children: [
      { hint: 'Підрозділ оперативного забезпечення', code: '10031000001600000000', amp: {} },
      { hint: 'Інженерний підрозділ', code: '10031000001407000000', amp: {} },
      { hint: 'Пункт управління окремого полку оперативного забезпечення', code: '10031002171600000000', amp: {} },
      { hint: 'Стаціонарний об’єкт зберігання', code: '10031000001640000000', amp: {} },
      { hint: 'Підрозділ інженерної розвідки (взвод інженерної розвідки)', code: '10031000141407030000', amp: {} },
      { hint: 'Загін забезпечення руху', code: '10031004141407030000', amp: {} },
      { hint: 'Рухомий загін загороджень', code: '10031004151407000000', amp: {} },
      { hint: 'Рухомий загін загороджень на вертольотах', code: '10031004141407007800', amp: {} },
      { hint: 'Рухомий загін загороджень на плаваючих засобах', code: '10031004141407000040', amp: {} },
      {
        hint: 'Інженерний розвідувальний дозор',
        code: '10031004141407030000',
        amp: { [amps.additionalInformation]: 'ІРД' },
      },
      {
        hint: 'Пункт заготівлі конструкцій',
        code: '10031000001640000000',
        amp: { [amps.additionalInformation]: 'ПЗК' }
      },
      {
        hint: 'Одиночний окоп (позиція підрозділу)',
        code: '10032500002910000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED }
      },
      { hint: 'Система траншей', code: '10032500002909000000', amp: { isSvg: true, type: entityKind.POLYLINE } },
      { hint: 'Укриття (бліндаж)', code: '10032500002809000000', amp: {} },
      { hint: 'Надземне укриття', code: '10032500002810000000', amp: {} },
      { hint: 'Підземне укриття', code: '10032500002811000000', amp: {} },
      {
        hint: 'Протитанковий рів (ескарп, контрескарп)',
        code: '10032500002902020000',
        amp: { isSvg: true, type: entityKind.POLYLINE }
      },
      {
        hint: `Ефект руйнування спрямований на використання вогню і ефекту загороджень, щоб примусити противника розділити свої формування, порушити бойовий порядок, витратити час, змінити план, поспішно здійснити розмінування та зірвати атаку`,
        code: '10032500002705020000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: `Ефект блокування  об’єднує вогонь, що прикриває загородження та загородження з метою зупинки противника вздовж шляхів підходу або перешкоджає його проходженню через зону бойових дій`,
        code: '10032500002705010000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: `Ефект затримання  спрямований на планування вогню і загороджень для затримання атакуючих у певній зоні, зазвичай в зоні бойових дій`,
        code: '10032500003411000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: 'Зона вільна (очищена) від загороджень',
        code: '10032500002704000000',
        amp: { isSvg: true, type: entityKind.POLYGON }
      },
      {
        hint: 'Зона (смуга) загороджень із зазначенням всередині знаку ефекту',
        code: '10032500000170580000',
        amp: { isSvg: true, type: entityKind.POLYGON },
      },
      { hint: 'Завал', code: '10032500002801000000', amp: { isSvg: true, type: entityKind.SOPHISTICATED } },
      {
        hint: 'Рубіж мінування',
        code: '10032500000170600000',
        amp: { isSvg: true, type: entityKind.POLYLINE, lineType: types.dashed.value, right: ENDS_STROKE1 },
      },
      {
        hint: 'Мінне поле (Мінне загородження)',
        code: '10032500002707010000',
        amp: {
          isSvg: true,
          type: entityKind.SOPHISTICATED,
          textAmplifiers: { N: 'N', H1: 'H1', H2: 'H2' },
          params: {
            mineType: MINE_TYPES.ANTI_TANK,
            controlType: CONTROL_TYPES.UNCONTROLLED,
            dummy: false,
          },
        },
      },
      { hint: 'Ряд протитанкових мін', code: '10032500000170610000', amp: { isSvg: true, type: entityKind.POLYLINE } },
      { hint: 'Ряд протипіхотних мін', code: '10032500000170620000', amp: { isSvg: true, type: entityKind.POLYLINE } },
      { hint: 'Протитанкова міна', code: '10032500002803000000', amp: {} },
      { hint: 'Протипіхотна міна', code: '10032500002802000000', amp: {} },
      { hint: 'Міна невизначеного типу', code: '10032500002806000000', amp: {} },
      { hint: 'Розтяжка', code: '10032500002905000000', amp: { isSvg: true, type: entityKind.SOPHISTICATED } },
      { hint: 'Мінна пастка', code: '10032500002807000000', amp: {} },
      { hint: 'Протипіхотна міна направленої дії', code: '10032500002802010000', amp: {} },
      { hint: 'Протитанкова міна встановлена з елементом не вилучення', code: '10032500002804000000', amp: {} },
      {
        hint: 'Район мінування',
        code: '10032500002708000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED, pointAmplifier: { [amps.T]: '', [amps.W]: '' } }
      },
      { hint: 'Група мін', code: '10032500002904000000', amp: { isSvg: true, type: entityKind.SOPHISTICATED } },
      {
        hint: 'Прохід в протитанковому мінному полі (шириною до 6 метрів)',
        code: '10032500002906000000',
        amp: { isSvg: true, type: entityKind.POLYLINE },
      },
      {
        hint: `Прохід в протитанковому мінному полі (шириною більше 6 метрів) із зазначенням часу відкриття та закриття проходу`,
        code: '10032500002711000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      { hint: 'Протитанковий рів', code: '10032500002902020000', amp: { isSvg: true, type: entityKind.POLYLINE } },
      {
        hint: 'Протитанковий рів посилений протираковими мінами',
        code: '10032500002902030000',
        amp: { isSvg: true, type: entityKind.POLYLINE },
      },
      {
        hint: 'Протитанковий рів в процесі обладнання',
        code: '10032500002902010000',
        amp: { isSvg: true, type: entityKind.POLYLINE }
      },
      {
        hint: 'Лінія загороджень (яка поєднує в собі різні типи загороджень)',
        code: '10032500002901000000',
        amp: { isSvg: true, type: entityKind.POLYLINE },
      },
      {
        hint: 'Однорядне дротяне загородження',
        code: '10032500002903020000',
        amp: { isSvg: true, type: entityKind.POLYLINE }
      },
      {
        hint: 'Дворядне дротяне загородження',
        code: '10032500002903030000',
        amp: { isSvg: true, type: entityKind.POLYLINE }
      },
      {
        hint: 'Дротяне загородження на низьких кілках (типу спотикач)',
        code: '10032500002903050000',
        amp: { isSvg: true, type: entityKind.POLYLINE },
      },
      {
        hint: 'Дротяне загородження на високих кілках',
        code: '10032500002903060000',
        amp: { isSvg: true, type: entityKind.POLYLINE }
      },
      {
        hint: 'Спіральне однорядне дротяне загородження',
        code: '10032500002903070000',
        amp: { isSvg: true, type: entityKind.POLYLINE }
      },
      {
        hint: 'Спіральне дворядне дротяне загородження',
        code: '10032500002903080000',
        amp: { isSvg: true, type: entityKind.POLYLINE }
      },
      {
        hint: 'Спіральне трьохрядне дротяне загородження',
        code: '10032500002903090000',
        amp: { isSvg: true, type: entityKind.POLYLINE }
      },
      {
        hint: `Пункт польового водопостачання (ВІДПВП-відділення польового водопостачання групи інженерного забезпечення)`,
        code: '10031004121647000000',
        amp: {},
      },
      {
        hint: 'Ділянка десантної переправи із зазначенням засобів переправи',
        code: '10032500002713000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: 'Паромна переправа',
        code: '10032500002907000000',
        amp: { isSvg: true, type: entityKind.POLYLINE, right: ENDS_ARROW2, left: ENDS_ARROW2 },
      },
      {
        hint: 'Ділянка переправ',
        code: '10032500002908000000',
        amp: { isSvg: true, type: entityKind.POLYLINE, right: ENDS_FORK, left: ENDS_FORK },
      },
      {
        hint: 'Наплаваний міст з парку ПМП',
        code: '10032500002714000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED }
      },
      { hint: 'Десантно доступна ділянка', code: '10032500002104000000', amp: {} },
      { hint: 'Хибний об’єкт', code: '1003250000230200', amp: { isSvg: true, type: entityKind.SOPHISTICATED } },
      { hint: 'Майстерня з ремонту інженерної техніки', code: '10031000121407003100', amp: {} },
      { hint: 'Екскаватор', code: '10031500001314000000', amp: {} },
      { hint: 'Бульдозер', code: '10031500331311000000', amp: {} },
      { hint: 'Причіпний мінний загороджувач', code: '10031500351310010000', amp: {} },
      { hint: 'Інженерна машина розгороджень', code: '10031500331309020000', amp: {} },
      { hint: 'Мінний загороджувач', code: '10031500331310010000', amp: {} },
      { hint: 'Універсальний мінний загороджувач', code: '10031500321310010000', amp: {} },
      { hint: 'Важкий механізований міст', code: '10031500311305000000', amp: {} },
      { hint: 'Шляхопрокладач', code: '10031500001308010000', amp: {} },
      { hint: 'Установка розмінування', code: '10031500331309000000', amp: {} },
      { hint: 'Мостовий танковий укладач', code: '10031500331305000000', amp: {} },
      { hint: 'Паромно-мостова машина', code: '10031500331304000000', amp: {} },
      { hint: 'Плаваючий транспортер середній', code: '10031500521312000000', amp: {} },
      { hint: 'Інженерно розвідувальна машина', code: '10031500331313000000', amp: {} },
      { hint: 'Автомобільний кран', code: '10031500001315000000', amp: {} },
      { hint: 'Землерийна машина', code: '10031500331308000000', amp: {} },
      { hint: 'Засоби мінування (розмінування)', code: '10031500001309000000', amp: {} },
      { hint: 'Катер', code: '10033000001208000000', amp: {} },
      { hint: 'Військово-фільтрувальна станція ВФС', code: '10031500311410000000', amp: {} },
      { hint: 'Обхід загороджень', code: '10032500002706010000', amp: { isSvg: true, type: entityKind.SOPHISTICATED } },
    ],
  },
  {
    name: 'Радіоелектронна боротьба',
    children: [
      { hint: 'Батальйон РЕБ', code: '10031000161505040000', amp: {} },
      { hint: 'Рота РЕБ', code: '10031000151505040000', amp: {} },
      { hint: 'Спеціальний центр РЕБ', code: '10031000161501000000', amp: { [amps.additionalInformation]: 'ЕР' } },
      { hint: 'Вузол РЕБ', code: '10031000151501000000', amp: { [amps.additionalInformation]: 'ЕР' } },
      {
        hint: 'Група контролю радіоелектронної обстановки',
        code: '10031000131501000000',
        amp: { [amps.uniqueDesignation]: 'ТМ' },
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
      { hint: 'Командний пункт батальйону РЕБ', code: '10031002161505040000', amp: {} },
      { hint: 'Станція перешкод на гусеничній базі', code: '10031500331201010000', amp: {} },
      { hint: 'Станція перешкод на колісній базі підвищеної прохідності', code: '10031500321401000000', amp: {} },
      {
        hint: `Станція перешкод радіопідривникам артилерійських боєприпасів на броньованій колісній базі підвищеної прохідності`,
        code: '10031500321201010000',
        amp: {},
      },
      { hint: 'Компактна тактична система пеленгування на колісній базі', code: '10031500311401000000', amp: {} },
      {
        hint: 'Пункт управління підрозділу РЕБ на колісній базі підвищеної прохідності',
        code: '10031500321401000000',
        amp: {},
      },
      {
        hint: 'Створення активних перешкод радіоелектронним засобам противника',
        code: '10032500000170630000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: 'Район контролю радіоелектронної обстановки',
        code: '10032500001200000000rez',
        amp: { isSvg: true, type: entityKind.RECTANGLE, pointAmplifier: { [amps.W]: 'РЕЗ' } },
      },
      {
        hint: 'Район, вільний від радіоелектронних засобів',
        code: '10032500000170650000',
        amp: { isSvg: true, type: entityKind.POLYGON }
      },
      {
        hint: 'Межа зони розвідки КХ засобів зв’язку',
        code: '10032500000170660000',
        amp: { isSvg: true, type: entityKind.POLYLINE, pointAmplifier: { [amps.T]: 'P KX' } },
      },
      {
        hint: 'Межа зони радіоподавлення (КХ радіозв’язк)',
        code: '10032500000170670000',
        amp: { isSvg: true, type: entityKind.POLYLINE, pointAmplifier: { [amps.T]: 'РЕП КХ' } },
      },
      {
        hint: 'Зона морської радіотехнічної розвідки, Межа зони подавлення',
        code: '10032500000170190000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      { hint: 'Цивільний телекомунікатор', code: '10032000001212020000', amp: {} },
      { hint: 'Цивільне телебачення', code: '10032000001212021300', amp: {} },
    ],
  },
  {
    name: 'Радіаційний, хімічний, біологічний захист',
    children: [
      { hint: 'Командний пункт полку РХБ захисту', code: '10031002171401000000', amp: {} },
      { hint: 'Командно-спостережний пункт батальйону РХБ захисту', code: '10031002161401000000', amp: {} },
      { hint: 'Командно-спостережний пункт роти РХБ захисту', code: '10031002151401000000', amp: {} },
      { hint: 'Командно-спостережний пункт взводу РХБ захисту', code: '10031002141401000000', amp: {} },
      {
        hint: 'Район зосередження',
        code: '10032500001502000000',
        amp: { isSvg: true, type: entityKind.AREA, pointAmplifier: { [amps.T]: 'AA' } },
      },
      { hint: 'Полк РХБ захисту', code: '10031000171401000000', amp: {} },
      { hint: 'Батальйон РХБ розвідки', code: '10031000161401030000', amp: {} },
      { hint: 'Рота РХБ розвідки', code: '10031000151401030000', amp: {} },
      { hint: 'Взвод РХБ розвідки', code: '10031000141401030000', amp: {} },
      { hint: 'Відділення РХБ розвідки', code: '10031000121401030000', amp: {} },
      { hint: 'Батальйон РХБ захисту', code: '10031000161401000000', amp: {} },
      { hint: 'Рота РХБ захисту', code: '10031000151401000000', amp: {} },
      { hint: 'Взвод РХБ розвідки', code: '10031000141401000000', amp: {} },
      { hint: 'Відділення РХБ захисту', code: '10031000121401000000', amp: {} },
      { hint: 'Батальйон РХБ захисту (дегазації обмундирування)', code: '10031000161401001500', amp: {} },
      { hint: 'Рота РХБ захисту (дегазації обмундирування)', code: '10031000151401001500', amp: {} },
      { hint: 'Взвод РХБ захисту (дегазації обмундирування)', code: '10031000141401001500', amp: {} },
      { hint: 'Відділення РХБ захисту (дегазації обмундирування)', code: '10031000121401001500', amp: {} },
      { hint: 'Батальйон РХБ захисту (аерозольного маскування)', code: '10031000161401006000', amp: {} },
      { hint: 'Рота РХБ захисту (аерозольного маскування)', code: '10031000151401006000', amp: {} },
      { hint: 'Взвод РХБ захисту (аерозольного маскування)', code: '10031000141401006000', amp: {} },
      { hint: 'Відділення РХБ захисту (аерозольного маскування)', code: '10031000121401006000', amp: {} },
      {
        hint: 'Вогнеметний батальйон РХБ захисту',
        code: '10031000160000000000',
        amp: { [amps.specialHeadquarters]: 'ВП' },
      },
      { hint: 'Вогнеметна рота РХБ захисту', code: '10031000150000000000', amp: { [amps.specialHeadquarters]: 'ВП' } },
      {
        hint: 'Вогнеметний взвод РХБ захисту',
        code: '10031000140000000000',
        amp: { [amps.specialHeadquarters]: 'ВП' }
      },
      {
        hint: 'Вогнеметне відділення РХБ захисту',
        code: '10031000120000000000',
        amp: { [amps.specialHeadquarters]: 'ВП' },
      },
      { hint: 'Зведений загін РХБ захисту', code: '10031004151401000000', amp: {} },
      {
        hint: 'Дозор РХБ розвідки',
        code: '10032500003422020000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED }
      },
      {
        hint: 'Район (сектор) РХБ розвідки',
        code: '10032500001522000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED }
      },
      { hint: 'Пост РХБ спостереження розгорнутий штатними підрозділами', code: '10032500001602030000', amp: {} },
      {
        hint: 'Відділення РХБ захисту дозиметричного та хімічного контролю',
        code: '10031000121401030000',
        amp: { [amps.additionalInformation]: 'ДХК' },
      },
      {
        hint: 'Хіміко-радіометрична лабораторія РХБ захисту',
        code: '10031000131401030000',
        amp: { [amps.additionalInformation]: 'ХРЛ' },
      },
      {
        hint: 'Розрахунково-аналітичний центр РХБ захисту Головного управління оперативного забезпечення',
        code: '10031000161401030000',
        amp: { [amps.uniqueDesignation]: 'РАЦ', [amps.higherFormation]: 'ГУОЗ' },
      },
      {
        hint: 'Розрахунково-аналітична станція РХБ захисту',
        code: '10031000151401030000',
        amp: { [amps.uniqueDesignation]: 'РАСт' },
      },
      {
        hint: 'Розрахунково-аналітична група РХБ захисту',
        code: '10031000131401030000',
        amp: { [amps.uniqueDesignation]: 'РАГ' },
      },
      {
        hint: 'Рубіж переведення засобів індивідуального та колективного захисту в бойове положення',
        code: '10032500001101000000rpzikz',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          pointAmplifier: { [amps.N]: 'PL РПЗПКЗ' },
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
          pointAmplifier: { [amps.N]: 'PL РОЗІЗ' },
          lineType: types.waved.value,
          nodalPointIcon: NODAL_POINT_ICONS.CROSS_CIRCLE,
          shownNodalPointAmplifiers: [ 0, 1 ],
        },
      },
      { hint: 'Виявлення факту хімічного зараження', code: '10032500002813000000', amp: {} },
      { hint: 'Виявлення факту біологічного зараження', code: '10032500002814000000', amp: {} },
      { hint: 'Виявлення факту радіологічного зараження', code: '10032500002817000000', amp: {} },
      { hint: 'Виявлення факту ядерного зараження', code: '10032500002815000000', amp: {} },
      {
        hint: 'Межа зони радіаційного забруднення місцевості за даними розвідки',
        code: '10032500002722000000',
        amp: { isSvg: true, type: entityKind.AREA, pointAmplifier: { [amps.W]: 'A' } },
      },
      {
        hint: 'Мінімально безпечні відстані радіаційного забруднення місцевості',
        code: '10032500002721000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: `Мінімально безпечні відстані хімічного забруднення місцевості, відповідно до прогнозу без урахування напрямку вітру`,
        code: '10032500002721000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      { hint: 'Аміакопровід', code: '10032500000170690000', amp: { isSvg: true, type: entityKind.POLYLINE } },
      {
        hint: `Обхід зон з високою концентрацією отруйних та небезпечних хімічних речовин (високими рівнями потужності дози випромінювання).`,
        code: '10032500003403000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      // TODO when done karandash
      {
        hint: 'Пункт спеціальної обробки (ПуСО)',
        code: '10032500002818000000',
        amp: { isSvg: true, type: '', [amps.T]: 'ПуСО' },
      },
      // TODO when done karandash
      { hint: 'Дегазаційний пункт (ДП)', code: '10032500002818000000', amp: { isSvg: true, type: '', [amps.T]: 'ДП' } },
      {
        hint: 'Район спеціальної обробки  (РСО)',
        code: '10032500001501000000',
        amp: { isSvg: true, type: entityKind.AREA, pointAmplifier: { [amps.T]: 'PCO' } },
      },
      {
        hint: 'Продегазований прохід на зараженій ділянці місцевості',
        code: '10032500000170800000',
        amp: { isSvg: true, type: entityKind.POLYLINE, left: ENDS_FORK, right: ENDS_FORK },
      },
      {
        hint: 'Район хімічного зараження',
        code: '10032500002718000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: 'Район хімічного зараження - токсичні промислові речовини',
        code: '10032500002718010000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: 'Район біологічного зараження',
        code: '10032500002717000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: 'Район біологічного зараження - токсичні промислові речовини',
        code: '10032500002717010000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: 'Район радіологічного зараження',
        code: '10032500002720000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: 'Район радіологічного зараження - токсичні промислові речовини',
        code: '10032500002720010000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: 'Район ядерного зараження',
        code: '10032500002719000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: 'Аерозольне маскування рубежу безпосередньо перед районами розташування своїх військ',
        code: '10032500001102000000',
        amp: {
          isSvg: true,
          type: entityKind.POLYLINE,
          intermediateAmplifier: { [amps.W]: 'AM' },
          left: ENDS_STROKE1,
          right: ENDS_STROKE1
        },
      },
      {
        hint: 'Район, який маскується аерозолем в районах розташування своїх військ',
        code: '10032500001200000000am',
        amp: { isSvg: true, type: entityKind.AREA, pointAmplifier: { [amps.T]: 'AM' } },
      },
      {
        hint: 'Головний напрямок ведення вогню',
        code: '10032500001405000000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: `База ремонту та зберігання озброєння і засобів РХБ захисту Головного управління оперативного забезпечення`,
        code: '10031000171401003100',
        amp: { [amps.higherFormation]: 'ГУОЗ' },
      },
      { hint: 'Склад зберігання озброєння і засобів РХБ захисту', code: '10031000001621000000', amp: {} },
      { hint: 'Рота (цех) ремонту озброєння і засобів РХБ захисту', code: '10031000151401003100', amp: {} },
      { hint: 'Взвод ремонту озброєння і засобів РХБ захисту', code: '10031000141401003100', amp: {} },
      { hint: 'Відділення ремонту озброєння і засобів РХБ захисту', code: '10031000121401003100', amp: {} },
      { hint: 'Реактивний піхотний вогнемет', code: '10031500001104000000', amp: {} },
      {
        hint: 'Розвідувальний літак із встановленою на ньому апаратурою  РХБ розвідки',
        code: '10030100001101001800',
        amp: { [amps.additionalInformation]: 'РХБЗ' },
      },
      {
        hint: 'Розвідувальний вертоліт  із встановленою на ньому апаратурою  РХБ розвідки',
        code: '10030100001102001800',
        amp: { [amps.additionalInformation]: 'РХБЗ' },
      },
      {
        hint: 'Безпілотний літальний апарат (середній)  із встановленою на ньому апаратурою  РХБ розвідки',
        code: '10030100001103000002',
        amp: { [amps.additionalInformation]: 'РХБЗ' },
      },
      {
        hint: `Спеціальна машина РХБ розвідки РХМ-1К(С) (МТ-ЛБ) РХМ-4-01(БТР-80) БРДМ-2РХ(Б) (ДРХБР – дозор РХБ розвідки)`,
        code: '10031500321201030000',
        amp: { [amps.additionalInformation]: 'ДРХБР' },
      },
      {
        hint: 'Спеціальна машина РХБ розвідки УАЗ-469 РХ(Б) (ДРХБР – дозор РХБ розвідки)',
        code: '10031500321401000000',
        amp: { [amps.additionalInformation]: 'ДРХБР' },
      },
      {
        hint: 'Розрахунково-аналітична станція РАСт-2М',
        code: '10031500321401000000',
        amp: { [amps.additionalInformation]: 'РА' },
      },
      {
        hint: 'Контрольно-розподільчий пересувний пункт КРПП',
        code: '10031500321401000000',
        amp: { [amps.additionalInformation]: 'КРПП' },
      },
      { hint: 'Автомобіль', code: '10031500321401000000', amp: {} },
      { hint: 'Атомна електростанція', code: '10032000001205010300', amp: {} },
      { hint: 'Об’єкт, що містить небезпечні хімічні речовини (НХР)', code: '10032000001106000200', amp: {} },
      { hint: 'Об’єкт, що містить біологічні засоби (БЗ)', code: '10032000001106000100', amp: {} },
      { hint: 'Об’єкт, що містить радіологічні речовини (РР)', code: '10032000001106000400', amp: {} },
      { hint: 'Об’єкт, що містить ядерні речовини (ЯР)', code: '10032000001106000300', amp: {} },
      { hint: 'Об\'єкт атомної промисловості', code: '10032000001115000000', amp: {} },
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
      { hint: 'Склад топографічних карт', code: '10031000161621006800', amp: {} },
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
        hint: `Автомобіль топогеодезичного та навігаційного забезпечення із зазначенням у ампліфікаторі його унікальної назви (АШТ – автомобіль штабний топографічний; СГА – спеціальний геодезичний автомобіль та інші види спеціальних автомобілів топографічної служби)`,
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
        amp: { isSvg: true, type: entityKind.RECTANGLE, pointAmplifier: { [amps.W]: 'OB' } },
      },
      {
        hint: 'Район створення (виправлення) плану міста (масштаб 1:5 000)',
        code: '10032500000170710000',
        amp: { isSvg: true, type: entityKind.RECTANGLE },
      },
    ],
  },
  {
    name: 'Гідрометеорологічне забезпечення',
    children: [
      {
        hint: 'Гідрометеорологічна служба ЗС України Головного управління оперативного забезпечення ЗС України',
        code: '10031000131306000000',
        amp: { [amps.uniqueDesignation]: 'ГМС', [amps.higherFormation]: 'ГУОЗ' },
      },
      {
        hint: 'Гідрометеорологічний центр ЗС України',
        code: '10031000151213003200',
        amp: { [amps.uniqueDesignation]: 'ГМЦ', [amps.higherFormation]: 'ГУОЗ' },
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
        code: '10031000151213003200',
        amp: { [amps.uniqueDesignation]: 'метсл', [amps.higherFormation]: 'ПвК' },
      },
      { hint: 'Метеорологічне бюро ЦУО', code: '10031000131213003200', amp: { [amps.uniqueDesignation]: 'метсл' } },
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
        amp: { [amps.uniqueDesignation]: 'метсл', [amps.additionalInformation]: 'ХНУ', [amps.higherFormation]: 'ПС' },
      },
      { hint: 'Метеорологічна група ДКЛА', code: '10031000121219003200', amp: { [amps.uniqueDesignation]: 'метгр' } },
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
      { hint: 'Метеорологічна група ВМС', code: '10031000131306004600', amp: { [amps.uniqueDesignation]: 'метгр' } },
      { hint: 'Метеорологічне бюро ВМС', code: '10031000141306004600', amp: { [amps.uniqueDesignation]: 'метбюро' } },
      { hint: 'Гідрометеорологічна служба СВ', code: '10031000121306000000', amp: { [amps.uniqueDesignation]: 'ГМС' } },
      {
        hint: 'Метеорологічне бюро КП АА СВ',
        code: '10031000131306007800',
        amp: { [amps.uniqueDesignation]: 'метбюро' }
      },
      { hint: 'Метеорологічний взвод омбр (отбр)', code: '10031000141211023200', amp: {} },
      { hint: 'Метеорологічний взвод огпбр', code: '10031000141211003227', amp: {} },
      {
        hint: 'Метеорологічна станція військового полігону',
        code: '10031000001306000000',
        amp: { [amps.uniqueDesignation]: 'местст' },
      },
      {
        hint: 'Пересувна метеорологічна станція із зазначенням типу (ПМС-70, 72)',
        code: '10031500321401000000',
        amp: {},
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
      { hint: 'Стаціонарна метеорологічна радіолокаційна станція', code: '10031000001306005000', amp: {} },
    ],
  },
  {
    name: 'Технічне забезпечення',
    children: [
      { hint: 'Ремонтно-відновлювальний полк', code: '10031000171611000000', amp: {} },
      { hint: 'Ремонтно-відновлювальний батальйон комплексного ремонту', code: '10031000161611000000', amp: {} },
      { hint: 'Взвод технічного забезпечення', code: '10031000141611000000', amp: {} },
      {
        hint: 'Ремонтно-відновлювальна рота бронетанкового озброєння і техніки',
        code: '10031000151611000000',
        amp: { [amps.additionalInformation]: 'БТОТ' },
      },
      {
        hint: 'Ремонтно-відновлювальна рота ракетно-артилерійського озброєння',
        code: '10031000151611000000',
        amp: { [amps.additionalInformation]: 'РАО' },
      },
      {
        hint: 'Ремонтно-відновлювальна рота автомобільної техніки',
        code: '10031000151611000000',
        amp: { [amps.additionalInformation]: 'АТ' },
      },
      { hint: 'Взвод технічної розвідки', code: '10031000141611000000', amp: { [amps.additionalInformation]: 'ТхР' } },
      {
        hint: 'Взвод технічного обслуговування',
        code: '10031000141611000000',
        amp: { [amps.additionalInformation]: 'ТО' },
      },
      { hint: 'Взвод спеціальних робіт', code: '10031000141611000000', amp: { [amps.additionalInformation]: 'СПЕЦ' } },
      { hint: 'Взвод регламентних робіт', code: '10031000141611000000', amp: { [amps.additionalInformation]: 'РР' } },
      {
        hint: 'Військова метрологічна лабораторія',
        code: '10031000141611000000',
        amp: { [amps.additionalInformation]: 'ВМЛ' },
      },
      { hint: 'Евакуаційне відділення', code: '10031000121611000000', amp: { [amps.additionalInformation]: 'ЕВ' } },
      {
        hint: 'Відділення технічного обслуговування бронетанкової техніки',
        code: '10031000121611000000',
        amp: { [amps.staffComments]: 'БТОТ' },
      },
      {
        hint: 'Відділення технічного обслуговування ракетно-артилерійського озброєння',
        code: '10031000121611000000',
        amp: { [amps.staffComments]: 'РАО', [amps.additionalInformation]: 'ТО' },
      },
      {
        hint: 'Відділення технічного обслуговування автомобільної техніки',
        code: '10031000121611000000',
        amp: { [amps.staffComments]: 'АТ', [amps.additionalInformation]: 'ТО' },
      },
      {
        hint: 'Об’єднаний центр метрологічного забезпечення',
        code: '10031000001611000000',
        amp: { [amps.uniqueDesignation]: 'ОЦМлЗ', [amps.additionalInformation]: 'РМВЧ' },
      },
      { hint: 'Група технічної розвідки', code: '10031004001611000000', amp: { [amps.additionalInformation]: 'ГТР' } },
      { hint: 'Евакуаційна група', code: '10031004001611000000', amp: { [amps.additionalInformation]: 'ЕГ' } },
      { hint: 'Евакуаційна команда', code: '10031004001611000000', amp: { [amps.additionalInformation]: 'ЕК' } },
      {
        hint: 'Ремонтно-евакуаційна група',
        code: '10031004001611000000',
        amp: { [amps.additionalInformation]: 'РЕГ' }
      },
      {
        hint: 'Рятувально-евакуаційна група',
        code: '10031004001611000000',
        amp: { [amps.additionalInformation]: 'РяЕГ' },
      },
      { hint: 'Ремонтна група', code: '10031004001611000000', amp: { [amps.additionalInformation]: 'РемГ' } },
      { hint: 'Виїзна метрологічна група', code: '10031004001611000000', amp: { [amps.additionalInformation]: 'ВМГ' } },
      {
        hint: 'Замикання похідної колони головних сил',
        code: '10031004001611000000',
        amp: { [amps.additionalInformation]: 'ЗПК', [amps.staffComments]: 'ГС' },
      },
      {
        hint: 'Замикання похідної колони підрозділів технічного та тилового забезпечення',
        code: '10031004001611000000',
        amp: { [amps.additionalInformation]: 'ЗПК' },
      },
      { hint: 'Пункт бойового постачання', code: '10032500003217050000', amp: {} },
      // TODO when done karandash start
      {
        hint: 'Пункт зустрічі матеріальних засобів',
        code: '10032500001301000000',
        amp: { isSvg: true, type: '', [amps.T]: 'ПЗ' },
      },
      {
        hint: 'Пункт передачі матеріальних засобів',
        code: '10032500001301000000',
        amp: { isSvg: true, type: '', [amps.T]: 'ПП' },
      },
      {
        hint: 'Пункт технічної допомоги',
        code: '10032500001301000000',
        amp: { isSvg: true, type: '', [amps.T]: 'ПТД' }
      },
      {
        hint: 'Пункт технічного спостереження',
        code: '10032500001301000000',
        amp: { isSvg: true, type: '', [amps.T]: 'ПТС' },
      },
      {
        hint: 'Збірний пункт пошкоджених машин',
        code: '10032500001301000000',
        amp: { isSvg: true, type: '', [amps.T]: 'ЗППМ' },
      },
      {
        hint: 'Збірний пункт пошкоджених машин, що планується',
        code: '10032510001301000000',
        amp: { isSvg: true, type: '', [amps.T]: 'ЗППМ' },
      },
      {
        hint: 'Запасний збірний пункт пошкоджених машин',
        code: '10032510001301000000',
        amp: { isSvg: true, type: '', [amps.T]: 'ЗППМ', [amps.dtg]: 'З' },
      },
      // TODO end
      {
        hint: `Райони зосередження пошкоджених зразків ОВТ (масового виходу зі строю ОВТ) з вказівкою часу координат та кількістю ОВТ`,
        code: '10032500001502000000rzp',
        amp: { isSvg: true, type: entityKind.AREA, pointAmplifier: { [amps.T]: 'AA', [amps.W]: 'РЗП ОВТ' } },
      },
      { hint: 'Склад з ракетами та боєприпасами', code: '10031000001641000000', amp: {} },
      { hint: 'Запаси ракет та боєприпасів, які розміщені на ґрунті', code: '10031000001604000000', amp: {} },
      {
        hint: 'Склад бронетанкового майна',
        code: '10031000001645000000',
        amp: { [amps.additionalInformation]: 'БТМ' }
      },
      { hint: 'Склад автомобільного майна', code: '10031000001645000000', amp: { [amps.additionalInformation]: 'АМ' } },
      {
        hint: 'Центральна база зберігання ракет та боєприпасів',
        code: '10032000001103000000',
        amp: { [amps.uniqueDesignation]: 'ЦБ РіБ' },
      },
      { hint: 'Рухомий засіб технічного обслуговування та ремонту типу МТО-АТ', code: '10031500321401000000', amp: {} },
      { hint: 'Сідельний тягач з напівпричепом', code: '10031500001406000000', amp: {} },
      {
        hint: 'Броньована ремонтно-евакуаційна машина на базі танку (танковий тягач, гусеничний тягач)',
        code: '10031500331203000000',
        amp: {},
      },
      { hint: 'Броньована ремонтно-евакуаційна машина на базі БТР', code: '10031500321201080000', amp: {} },
      {
        hint: 'На ОВТ провести технічне обслуговування в обсязі ЩТО',
        code: '10031000000000003100',
        amp: { [amps.specialHeadquarters]: 'ОВТ', [amps.staffComments]: 'ЩТО' },
      },
    ],
  },
  {
    name: 'Тилове забезпечення',
    children: [
      { hint: 'Окрема база матеріального забезпечення ВМС', code: '10031000001634004600', amp: {} },
      { hint: 'Батальйон матеріального забезпечення', code: '10031000161634000000', amp: {} },
      { hint: 'Рота матеріального забезпечення', code: '10031000151634000000', amp: {} },
      { hint: 'Автомобільний батальйон', code: '10031000161636000000', amp: {} },
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
      { hint: 'Господарський взвод', code: '10031000141634000000', amp: {} },
      { hint: 'Автотранспортний взвод', code: '10031000141636000000', amp: { [amps.additionalInformation]: 'ТР' } },
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
      { hint: 'Відділення хлібозаводу', code: '10031000120000000000', amp: { [amps.specialHeadquarters]: 'ПМХ' } },
      { hint: 'Лазня', code: '10031000121610000000', amp: {} },
      {
        hint: 'Мобільний лазневий комплекс для миття особового складу та прання речового майна',
        code: '10031500311401000000',
        amp: { [amps.additionalInformation]: 'МЛПК' },
      },
      { hint: 'Їдальня', code: '10031000120000000000', amp: { [amps.specialHeadquarters]: 'ЇД' } },
      {
        hint: 'Пересувний механізований хлібозавод',
        code: '10031000000000000000',
        amp: { [amps.specialHeadquarters]: 'ПМХ' },
      },
      { hint: 'Продовольчий склад', code: '10031000001637000000', amp: {} },
      { hint: 'Речовий склад', code: '10031000001642000000', amp: {} },
      { hint: 'Склад військово-технічного майна', code: '10031000001645000000', amp: {} },
      {
        hint: 'Склад артилерійських боєприпасів',
        code: '10031000001641000000',
        amp: { [amps.additionalInformation]: 'Арт' },
      },
      { hint: 'Склад стрілецької зброї', code: '10031000001641000000', amp: { [amps.additionalInformation]: 'СЗ' } },
      { hint: 'Склад пального та мастильних матеріалів', code: '10031000001620000000', amp: {} },
      { hint: 'Транспортний засіб для перевезення води', code: '10031500311410000000', amp: {} },
      { hint: 'Заправник', code: '10031500311409000000', amp: {} },
      { hint: 'Вантажівка з напівпричепом', code: '10031500001406000000', amp: {} },
      { hint: 'Центри забезпечення, склади (бази) зберігання МТЗ Центру', code: '10032000001112000000', amp: {} },
      {
        hint: 'Центри забезпечення, склади (бази) зберігання ПММ Центру',
        code: '10032000001112000000',
        amp: { [amps.additionalInformation]: 'ПММ' },
      },
      { hint: 'Пункт заправки ПММ', code: '10032500003217000000', amp: {} },
      { hint: 'Пересувна станція перекачування ПММ / Насос перекачування ПММ', code: '10031500311409000000', amp: {} },
      { hint: 'Трубопровідні військові частини (підрозділи)', code: '10031000001626000000', amp: {} },
      { hint: 'Ремонтні підрозділи (майстерні)', code: '10031000001636003100', amp: {} },
      {
        hint: 'Склад (база) зберігання МТЗ номенклатури продовольчої служби',
        code: '10032000001112000000',
        amp: { [amps.additionalInformation]: 'ПРОД' },
      },
      { hint: 'Управління військових сполучень на залізниці', code: '10031000001630000008', amp: {} },
      {
        hint: 'Комендатура військових сполучень залізничної дільниці та станції',
        code: '10031000001630000008',
        amp: { [amps.additionalInformation]: 'К' },
      },
      { hint: 'Комендатура військових сполучень аеропорту', code: '10031000001603000008', amp: {} },
      {
        hint: 'Управління військових сполучень на морському та річковому транспорті',
        code: '10031000001633000008',
        amp: {},
      },
    ],
  },
  {
    name: 'Медичне забезпечення',
    children: [
      { hint: 'Медична рота', code: '10031000151613000000', amp: {} },
      { hint: 'Медичний пункт полку', code: '10031000171613000000', amp: {} },
      { hint: 'Медичний пункт  батальйону', code: '10031000161613000000', amp: {} },
      {
        hint: 'Мобільна група підсилення (лікарсько-сестринська бригада)',
        code: '10031500311402000000',
        amp: { [amps.additionalInformation]: 'ГМП' },
      },
      { hint: 'Медичний склад', code: '10031000001644000000', amp: {} },
      {
        hint: 'Пересувна група медичного постачання',
        code: '10031500311402000000',
        amp: { [amps.additionalInformation]: 'ПГМП' },
      },
      { hint: 'Військовий госпіталь (стаціонарний)', code: '10032000001207000000', amp: {} },
      { hint: 'Військовий мобільний госпіталь', code: '10031000161614000000', amp: {} },
      {
        hint: 'Цивільна лікарня (міська клінічна лікарня)',
        code: '10032000001207020000',
        amp: { [amps.uniqueDesignation]: 'МКЛ' },
      },
      { hint: 'Стабілізаційний пункт', code: '10032500003201020000', amp: {} },
      { hint: 'Санітарний бронетранспортер', code: '10031500001201040000', amp: {} },
      { hint: 'Санітарний автомобіль', code: '10031500001402000000', amp: {} },
      { hint: 'Реанімаційний автомобіль', code: '10031500001404000000', amp: {} },
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
        code: '10032000001207020000',
        amp: { [amps.uniqueDesignation]: 'ЦМРСЛ' },
      },
      { hint: 'Заклад медичної реабілітації', code: '10032000001207020000', amp: { [amps.uniqueDesignation]: 'МР' } },
      { hint: 'Санітарний літак', code: '10030100001101001400', amp: {} },
      { hint: 'Вертоліт аеромедичної евакуації', code: '10030100001102001400', amp: {} },
      {
        hint: 'Центральне санітарно-епідеміологічне управління (регіональне)',
        code: '10032000001207010000',
        amp: { [amps.uniqueDesignation]: 'ЦСЕУ' },
      },
      {
        hint: 'Центральне санітарно-епідеміологічне управління (санітарно-епідеміологічній відділ)',
        code: '10032000001207010000',
        amp: { [amps.uniqueDesignation]: 'СЕВ' },
      },
      { hint: 'Пункт збору  поранених', code: '10032500003211000000', amp: {} },
      { hint: 'Військова санітарна летючка', code: '10031500001501000000', amp: {} },
      { hint: 'Окрема автомобільна санітарна рота', code: '10031000151613000051', amp: {} },
      {
        hint: 'Пересувний кабінет (стоматологічний)',
        code: '10031500001402000000',
        amp: { [amps.additionalInformation]: 'Ст' },
      },
      {
        hint: 'Пересувний кабінет (рентгенологічний)',
        code: '10031500001402000000',
        amp: { [amps.additionalInformation]: 'Rő' },
      },
      {
        hint: 'Пересувний кабінет (хірургічний)',
        code: '10031500001402000000',
        amp: { [amps.additionalInformation]: 'Х' },
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
        amp: { [amps.additionalInformation]: 'ПсхД' }
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
      { hint: 'Похідний автомобільний клуб (ПАК) військовий (армійський)', code: '10031500311401000000', amp: {} },
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
        hint: 'Державна адміністрація (сільська, міська рада об’єднаної територіальної громади)',
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
        amp: { [amps.specialHeadquarters]: 'ОВК' }
      },
      {
        hint: 'Районний військовий комісаріат',
        code: '10032000000000000000',
        amp: { [amps.specialHeadquarters]: 'РВК' }
      },
      {
        hint: 'Район компактного проживання національних меншин',
        code: '10032500001200000000kpnm',
        amp: { isSvg: true, type: entityKind.AREA, pointAmplifier: { [amps.T]: 'КПНМ' } },
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
      { hint: 'Жертва, яка постраждала від криміналітету, замах на вбивство', code: '10031100001107000000', amp: {} },
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
        hint: 'Об’єкти та споруди, які знаходяться під захистом міжнародного права. Культурні цінності',
        code: '10032000000000000000',
        amp: { [amps.specialHeadquarters]: 'МГП' },
      },
      {
        hint: 'Сектор, межі (зони) стійкого прийому цивільних радіозасобів та телезасобів',
        code: '10032500000170760000',
        amp: { isSvg: true, type: entityKind.SOPHISTICATED },
      },
      {
        hint: 'Район, до якого сплановано відселення (евакуацію) населення, біженців із районів воєнних дій',
        code: '10032500000170770000',
        amp: { isSvg: true, type: entityKind.AREA, pointAmplifier: { [amps.T]: 'DPRE' } },
      },
      { hint: 'Загальновійськовий полігон', code: '10032000000000000000', amp: { [amps.specialHeadquarters]: 'ЗВП' } },
      { hint: 'Батальйон резерву', code: '10031000160000000000', amp: { [amps.specialHeadquarters]: 'Рез' } },
      // TODO when done karadash start
      {
        hint: 'Пункт прийому особового складу',
        code: '10032500001301000000',
        amp: { isSvg: true, type: '', [amps.T]: 'ППОС' },
      },
      { hint: 'Пункт прийому техніки', code: '10032500001301000000', amp: { isSvg: true, type: '', [amps.T]: 'ППТ' } },
      {
        hint: 'Пункт зустрічі поповнення',
        code: '10032500001301000000',
        amp: { isSvg: true, type: '', [amps.T]: 'ПЗП' },
      },
      {
        hint: 'Пункт попереднього збору військовозобов’язаних',
        code: '10032500001301000000',
        amp: { isSvg: true, type: '', [amps.T]: 'ППВЗ' },
      },
      {
        hint: 'Пункт попереднього збору техніки',
        code: '10032500001301000000',
        amp: { isSvg: true, type: '', [amps.T]: 'ППЗТ' },
      },
      {
        hint: 'Пункт збору селищної ради',
        code: '10032500001301000000',
        amp: { isSvg: true, type: '', [amps.T]: 'ПЗСР' },
      },
      { hint: 'Штаб оповіщення', code: '10032500001301000000', amp: { isSvg: true, type: '', [amps.T]: 'ШО' } },
      // TODO end
    ],
  },
  {
    name: 'Космічні системи',
    children: [
      { hint: 'Космічний апарат', code: '10030500001107000000', amp: {} },
      { hint: 'Космічний апарат зв’язку', code: '10030500001111000000', amp: {} },
      { hint: 'Розвідувальний КА', code: '10030500001115000000', amp: {} },
      { hint: 'Навігаційний КА', code: '10030500001114000000', amp: {} },
      { hint: 'Метеорологічний КА', code: '10030500001107000000', amp: {} },
      { hint: 'Орбітальне угруповання', code: '10030500001107000000', amp: {} },
      { hint: 'Космічний корабель', code: '10030500001116000000', amp: {} },
      {
        hint: 'Космічний корабель (вантажний)',
        code: '10030500001116000000',
        amp: { [amps.additionalInformation]: 'В' },
      },
      { hint: 'Орбітальна станція', code: '10030500001116000000', amp: {} },
      {
        hint: 'Район запуску космічних засобів',
        code: '10032500001200000000rzap',
        amp: { isSvg: true, type: entityKind.AREA, pointAmplifier: { [amps.T]: 'РЗапКосм' } },
      },
      {
        hint: 'Район посадки космічних засобів',
        code: '10032500001200000000rpos',
        amp: { isSvg: true, type: entityKind.AREA, pointAmplifier: { [amps.T]: 'РПосКосм' } },
      },
    ],
  },
]
