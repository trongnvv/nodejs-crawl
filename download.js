module.exports = function (fs, axios) {

    var obj = {};
    const download_image = (url, image_path) => axios({ 'url': url, 'responseType': 'stream' })
        .then(response => {
            response.data.pipe(fs.createWriteStream(image_path));

            return { 'status': true, 'error': '' };

        }).catch(error => ({ 'status': false, 'error': 'Error: ' + error.message }));

    obj.download = function (uri, filename, dir) {

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        (async () => {
            let example_image_1 = await download_image(uri, './' + dir + '/' + filename + '.jpg');
            console.log(example_image_1.status); // true
            console.log(example_image_1.error);  // ''
        })();
    };
    return obj;
}
