import axios from 'axios'

export default async ({ getComponent }) => {
  const constants = await getComponent('contants')
  const { JSON_SERVER } = constants || {}

  function getStudents () {
    return axios.get(`${JSON_SERVER}/students`)
  }

  function addStudent (data) {
    return axios.post(`${JSON_SERVER}/students`, data)
  }

  function deleteStudent (id) {
    return axios.delete(`${JSON_SERVER}/students/${id}`)
  }

  return {
    getStudents,
    addStudent,
    deleteStudent
  }
}
