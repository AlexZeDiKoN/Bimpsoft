import React from 'react'
import Swipe from 'react-easy-swipe'
import './style.css'
import PropTypes from 'prop-types'

export default class ValueSwiper extends React.Component {
  onStart = () => {
    this.startValue = this.props.value
  }

  onMove = (pos) => {
    this.props.onChange(this.startValue, pos)
  }

  render () {
    return (
      <Swipe
        className="value-swiper"
        allowMouseEvents={true}
        onSwipeStart={this.onStart}
        onSwipeMove={this.onMove}
      >
      </Swipe>
    )
  }
}

ValueSwiper.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
}
