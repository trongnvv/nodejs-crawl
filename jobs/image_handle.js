
const fs = require('fs');
const FileHandle = require('../utils/file_handle');

class ImageHandle {
    constructor() {
        this.fileHandle = new FileHandle();
    }

    async start() {
        readdir('http://www.remminhdang.com/image_upload/product/', function (err, files) {
            //handling error
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            }
            //listing all files using forEach
            files.forEach(function (file) {
                // Do whatever you want to do with the file
                console.log(file);
            });
        });

        // await this.downloadProduct();
        // await this.downloadCategory();
    }

    async downloadProduct() {
        if (!fs.existsSync('image_product')) {
            fs.mkdirSync('image_product');
        }
        let products = await this.fileHandle.readFile('full_product.json');
        for (let i = 0; i < products.length; i++) {
            await this.downloadFile(products[i].src, "image_product/" + products[i].category_id, products[i].name);
        }
    }

    async downloadCategory() {
        let categories = await this.fileHandle.readFile('category.json');
        if (!fs.existsSync('image_category')) {
            fs.mkdirSync('image_category');
        }
        for (let i = 0; i < categories.length; i++) {
            for (let j = 0; j < categories[i].image_src.length; j++) {
                // console.log(categories[i].image_src[j], "image_category/" + categories[i].id, categories[i].title);
                await this.downloadFile(categories[i].image_src[j], "image_category/" + categories[i].id, categories[i].title);
            }
        }
    }

    async downloadFile(url, dir, filename) {
        try {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            let image_path = './' + dir + '/' + filename + '.jpg';
            let res = await this.fileHandle.download(url, image_path);
            console.log(res);

        } catch (error) {
            console.log(error);
        }
    }



}

module.exports = ImageHandle;