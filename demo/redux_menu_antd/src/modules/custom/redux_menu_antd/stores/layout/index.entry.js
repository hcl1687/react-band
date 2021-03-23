import actions from './actions'
import reducers from './reducers'
import state from './state'

const entry = () => {
  return {
    actions,
    reducers,
    state
  }
}

export default {
  entry
}
