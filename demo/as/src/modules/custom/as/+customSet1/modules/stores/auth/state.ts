export default async (RB_CONTEXT: RB.IRBContext): Promise<DecoRedux.IReduxState> => {
  const { getModule } = RB_CONTEXT
  const asUtils = await getModule('asUtils') as AsUtils.IUtils
  const { getAuth } = asUtils
  const AUTH = getAuth() || {}
  return {
    AUTH: AUTH
  }
}
