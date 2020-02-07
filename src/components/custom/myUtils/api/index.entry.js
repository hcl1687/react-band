import axios from 'axios'

export default async ({ getComponent }) => {
  const constants = await getComponent('contants')
  const { JSON_SERVER } = constants || {}

  function myGetStudents () {
    return axios.get(`${JSON_SERVER}/students`)
  }

  function myAddStudent (data) {
    return axios.post(`${JSON_SERVER}/students`, data)
  }

  function myDeleteStudent (id) {
    return axios.delete(`${JSON_SERVER}/students/${id}`)
  }

  return {
    myGetStudents,
    myAddStudent,
    myDeleteStudent
  }
}
