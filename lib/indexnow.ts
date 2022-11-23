import pathFn = require('path')
import fs = require('fs')
import readline = require('readline')

function FileReadline (ReadName:string, callback:(arr:any[])=>void) {
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
  const publicDir = this.public_dir
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
      log.info('unknown search engine,use indexnow.org')
      IndexServer = 'https://api.indexnow.org/indexnow'
  }
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
    import('node-fetch').then((nodeFetch) => {
      const Fetch = fetch || nodeFetch.default
      Fetch(
        IndexServer,
        {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData)
        }
      ).then((r) => {
        if (r.ok) {
          log.info('indexnow submitted')
        } else {
          log.info('indexnow error')
          log.info(r)
        }
      }).catch((e) => {
        throw Error(e)
      })
    })
  })
}
