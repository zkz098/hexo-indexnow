const pathFn = require('path')
const fs = require('fs')
const readline = require('readline')
const axios = require('axios')

/**
 * 按行读取文件
 * @param ReadName {string}
 * @param callback {function}
 */
function FileReadline (ReadName, callback) {
  const fRead = fs.createReadStream(ReadName, 'utf8')
  const objReadline = readline.createInterface({
    input: fRead
  })
  const arr = []
  objReadline.on('line', function (line) {
    arr.push(line)
  })
  objReadline.on('close', function () {
    callback(arr)
  })
}

module.exports = (args) => {
  const log = this.log
  const config = this.config
  const urlsPath = config.hexo_indexnow.txt_name
  const site = config.url
  let IndexServer = config.hexo_indexnow.server
  switch (IndexServer) {
    case 'bing':
      IndexServer = 'https://www.bing.com/indexnow'
      break
    default:
      log.info('unknown search engine')
  }
  const publicDir = this.public_dir
  const apiKey = config.hexo_indexnow.apikey
  const UrlsFile = pathFn.join(publicDir, urlsPath)
  FileReadline(UrlsFile, (data) => {
    log.info('Submitting indexnow urls \n')
    // TODO 实验性做法
    const submitData = {
      host: site,
      key: apiKey,
      keyLocation: `${site}/${apiKey}`,
      urlList: data
    }
    axios({
      method: 'post',
      url: IndexServer,
      data: submitData
    }).then((res) => {
      log.info('Indexnow submitted')
    })
  })
}
