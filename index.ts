'use strict'
/* global hexo */

// eslint-disable-next-line @typescript-eslint/no-var-requires
hexo.extend.generator.register('indexnow_url_generator', require('./lib/generator').generatorURLs)
// eslint-disable-next-line @typescript-eslint/no-var-requires
hexo.extend.generator.register('indexnow_key_generator', require('./lib/generator').apiKey)
// eslint-disable-next-line @typescript-eslint/no-var-requires
hexo.extend.deployer.register('indexnow_url_submitter', require('./lib/indexnow'))
