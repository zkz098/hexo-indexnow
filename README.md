**[No Longer Actively Maintained] I have lost interest in maintaining Hexo-related projects, and thus I will no longer continue to maintain this project. If you wish to continue maintaining it, you can create a Fork.**

# hexo-indexnow
[中文使用文档](https://www.kaitaku.xyz/webbuild/hexo/indexnow/) \
hexo-indexnow is a lightweight SEO (indexnow) plugin. \
It provides a simple and easy way to submit a link to indexnow.
## start from zero
Install this plugin:
```bash
yarn add hexo-indexnow
# if you use npm
npm i hexo-indexnow
```
First, you should get an api key from a search engine, such as [Microsoft Bing](https://www.bing.com/indexnow).
Next change the configuration of hexo:
```yaml
hexo_indexnow:
  count: 1 # number or "latest"
  txt_name: indexnow.txt # links file name
  apikey: xxxxxx # indexNow Apikey
  server: bing # The server that received the request
               # For example: bing, yandex, indexnow
  log_urls: false # Log url list on output log

deploy:
  - type: indexnow_url_submitter
```



