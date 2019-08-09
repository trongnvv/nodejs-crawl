const CoreApi = require('../base/core_api');
const cheerio = require('cheerio');
const FileHandle = require('./file_handle');
class CrawlHandle {
    constructor() {
        this.coreApi = new CoreApi();
        this.fileHandle = new FileHandle();
    }

    async crawl(url) {
        try {
            let urls = await this.getUrlPagesProducts(url);
            let products = [];
            for (let i = 0; i < urls.length; i++) {
                let product = await this.geListProductDetail(urls[i]);
                products.push(product);
            }

            this.fileHandle.writeFile(products);
        } catch (error) {
            console.log(error);
        }
    }

    getUrlPagesProducts(url) {
        return new Promise(async (resolve, reject) => {
            try {
                let html = await this.coreApi.get(url);
                let $ = cheerio.load(html);
                let urls = [];
                let isDone = false;
                let idElment = '#main-menu';
                $(idElment).find("a").each(function (i, elm) {
                    let data = {
                        name: $(this).text(),
                        src: $(this).attr('href')
                    }
                    urls.push(data);
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

    geListProductDetail(page, isExtra = false) {
        let self = this;
        return new Promise(async (resolve, reject) => {
            try {
                let html = await this.coreApi.get(page.src);
                let $ = cheerio.load(html);
                let isDone = false;
                let data = {
                    titile: page.name,
                    image_src: [],
                    products: [],
                }
                if (!isExtra) {
                    if ($('.aligncenter').length != 0)
                        $('.aligncenter').each(function (i, elm) {
                            data.image_src.push($(this).attr('src'));
                        });
                }
                if ($('.archive-rem').find('#featured-thumbnail').length != 0) {
                    $('.archive-rem').find('#featured-thumbnail').each(function (i, elm) {
                        let item = {
                            name: $(this).attr().title,
                            src: $(this).attr().href
                        }
                        data.products.push(item);
                        if (i == $('.archive-rem').find("#featured-thumbnail").length - 1) {
                            isDone = true;
                        }
                        if (isDone) {
                            let isReallyDone = false;

                            if ($('.pagination').find('a').length != 0 && !isExtra) {
                                $('.pagination').find('a').each(async function (i, elm) {
                                    if ($(this).attr().class.indexOf("next") == -1) {
                                        let product = await self.geListProductDetail({
                                            name: page.name,
                                            src: $(this).attr().href
                                        }, true);
                                        for (let j = 0; j < product.products.length; j++) {
                                            data.products.push(product.products[j]);
                                        }
                                        if ($('.pagination').find('a').length - 2 == i) {
                                            isReallyDone = true;
                                        }

                                        if (isReallyDone) {
                                            resolve(data);
                                        }
                                    }

                                });

                            } else {
                                resolve(data);
                            }
                        }
                    });
                } else {
                    resolve(data);
                }

            } catch (error) {
                console.log(error);
                reject(error)
            }
        })
    }

}

module.exports = CrawlHandle;