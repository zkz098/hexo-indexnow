"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatorURLs = generatorURLs;
exports.apiKey = apiKey;
exports.submitURLs = submitURLs;
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_readline_1 = __importDefault(require("node:readline"));
function generatorURLs(locals) {
    const log = this.log;
    const config = this.config;
    let count = config.hexo_indexnow.count;
    const urlsPath = config.hexo_indexnow.txt_name;
    const logUrls = config.hexo_indexnow.log_urls;
    const linkReplace = config.hexo_indexnow.replace;
    if (count === 'latest') {
        count = 1;
    }
    else if (!count) {
        return;
    }
    log.info(`Generating urls for last ${count} posts`);
    const urls = [].concat(locals.posts.toArray())
        .map(post => {
        return {
            date: post.updated || post.date,
            permalink: post.permalink
        };
    })
        .sort((a, b) => {
        return b.date - a.date;
    })
        .slice(0, count)
        .map(post => post.permalink);
    if (logUrls) {
        log.info(`Posts urls generated in ${urlsPath}`);
        urls.forEach(x => log.info(x));
    }
    return {
        path: urlsPath,
        data: urls.join('\n')
    };
}
function apiKey(_) {
    const log = this.log;
    const apiKey = this.config.hexo_indexnow.apikey;
    log.info('Indexnow apikey generated');
    return {
        path: apiKey,
        data: apiKey
    };
}
function FileReadline(ReadName, callback) {
    const fRead = node_fs_1.default.createReadStream(ReadName, 'utf8');
    const objReadline = node_readline_1.default.createInterface({
        input: fRead
    });
    const arr = [];
    objReadline.on('line', function (line) {
        arr.push(line);
    });
    objReadline.on('close', function () {
        callback(arr);
    });
}
function submitURLs(_) {
    const log = this.log;
    const config = this.config;
    const publicDir = this.public_dir;
    const urlsPath = config.hexo_indexnow.txt_name;
    const site = config.url;
    let IndexServer = config.hexo_indexnow.server;
    switch (IndexServer) {
        case 'bing':
            IndexServer = 'https://www.bing.com/indexnow';
            break;
        case 'yandex':
            IndexServer = 'https://yandex.com/indexnow';
            break;
        case 'indexnow':
            IndexServer = 'https://api.indexnow.org/indexnow';
            break;
        case 'seznam.cz':
            IndexServer = 'https://search.seznam.cz/indexnow';
            break;
        default:
            log.info('Unknown search engine,use indexnow.org');
            IndexServer = 'https://api.indexnow.org/indexnow';
    }
    const apiKey = config.hexo_indexnow.apikey;
    const UrlsFile = node_path_1.default.join(publicDir, urlsPath);
    FileReadline(UrlsFile, data => {
        log.info('Submitting indexnow urls');
        const submitData = {
            host: site,
            key: apiKey,
            keyLocation: `${site}/${apiKey}`,
            urlList: data
        };
        fetch(IndexServer, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(submitData)
        }).then(r => {
            if (r.ok) {
                log.info('indexnow submitted');
            }
            else {
                log.info('indexnow error');
                log.info(r);
            }
        }).catch(e => {
            throw Error(e);
        });
    });
}
