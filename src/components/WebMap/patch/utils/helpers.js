export const epsilon = 1e-5 // Досить мале число, яке можемо вважати нулем

export const setOpacity = function (opacity) {
  this._opacity = opacity
  const el = this.getElement()
  if (el) {
    el.style.opacity = this._opacity
  }
}

export const setHidden = function (hidden) {
  this._hidden = hidden
  const el = this.getElement()
  if (el) {
    el.style.display = this._hidden ? 'none' : ''
  }
}
