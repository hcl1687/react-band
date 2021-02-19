import { IRBModule } from '~/interface'

export default (): IRBModule => {
  const LOCALE = {
    'en-US': 'en-US',
    'es-MX': 'es-MX',
    'en-GB': 'en-GB',
    'zh-CN': 'zh-CN',
    id: 'id'
  }

  return {
    LOCALE
  }
}
