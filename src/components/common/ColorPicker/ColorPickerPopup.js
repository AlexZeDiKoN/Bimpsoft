import React from 'react'
import { CustomPicker } from 'react-color'
import { Hue, Saturation, Swatch } from 'react-color/lib/components/common'

const styles = {
  modal: {
    padding: 10,
    borderRadius: 3,
    border: '1px solid whitespace',
    boxShadow:
      '0px 0px 0px 1px rgba(0, 0, 0, 0.15), 0px 8px 16px rgba(0, 0, 0, 0.15)',
    backgroundColor: '#fff',
    width: 190,
  },
  hue: {
    height: 10,
    position: 'relative',
    marginBottom: 10,
    width: '100%',
    marginTop: 10,
  },
  saturation: {
    width: '100%',
    height: 140,
    position: 'relative',
  },
  input: {
    height: 34,
    paddingLeft: 10,
  },
  swatch: {
    width: 38,
    height: 38,
    position: 'relative',
  },
  presetColor: {
    margin: '-5px',
    display: 'flex',
    flexFlow: 'row wrap',
  },
  presetColorSwatch: {
    width: 20,
    height: 20,
    margin: 5,
    borderRadius: '3px',
    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.15)',
  },
}

export default CustomPicker(({ hsl, hsv, onChange, presetColors }) => {
  return (
    <div style={styles.modal}>
      <div style={styles.saturation}>
        <Saturation hsl={hsl} hsv={hsv} onChange={onChange} />
      </div>

      <div style={styles.hue}>
        <Hue hsl={hsl} onChange={onChange} />
      </div>

      {presetColors && presetColors.length ? (
        <div style={styles.presetColor}>
          {presetColors.map((color) => {
            const props = typeof color === 'string' ? { color } : color
            return (
              <Swatch
                key={props.color}
                {...props}
                onClick={onChange}
                style={styles.presetColorSwatch}
              />
            )
          })}
        </div>
      ) : null}
    </div>
  )
})
