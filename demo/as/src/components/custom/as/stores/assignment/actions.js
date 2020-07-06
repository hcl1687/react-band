export default async (RB_CONTEXT) => {
  const { getComponent } = RB_CONTEXT
  const asUtils = await getComponent('asUtils')
  const asConstants = await getComponent('asConstants')
  const { request } = asUtils
  const { ENV } = asConstants

  return {
    getList: ({ current = 1, pageSize = 10 }) => {
      const start = (current - 1) * pageSize
      return request({
        method: 'get',
        url: `${ENV.JSA_API_DOMAIN}/GetAssignmentsFeedback?_start=${start}&_limit=${pageSize}`
      }).then(res => {
        console.log(res)
        const data = res.data || []
        const count = res.headers['x-total-count'] || 0
        return {
          items: data,
          count: +count
        }
      })
    }
  }
}
