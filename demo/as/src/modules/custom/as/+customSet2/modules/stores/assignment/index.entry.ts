import actionsFactory from './actions'
import reducers from './reducers'
import stateFactory from './state'

export default async (RB_CONTEXT: RB.IRBContext): Promise<RB.IRBModule> => {
  const actions = await actionsFactory(RB_CONTEXT)
  const state = await stateFactory()

  return {
    actions,
    reducers,
    state
  }
}
