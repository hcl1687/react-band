import actions from './actions'
import reducers from './reducers'
import state from './state'

const entry = (): RB.IRBModule => {
  return {
    actions,
    reducers,
    state
  }
}

export default {
  entry
}
