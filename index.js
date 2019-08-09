const CrawlHandle = require('./jobs/crawl_handle');
const config = require('./config');
class Boot {
    constructor() {
        this.crawlHandle = new CrawlHandle();
    }

    start() {
        console.log('START CRAWL');
        this.crawlHandle.start();
    }

    download() {
        console.log('START DOWNLOAD');
        this.crawlHandle.download();
    }
}

var instance = new Boot();
if (process.argv.slice(2)[0] == 'start') {
    instance.start();
} else if (process.argv.slice(2)[0] == 'download') {
    instance.download();
} else {
    console.log('please select process');
}
