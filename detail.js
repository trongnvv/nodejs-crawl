module.exports = function (request, cheerio, db) {
    var obj = {};
    var options = {
        headers: { 'user-agent': 'node.js' }
    }
    obj.request = function (URL, url, callback, bool) {
        var list = [];
        request(url, options, function (err, resp, html) {
            if (!err) {
                const $ = cheerio.load(html);
                let type_name = $('.page-title').text();
                $('.product').each(function (i, elm) {
                    let src_img_root = $('img', this).attr('src');
                    let type_img = src_img_root.split('.')[src_img_root.split('.').length - 1];
                    let img_arr = [];
                    img_arr = src_img_root.split('-');
                    var src_img = "";
                    for (let i = 0; i < img_arr.length; i++) {
                        if (i != img_arr.length - 1) {
                            src_img += img_arr[i] + '-';
                        } else {
                            src_img = src_img.substring(0, src_img.length - 1);
                            src_img += '.' + type_img;
                        }
                    }
                    let name_product = $('h3', this).text();
                    let arr = [type_name, name_product, src_img];
                    list.push(arr);
                });
                callback(list, bool);
            }
        });
    }
    return obj;
}