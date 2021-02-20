import { IRBModule } from '~/interface'
import getStore from '../getStore'

export default (): IRBModule => {
  return {
    getStore
  }
}
