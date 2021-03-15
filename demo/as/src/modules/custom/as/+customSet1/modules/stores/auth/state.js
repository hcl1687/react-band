export default async (RB_CONTEXT) => {
  const { getModule } = RB_CONTEXT
  const asUtils = await getModule('asUtils')
  const { getAuth } = asUtils
  const AUTH = getAuth() || {}
  return {
    AUTH: AUTH
  }
}
