const puppeteer = require('puppeteer')
const createBrowser = async () => {
  const browser = await puppeteer.launch({
    executablePath: '../node_modules/puppeteer/local/chrome-win32/chrome',
    headless: false,
    userDataDir: '../weibo'
  })
  return browser
}
module.exports = createBrowser
