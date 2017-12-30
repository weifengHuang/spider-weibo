// 拿到自己账户的所有粉丝信息
const { getLastPage, createBrowser, transToCsvFile }  = require('../util')
let createUrl = (pageSize = 1) => {
  return `https://weibo.com/2562614804/fans?cfs=600&relate=fans&t=1&f=1&type=&Pl_Official_RelationFans__88_page=${pageSize}#Pl_Official_RelationFans__88`
}
const getPerPageFans = async (page) => {
  try {
    let ownfansOfPerPage = await page.evaluate(() => {
      let fanList = [...document.querySelectorAll('.follow_box .follow_list li.follow_item')]
      let fanDetail = []
      for (let j = 0; j <= fanList.length; j++) {
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
    return ownfansOfPerPage
  } catch (e) {
    console.log('e', e)
    return false
  }
}
// 改成一个类
const main = async () => {
  let allOwnFans = []
  const browser = await createBrowser()
  const page = await browser.newPage()
  let url = createUrl()
  await page.goto(url)
  let lastPage = await getLastPage(page)
  console.log('lastPage', lastPage)
  for (var i = 0; i <= lastPage; i++) {
    let ownfansOfPerPage = await getPerPageFans(page)
    if (ownfansOfPerPage) {
      allOwnFans = [...allOwnFans, ownfansOfPerPage]
    }
  }
  console.log('allOwnFans', allOwnFans.length)
  transToCsvFile(allOwnFans)
}
main()
