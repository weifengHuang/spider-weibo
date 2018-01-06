var json2csv = require('json2csv')
var fs = require('fs')
const transToCsvFile = (data, option = {}) => {
  let {fields, fieldNames, path} = option
  fields = fields || ['name', 'href', 'address']
  fieldNames = fieldNames || ['名称', '链接', '地址']
  path = path || `${new Date().getTime()}.csv`
  // const fields = ['name', 'href', 'address']
  // const fieldNames = ['名称', '链接', '地址']
  const csv = json2csv({data, fields, fieldNames})
  console.log('csv', csv)
  fs.writeFile(path, csv, function(err) {
    if (err) throw err;
    console.log('file saved')
  })
}
module.exports = transToCsvFile
