export default async (RB_CONTEXT: RB.IRBContext): Promise<AssignmentStore.IActions> => {
  const { getModule } = RB_CONTEXT
  const asUtils = await getModule('asUtils') as AsUtils.IUtils
  const asConstants = await getModule('asConstants') as AsConstants.IConsts
  const { request } = asUtils
  const { ENV } = asConstants

  return {
    getAssignmentList: async ({ current = 1, pageSize = 10 }: AssignmentStore.IGetListParams): Promise<AssignmentStore.IGetListData> => {
      const start = (current - 1) * pageSize
      return request({
        method: 'get',
        url: `${ENV.JSA_API_DOMAIN}/GetAssignmentsFeedback?_start=${start}&_limit=${pageSize}`
      }).then((res: AssignmentStore.IResponse) => {
        console.log(res)
        const data = res.data || []
        const count = res.headers['x-total-count'] || 0
        return {
          assignments: data,
          count: +count
        }
      })
    },
    getAssignment: async (id: string): Promise<AssignmentStore.IAssignment> => {
      return request({
        method: 'get',
        url: `${ENV.JSA_API_DOMAIN}/GetAssignmentsFeedback/${id}`
      }).then((res: AssignmentStore.IResponse) => {
        console.log(res)
        const data = res.data || {}
        return data
      })
    },
    editAssignment: async (id: string, data: AssignmentStore.IEditData): Promise<AssignmentStore.IEditData> => {
      return request({
        method: 'patch',
        url: `${ENV.JSA_API_DOMAIN}/GetAssignmentsFeedback/${id}`,
        data
      }).then((res: AssignmentStore.IResponse) => {
        console.log(res)
        const data = res.data || {}
        return data
      })
    }
  }
}
