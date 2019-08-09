const CrawlHandle = require('./jobs/crawl_handle');
const config = require('./config');
class Boot {
    constructor() {
        this.crawlHandle = new CrawlHandle();
    }

    start() {
        console.log('START CRAWL');
        this.crawlHandle.crawl(config.URl_CRAWL);
    }
}

var instance = new Boot();
instance.start();
