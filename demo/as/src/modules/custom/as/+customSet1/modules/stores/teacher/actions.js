export default async (RB_CONTEXT) => {
  const { getModule } = RB_CONTEXT
  const asUtils = await getModule('asUtils')
  const asConstants = await getModule('asConstants')
  const { request, setLocalStorageItem } = asUtils
  const { ENV } = asConstants

  return {
    getTeacher: (id) => {
      return request({
        method: 'get',
        url: `${ENV.JSA_API_DOMAIN}/Teacher/${id}`
      }).then(res => {
        console.log(res)
        const data = res.data
        const strMe = data ? window.btoa(JSON.stringify(data)) : ''
        setLocalStorageItem('me', strMe)

        return data || {}
      })
    },
    editTeacher: (id, data) => {
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
