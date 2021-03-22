import module from '../index.entry'

const asConstantsFactory = module.entry

describe('custom/as/asConstants', () => {
  it('should render correctly in development env', () => {
    const RB_ENV = process.env.RB_ENV
    process.env.RB_ENV = 'development'
    const asConstants = asConstantsFactory() as AsConstants.IConsts

    expect(asConstants.LOCAL_STORAGE_PREFIX).toBe('AS_')
    expect(asConstants.ASSETS_PREFIX.image).toBe('/cudos/activity/images/')
    expect(asConstants.ENV.MEDIA_URL).toBe('https://media.dev.hcl1687.com')

    process.env.RB_ENV = RB_ENV
  })

  it('should render correctly in production env', () => {
    const RB_ENV = process.env.RB_ENV
    process.env.RB_ENV = 'production'
    const asConstants = asConstantsFactory() as AsConstants.IConsts

    expect(asConstants.LOCAL_STORAGE_PREFIX).toBe('AS_')
    expect(asConstants.ASSETS_PREFIX.image).toBe('/cudos/activity/images/')
    expect(asConstants.ENV.MEDIA_URL).toBe('https://media.hcl1687.com')

    process.env.RB_ENV = RB_ENV
  })
})
