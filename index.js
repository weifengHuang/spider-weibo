const puppeteer = require('puppeteer')
const {user} = require('./config')
var json2csv = require('json2csv')
var fs = require('fs')
console.log('user', user)
const totalText = []
const getLastPage = async (page) => {
  let lastPage = await page.evaluate(() => {
    let pages = [...document.querySelectorAll('.WB_cardpage.S_line1 .W_pages a.page.S_txt1')]
    // 最后一页在倒数第二个标签
    let lastPage = pages[pages.length - 2]
    return lastPage.innerText
  })
  return lastPage
}
const transToCsvFile = (data) => {
  const fields = ['name', 'href', 'address']
  const fieldNames = ['名称', '链接', '地址']
  const csv = json2csv({data, fields, fieldNames})
  console.log('csv', csv)
  fs.writeFile('file.csv', csv, function(err) {
    if (err) throw err;
    console.log('file saved')
  })
}
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
    let totalUserList = []
    let fansPage = 1
    // for (var i = 0; i <= lastPage; i++) {
    //   array[i]
    // }
    await page.goto(`https://weibo.com/p/1005051782703161/follow?page=${fansPage}#Pl_Official_HisRelation__60`, {waitUntil: 'networkidle2'})
    let lastPage = await getLastPage(page)
    console.log('lastPage', lastPage)
    // 拿当前页的数据
    for (let i = 1; i <= 5; i++) {
      let pageSize = i
      if (i !== 1) {
        await page.goto(`https://weibo.com/p/1005051782703161/follow?page=${pageSize}#Pl_Official_HisRelation__60`, {waitUntil: 'networkidle2'})
      }
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
      })
      // console.log('userList', userList)
      totalUserList = [...totalUserList, ...userList]
    }
    transToCsvFile(totalUserList)
    console.log('totalUserList', totalUserList, totalUserList.length)
    console.log('执行结束')
  } catch (e) {
    console.error('e', e)
  }
}
test()
