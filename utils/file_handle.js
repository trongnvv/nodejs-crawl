
const fs = require('fs'),
    axios = require('axios');

class FileHandle {
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

    writeFile(item, name_file) {
        let data = JSON.stringify(item);
        if (!fs.existsSync('out')) {
            fs.mkdirSync('out');
        }
        return new Promise((resolve, reject) => {
            fs.writeFile('out/' + name_file, data, (err) => {
                if (err) reject();
                console.log('Data written to file ' + name_file);
                resolve();
            });
        })
    }

    readFile(name_file) {
        return new Promise((resolve, reject) => {
            fs.readFile('out/' + name_file, { encoding: 'utf-8' }, function (err, data) {
                if (!err) {
                    resolve(JSON.parse(data));
                } else {
                    reject(err);
                }
            });
        })
    }
}

module.exports = FileHandle;