export default async (RB_CONTEXT: RB.IRBContext): Promise<DecoRedux.IReduxState> => {
  const { getModule } = RB_CONTEXT
  const asUtils = await getModule('asUtils') as AsUtils.IUtils
  const { getUser } = asUtils
  const me = getUser() || {}
  return {
    teacher: me
  }
}
