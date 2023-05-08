'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const indexnow_1 = require("./lib/indexnow");
hexo.extend.generator.register('indexnow_url_generator', indexnow_1.generatorURLs);
hexo.extend.generator.register('indexnow_key_generator', indexnow_1.apiKey);
hexo.extend.deployer.register('indexnow_url_submitter', indexnow_1.submitURLs);
