const CoreApi = require('../base/core_api');
const cheerio = require('cheerio');
class CrawlHandle {
    constructor() {
        this.coreApi = new CoreApi();

    }

    async crawl(url) {
        try {

            let urls = await this.getUrlPagesProducts(url);
            console.log(urls);
        } catch (error) {

        }
    }

    getUrlPagesProducts(url) {
        return new Promise(async (resolve, reject) => {
            try {
                let html = await this.coreApi.get(url);
                let $ = cheerio.load(html);
                let urls = [];
                let idElment = '#main-menu';
                let isDone = false;
                $(idElment).find("a").each(function (i, elm) {
                    urls.push($(this).attr('href'));
                    if (i == $(idElment).find("a").length - 1) {
                        isDone = true;
                    }
                    if (isDone) resolve(urls);
                });

            } catch (error) {
                console.log(error);
                reject(error)
            }
        })
    }

}

module.exports = CrawlHandle;