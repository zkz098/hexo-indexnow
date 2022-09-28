'use strict'
import pfFetch from 'node-fetch'
const pathFn = require('path')
const fs = require('fs')
const readline = require('readline')
if (!fetch) {
  // eslint-disable-next-line no-global-assign
  fetch = pfFetch
}

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

module.exports = function (args) {
  const log = this.log
  const config = this.config
  const urlsPath = config.hexo_indexnow.txt_name
  const site = config.url
  let IndexServer = config.hexo_indexnow.server
  switch (IndexServer) {
    case 'bing':
      IndexServer = 'https://www.bing.com/indexnow'
      break
    case 'yandex':
      IndexServer = 'https://yandex.com/indexnow'
      break
    case 'indexnow':
      IndexServer = 'https://api.indexnow.org/indexnow'
      break
    case 'seznam.cz':
      IndexServer = 'https://search.seznam.cz/indexnow'
      break
    default:
      log.info('unknown search engine')
      IndexServer = 'https://api.indexnow.org/indexnow'
  }
  const publicDir = this.public_dir
  const apiKey = config.hexo_indexnow.apikey
  const UrlsFile = pathFn.join(publicDir, urlsPath)
  FileReadline(UrlsFile, (data) => {
    log.info('Submitting indexnow urls')
    const submitData = {
      host: site,
      key: apiKey,
      keyLocation: `${site}/${apiKey}`,
      urlList: data
    }
    fetch(
      IndexServer,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      }
    ).then(r => {
      if (r.ok) {
        log.info('indexnow submitted')
      } else {
        log.info('indexnow error')
      }
    })
  })
}
