import actionsFactory from './actions'
import reducers from './reducers'
import stateFactory from './state'

export default async (RB_CONTEXT) => {
  const actions = await actionsFactory(RB_CONTEXT)
  const state = await stateFactory(RB_CONTEXT)

  return {
    actions,
    reducers,
    state
  }
}
