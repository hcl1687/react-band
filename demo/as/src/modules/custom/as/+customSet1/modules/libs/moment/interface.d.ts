import moment from 'moment'

declare global {
  namespace Moment {
    type IMoment = typeof moment
  }
}
