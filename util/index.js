
const createBrowser = require('./createBrowser')
const transToCsvFile = require('./transToCsvFile')
const getLastPage = async (page) => {
  let lastPage = await page.evaluate(() => {
    let pages = [...document.querySelectorAll('.WB_cardpage.S_line1 .W_pages a.page.S_txt1')]
    console.log('pages', pages)
    // 最后一页在倒数第二个标签
    let lastPage = pages[pages.length - 2]
    return lastPage.innerText
  })
  return lastPage
}
module.exports = {
  getLastPage,
  createBrowser,
  transToCsvFile
}
