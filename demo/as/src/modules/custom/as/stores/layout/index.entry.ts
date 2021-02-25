import actions from './actions'
import reducers from './reducers'
import state from './state'

export default (): RB.IRBModule => {
  return {
    actions,
    reducers,
    state
  }
}