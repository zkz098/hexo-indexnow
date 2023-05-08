'use strict'
/* global hexo */
import { generatorURLs, apiKey, submitURLs } from './lib/indexnow'

hexo.extend.generator.register('indexnow_url_generator', generatorURLs)
hexo.extend.generator.register('indexnow_key_generator', apiKey)
hexo.extend.deployer.register('indexnow_url_submitter', submitURLs)
