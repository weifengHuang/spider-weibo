
const loginWeibo = async (page) => {
  await page.goto('https://weibo.com/login.php?url=https%3A%2F%2Fweibo.com%2Fmygroups%3Fgid%3D3464180361728583%26wvr%3D6%26leftnav%3D1%26pids%3Dplc_main');
  await page.type('#loginname', user.account)
  await page.type('.password input', user.passWord)
  var login = await page.$('.login_btn')
  // console.log('login', login)
  await login.click()
  // await page.waitFor(5000)
  await page.waitForSelector('.nameBox')
}
module.exports = loginWeibo
