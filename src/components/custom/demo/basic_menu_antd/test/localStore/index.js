import actions from './actions'
import reducers from './reducers'
import state from './state'

export default () => {
  return {
    state,
    actions,
    reducers
  }
}
