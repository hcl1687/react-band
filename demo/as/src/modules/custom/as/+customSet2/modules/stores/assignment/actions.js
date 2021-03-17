export default async (RB_CONTEXT) => {
  const { getModule } = RB_CONTEXT
  const asUtils = await getModule('asUtils')
  const asConstants = await getModule('asConstants')
  const { request } = asUtils
  const { ENV } = asConstants

  return {
    getAssignmentList: ({ current = 1, pageSize = 10 }) => {
      const start = (current - 1) * pageSize
      return request({
        method: 'get',
        url: `${ENV.JSA_API_DOMAIN}/GetAssignmentsFeedback?_start=${start}&_limit=${pageSize}`
      }).then(res => {
        console.log(res)
        const data = res.data || []
        const count = res.headers['x-total-count'] || 0
        return {
          assignments: data,
          count: +count
        }
      })
    },
    getAssignment: (id) => {
      return request({
        method: 'get',
        url: `${ENV.JSA_API_DOMAIN}/GetAssignmentsFeedback/${id}`
      }).then(res => {
        console.log(res)
        const data = res.data || {}
        return data
      })
    },
    editAssignment: (id, data) => {
      return request({
        method: 'patch',
        url: `${ENV.JSA_API_DOMAIN}/GetAssignmentsFeedback/${id}`,
        data
      }).then(res => {
        console.log(res)
        const data = res.data || {}
        return data
      })
    }
  }
}
