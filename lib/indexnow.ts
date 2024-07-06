import pathFn from 'node:path'
import fs from 'node:fs'
import readline from 'node:readline'

function generatorURLs(locals) {
  const log = this.log
  const config = this.config
  let count = config.hexo_indexnow.count
  const urlsPath: string = config.hexo_indexnow.txt_name
  const logUrls: string = config.hexo_indexnow.log_urls
  const linkReplace = config.hexo_indexnow.replace
  if (count === 'latest') {
    count = 1
  } else if (!count) {
    return
  }
  log.info(`Generating urls for last ${count} posts`)
  const urls: string[] = [].concat(locals.posts.toArray())
    .map(post => {
      return {
        date: post.updated || post.date,
        permalink: post.permalink
      }
    })
    .sort((a, b) => {
      return b.date - a.date
    })
    .slice(0, count)
    .map(post => post.permalink)
  if (!logUrls) {
    log.info(`Posts urls generated in ${urlsPath}`)
    urls.forEach(x => log.info(x))
  }
  return {
    path: urlsPath,
    data: urls.join('\n')
  }
}

function apiKey(_) {
  const log = this.log
  const apiKey: string = this.config.hexo_indexnow.apikey
  log.info('Indexnow apikey generated')
  return {
    path: apiKey,
    data: apiKey
  }
}

function FileReadline(ReadName: string, callback: (arr: any[]) => void) {
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

function submitURLs(_) {
  const log = this.log
  const config = this.config
  const publicDir: string = this.public_dir
  const urlsPath: string = config.hexo_indexnow.txt_name
  const site: string = config.url
  let IndexServer: string = config.hexo_indexnow.server
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
      log.info('Unknown search engine,use indexnow.org')
      IndexServer = 'https://api.indexnow.org/indexnow'
  }
  const apiKey: string = config.hexo_indexnow.apikey
  const UrlsFile: string = pathFn.join(publicDir, urlsPath)
  FileReadline(UrlsFile, data => {
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
        log.info(r)
      }
    }).catch(e => {
      throw Error(e)
    })
  })
}

export {
  generatorURLs,
  apiKey,
  submitURLs
}
