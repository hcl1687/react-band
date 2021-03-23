import assignment from './modules/pages/assignment/index.entry'
import assignmentDetail from './modules/pages/assignmentDetail/index.entry'
import assignmentStore from './modules/stores/assignment/index.entry'

const entry = (): RB.IRBModule => {
  return {
    assignment,
    assignmentDetail,
    assignmentStore
  }
}

export default {
  entry
}
