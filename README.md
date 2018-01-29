# spider-weibo
spider weibo
利用 puppeteer 操控浏览器爬取微博信息
## 使用步骤
1. npm install
2. 进入lib目录执行getOwnAllFans.js,得到自己的所有粉丝信息，并导出名字，链接，地址的csv文件
3. 进入lib目录执行getFivePageFans.js,得到他人的所有粉丝信息，并导出名字，链接，地址的csv文件
## 备注
1. npm install 需要下载chrome，如果网络异常下载失败，可自行前往下载，并放到项目里的node_modules/puppeteer/local/chrome-win32
2. 由于微博限制，目前进入他人界面，只能拿到前五页的粉丝信息
3. 自己的所有粉丝信息导出的数据可能比微博列表上显示的少，是因为微博的会屏蔽掉广告类的粉丝。
