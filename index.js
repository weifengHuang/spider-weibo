const puppeteer = require('puppeteer')
const {user} = require('./config')
var log4js = require('log4js');
logger = log4js.getLogger()
logger.level = 'debug'
logger.debug("Some debug messages")
console.log('user', user)
const test = async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath: './node_modules/puppeteer/local/chrome-win32/chrome',
      // args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: false,
      userDataDir: 'weibo'
    })
    const page = await browser.newPage()
    page.on('console', console.log)
    page.on('dialog', async dialog => {
      console.log(dialog.message())
      await dialog.dismiss()
    })
    let fansPage = 1
    await page.goto(`https://weibo.com/p/1005051782703161/follow?relate=fans&page=${fansPage}#Pl_Official_HisRelation__60`)
    // let li = await page.$$('.follow_list li', (el) => {
    //       logger.debug('el', el)
    //       logger.debug('el text', el.innerHTm)
    // })
    // console.log('li', li)
    let userList = await page.evaluate(() => {
      let nameAndHrefList = [...document.querySelectorAll('.follow_box .follow_list li.follow_item .info_name a.S_txt1')]
      let addressList = [...document.querySelectorAll('.follow_box .follow_list li.follow_item .info_add span')]
      let fanList = []
      if (nameAndHrefList.length === addressList.length) {
        for (var i = 0; i < nameAndHrefList.length; i++) {
          let nameAndHref = nameAndHrefList[i]
          let address = addressList[i]
          fanList.push({
            name: nameAndHref.innerText,
            href: nameAndHref.href,
            address: address.innerText
          })
        }
      }
      return fanList
      //
      // return fanList.map(el => {
      //   console.log('el', el)
      //   return {
      //     name: el.innerText,
      //     href: el.href
      //   }
      // })
    })
    console.log('List', userList)
    // console.log('li', li)
    // await page.screenshot({path: 'example2.png'})
    // await page.goto('https://weibo.com/p/1005051782703161/follow?relate=fans&from=100505&wvr=6&mod=headfans&current=fans#place')
    // await browser.close()
    console.log('执行结束')
  } catch (e) {
    console.error('e', e)
  }
}
test()
