'use strict'

module.export = (locals) => {
  const log = this.log
  const config = this.config
  let count = config.hexo_indexnow.count
  const linkReplace = config.hexo_indexnow.replace
  if (count === 'latest') {
    count = 1
  }
}
