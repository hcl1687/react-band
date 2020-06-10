import '@babel/polyfill'
import puppeteer from 'puppeteer'

describe('e2e test', () => {
  it('test bing', async () => {
    const browser = await puppeteer.launch({
      headless: false
    })
    const page = await browser.newPage()

    page.emulate({
      viewport: {
        width: 800,
        height: 600
      },
      userAgent: ''
    })

    await page.goto('https://bing.com')
    const content = await page.$eval("head > meta[name='ROBOTS']", element => element.content)
    expect(content).toBe('NOODP')

    browser.close()
  }, 16000)
})
