var request = require('request'),
    cheerio = require('cheerio'),
    db = require('./configDB'),
    fs = require('fs'),
    axios = require('axios'),
    download = require('./download')(fs, axios),
    detail = require('./detail')(request, cheerio, db);

var options = {
    headers: { 'user-agent': 'node.js' }
}
var URL = "http://remhoanglan.vn";
var datas = [];
function startCrawl() {
    request(URL, options, function (err, resp, html) {
        if (!err) {
            const $ = cheerio.load(html);
            let bool = false;
            $('#menu-danh-muc-san-pham').children().each(function (i, elm) {
                let url = $('a', this).attr('href');
                if (i == $('#menu-danh-muc-san-pham').length - 1) {
                    bool = true;
                }
                detail.request(URL, url, addData, bool);
            });
        }
    }, saveToDatabase);
}

function addData(list, bool) {
    for (let i = 0; i < list.length; i++) {
        datas.push(list[i]);
    }
    if (bool == true) {
        // console.log(datas);
        saveToDatabase();
    }
}

function saveToDatabase() {
    db.getConnection(function (err, connection) {
        if (err) throw err;
        var sql = "INSERT INTO data (type,name,src) VALUES ?";
        connection.query(sql, [datas], function (err, result) {
            if (err) throw err;
            // console.log(result);
            connection.release();
        });
    });
}

function downloadImg() {
    db.getConnection(function (err, connection) {
        if (err) throw err;
        var sql = "select * from data";
        connection.query(sql, function (err, result) {
            if (err) throw err;
            for (let i = 0; i < result.length; i++) {
                // let i = 0;
                console.log(result[i].src);
                download.download(result[i].src, result[i].name, result[i].type);
            }
            connection.release();
        });
    });
}


downloadImg();
// startCrawl();