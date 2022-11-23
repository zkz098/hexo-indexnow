"use strict";
function generatorURLs(locals) {
    const log = this.log;
    const config = this.config;
    let count = config.hexo_indexnow.count;
    const urlsPath = config.hexo_indexnow.txt_name;
    const linkReplace = config.hexo_indexnow.replace;
    if (count === 'latest') {
        count = 1;
    }
    log.info(`Generating urls for last ${count} posts`);
    const urls = [].concat(locals.posts.toArray())
        .map((post) => {
        return {
            date: post.updated || post.date,
            permalink: post.permalink
        };
    })
        .sort((a, b) => {
        return b.date - a.date;
    })
        .slice(0, count)
        .map((post) => {
        const tempLink = post.permalink;
        if (linkReplace) {
            const findWhat = config.hexo_indexnow.find_what;
            const replaceWith = config.hexo_indexnow.replace_with;
            tempLink.replace(findWhat, replaceWith);
        }
        return tempLink;
    })
        .join('\n');
    log.info(`Posts urls generated in ${urlsPath} \n ${urls}`);
    return {
        path: urlsPath,
        data: urls
    };
}
function apiKey(locals) {
    const log = this.log;
    const apiKey = this.config.hexo_indexnow.apikey;
    log.info('Indexnow apikey generated');
    return {
        path: apiKey,
        data: apiKey
    };
}
module.exports = {
    generatorURLs,
    apiKey
};
