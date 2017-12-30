const puppeteer = require('puppeteer')
const {user} = require('../config')
var json2csv = require('json2csv')
var fs = require('fs')
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
  fs.writeFile('../files/file.csv', csv, function(err) {
    if (err) throw err;
    console.log('file saved')
  })
}
const main = async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath: '../node_modules/puppeteer/local/chrome-win32/chrome',
      headless: false,
      userDataDir: '../weibo'
    })
    const page = await browser.newPage()
    // const $ = window.$
    page.on('console', console.log)
    page.on('dialog', async dialog => {
      console.log(dialog.message())
      await dialog.dismiss()
    })
    let fansPage = 1
    await page.goto(`https://weibo.com/p/1005051782703161/follow?page=${fansPage}#Pl_Official_HisRelation__60`, {waitUntil: 'networkidle2'})
    let lastPage = await getLastPage(page)
    let totalUserList = []
    // 拿当前页的数据
    for (let i = 1; i <= 5; i++) {
      let pageSize = i
      if (i !== 1) {
        await page.goto(`https://weibo.com/p/1005051782703161/follow?page=${pageSize}#Pl_Official_HisRelation__60`, {waitUntil: 'networkidle2'})
      }
      let userList = await page.evaluate(() => {
        let fanList = [...document.querySelectorAll('.follow_box .follow_list li.follow_item')]
        console.log('fanList', fanList)
        // let nameAndHrefList = [...document.querySelectorAll('.follow_box .follow_list li.follow_item .info_name a.S_txt1')]
        // let addressList = [...document.querySelectorAll('.follow_box .follow_list li.follow_item .info_add span')]
        let fanDetail = []
        for (let j = 0; j < fanList.length; j++) {
          let li = fanList[j]
          let name = li.querySelector('.info_name a.S_txt1')
          let address = li.querySelector('.info_add span') ? li.querySelector('.info_add span').innerText: '无地址'
          let detail = {}
          detail = {
            name: name.innerText,
            href: name.href,
            address: address
          }
          fanDetail.push(detail)
        }
        return fanDetail
      })
      console.log('userList', userList)
      totalUserList = [...totalUserList, ...userList]
    }
    // transToCsvFile(totalUserList)
  } catch (e) {
    console.error('e', e)
  }
}
main()
