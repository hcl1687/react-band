export default async (RB_CONTEXT) => {
  const { getComponent } = RB_CONTEXT
  const asUtils = await getComponent('asUtils')
  const { getUser } = asUtils
  const AUTH = getUser() || {}
  return {
    AUTH: AUTH
  }
}
