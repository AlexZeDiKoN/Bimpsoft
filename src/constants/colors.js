import i18n from '../i18n'

export const BLUE = 'app6_blue'
export const RED = 'app6_red'
export const BLACK = 'app6_black'
export const GREEN = 'app6_green'
export const YELLOW = 'app6_yellow'
export const WHITE = 'app6_white'
export const TRANSPARENT = 'app6_transparent'
export const FRIENDLY = BLUE

export const values = {
  [TRANSPARENT]: 'transparent',
  [BLUE]: '#3366ff',
  [RED]: '#ff0000',
  [BLACK]: '#000000',
  [GREEN]: '#339966',
  [YELLOW]: '#ffff00',
  [WHITE]: '#ffffff',
}
export const titles = {
  [TRANSPARENT]: i18n.TRANSPARENT,
  [BLUE]: i18n.BLUE,
  [RED]: i18n.RED,
  [BLACK]: i18n.BLACK,
  [GREEN]: i18n.GREEN,
  [YELLOW]: i18n.YELLOW,
  [WHITE]: i18n.WHITE,
}

export const evaluateColor = (color) => values.hasOwnProperty(color) ? values[color] : color
