import entityKind from '../components/WebMap/entityKind'

export default {
  ...entityKind,
  SECTORS: 970, // сектори
  POLLUTION_CIRCLE: 971, // мінімально безпечні відстані забруднення місцевості
  CIRCULAR_ZONE: 972, // зона ураження / виявлення (кругова) (170190000)
  MINE_FIELD: 973, // мінне поле
  ATTACK: 974, // Напрямок удару своєї авіації, головний напрямок атаки, підтримка атаки, хибна атака
  MINED_AREA: 975, // Район мінування
  CONCENTRATION_FIRE: 976, // Послідовне зосередження вогню
}
