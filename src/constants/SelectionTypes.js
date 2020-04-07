import entityKind from '../components/WebMap/entityKind'

export default {
  ...entityKind,
  SECTORS: 970, // сектори
  POLLUTION_CIRCLE: 971, // мінімально безпечні відстані забруднення місцевості
  CIRCULAR_ZONE: 972, // зона ураження / віявлення (кругова) (170190000)
  MINE_FIELD: 973, // мінне поле
  ATTACK: 974, // Напрямок удару своєї авіації, головній напрямок атаки, підтрімка атаки, хибна атака
}
