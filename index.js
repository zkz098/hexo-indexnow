/* global hexo */

hexo.extend.generator.register('indexnow_url_generator', require('./lib/generator').generatorURLs)
hexo.extend.generator.register('indexnow_key_generator', require('./lib/generator').apiKey)
hexo.extend.deployer.register('indexnow_url_submitter', require('./lib/indexnow'))
