import { Record } from 'immutable'

const Targeting = Record({

})

const initState = new Targeting()

export default function reducer (state = initState, action) {
  const { type } = action
  switch (type) {
    default: {
      return state
    }
  }
}
