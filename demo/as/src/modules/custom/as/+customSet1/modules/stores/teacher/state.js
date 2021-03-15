export default async (RB_CONTEXT) => {
  const { getModule } = RB_CONTEXT
  const asUtils = await getModule('asUtils')
  const { getUser } = asUtils
  const me = getUser() || {}
  return {
    teacher: me
  }
}
