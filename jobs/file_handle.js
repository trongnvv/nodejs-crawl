
const fs = require('fs'),
    axios = require('axios');

class DownloadHandle {
    constructor() {

    }

    download(url, image_path) {
        return new Promise((resolve, reject) => {
            axios({ 'url': url, 'responseType': 'stream' })
                .then(response => {
                    response.data.pipe(fs.createWriteStream(image_path));

                    return resolve({
                        message: 'download success',
                        url: url,
                        image_path: image_path
                    });

                }).catch(error => reject({ error: 'Error: ' + error.message }))
        })
    }

    async downloadFile(url, dir, filename) {
        try {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            let image_path = './' + dir + '/' + filename + '.jpg';
            await download_image(url, image_path);
        } catch (error) {
            console.log(error);
        }
    }

}

module.exports = DownloadHandle;