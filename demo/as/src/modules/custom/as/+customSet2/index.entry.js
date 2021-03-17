import assignment from './modules/pages/assignment/index.entry'
import assignmentDetail from './modules/pages/assignmentDetail/index.entry'
import assignmentStore from './modules/stores/assignment/index.entry'

export default () => {
  return {
    assignment,
    assignmentDetail,
    assignmentStore
  }
}
