const CoreApi = require('../base/core_api');
const cheerio = require('cheerio');
const FileHandle = require('./file_handle');
const config = require('../config');
class CrawlHandle {
    constructor() {
        this.coreApi = new CoreApi();
        this.fileHandle = new FileHandle();
    }

    async start() {
        // await this.crawl(config.URl_CRAWL);
        // await this.saveProductAndCategory();
        await this.saveFullProduct();
    }

    async crawl(url) {
        try {
            let urls = await this.getUrlPagesProducts(url);
            let data = [];

            for (let i = 0; i < urls.length; i++) {
                try {
                    let data_page = await this.geListProductDetail(urls[i]);
                    data.push(data_page);
                } catch (error) {
                    console.log(error);
                }
            }

            await this.fileHandle.writeFile(data, 'out.json');
            return;
        } catch (error) {
            console.log(error);
        }
    }

    async saveFullProduct() {
        try {
            let data = await this.fileHandle.readFile('product.json');
            let products = [];
            for (let i = 0; i < data.length; i++) {
                try {
                    let product = await this.getFullProduct(data[i]);
                    console.log('get_product', product);
                    products.push(product);
                } catch (error) {
                    console.log(error);
                }
            }
            await this.fileHandle.writeFile(products, 'full_product.json');
            return;
        } catch (error) {
            console.log(error);
        }
    }

    async getFullProduct(product) {
        return new Promise(async (resolve, reject) => {
            try {
                let html = await this.coreApi.get(product.src);
                let $ = cheerio.load(html);
                // let idElment = '.size-full';
                let idElment = '.alignnone';
                if ($(idElment).length > 0) {
                    $(idElment).each(function (j, elm) {
                        console.log($(idElment).length);
                        if (j == 0 && !!$(this).attr().height) {
                            product['src'] = $(this).attr().src;
                            product['active'] = true;
                            resolve(product);
                        } else if (j == $(idElment).length - 1) {
                            product['active'] = false;
                            resolve(product);
                        }
                    });

                } else {
                    let idElment = '.size-full';
                    if ($(idElment).length > 0) {
                        $(idElment).each(function (j, elm) {
                            if (j == 0 && !!$(this).attr().height) {
                                product['src'] = $(this).attr().src;
                                product['active'] = true;
                                resolve(product);
                            } else if (j == $(idElment).length - 1) {
                                product['active'] = false;
                                resolve(product);
                            }
                        });
                    } else {
                        let idElment = '.size-large';
                        if ($(idElment).length > 0) {
                            $(idElment).each(function (j, elm) {
                                if (j == 0 && !!$(this).attr().height) {
                                    product['src'] = $(this).attr().src;
                                    product['active'] = true;
                                    resolve(product);
                                }
                            });
                        } else {
                            product['active'] = false;
                            resolve(product);
                        }
                    }
                }
            } catch (error) {
                console.log(error);
                reject(error)
            }
        })
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
                    title: page.name,
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

    async saveProductAndCategory() {
        try {
            let categories = [];
            let products = [];
            let data = await this.fileHandle.readFile('out.json');
            for (let i = 0; i < data.length; i++) {
                let category = {
                    id: i,
                    title: data[i].title,
                    image_src: data[i].image_src,
                }

                for (let j = 0; j < data[i].products.length; j++) {
                    let product = {
                        ...data[i].products[j],
                        category_id: i,
                    }
                    products.push(product);
                }
                categories.push(category);
            }
            await this.fileHandle.writeFile(products, 'product.json');
            await this.fileHandle.writeFile(categories, 'category.json');
            return;
        } catch (error) {
            console.log(error);
        }
    }

    async download() {

    }

}

module.exports = CrawlHandle;