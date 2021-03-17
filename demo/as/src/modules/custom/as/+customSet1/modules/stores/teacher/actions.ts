export default async (RB_CONTEXT: RB.IRBContext): Promise<TeacherStore.IActions> => {
  const { getModule } = RB_CONTEXT
  const asUtils = await getModule('asUtils') as AsUtils.IUtils
  const asConstants = await getModule('asConstants') as AsConstants.IConsts
  const { request, setLocalStorageItem } = asUtils
  const { ENV } = asConstants

  return {
    getTeacher: async (id: string): Promise<AsUtils.IUser> => {
      return request({
        method: 'get',
        url: `${ENV.JSA_API_DOMAIN}/Teacher/${id}`
      }).then((res: TeacherStore.IResponse) => {
        console.log(res)
        const data = res.data
        const strMe = data ? window.btoa(JSON.stringify(data)) : ''
        setLocalStorageItem('me', strMe)

        return (data || {}) as AsUtils.IUser
      })
    },
    editTeacher: async (id: string, data: TeacherStore.IEditData): Promise<TeacherStore.IEditData> => {
      return request({
        method: 'patch',
        url: `${ENV.JSA_API_DOMAIN}/Teacher/${id}`,
        data
      }).then(() => {
        return data
      })
    }
  }
}
