var homeData = require('./home/home.json');
var page1 = require('./home/recommend1.json');
var page2 = require('./home/recommend2.json');
var page3 = require('./home/recommend3.json');
var searchKey = require('./search/searchKey.json');
var searchResult = require('./search/search.json');
var detail = require('./detail/352876.json');
var readbook = require('./reader/chapter-list.json');
var reader1 = require('./reader/data1.json');
var reader2 = require('./reader/data2.json');
var reader3 = require('./reader/data3.json');
var reader4 = require('./reader/data4.json');

var data = {
    '/api/index': homeData,
    '/api/loadlast?loadnum=1&limit=10': page1,
    '/api/loadlast?loadnum=2&limit=10': page2,
    '/api/loadlast?loadnum=3&limit=10': page3,
    '/api/bookself': homeData,
    '/api/searchKey': searchKey,
    '/api/search': searchResult,
    '/api/detail?id=352876': detail,
    '/api/readbook?id=352876': readbook,
    '/api/reader?chapterNum=1': reader1,
    '/api/reader?chapterNum=2': reader2,
    '/api/reader?chapterNum=3': reader3,
    '/api/reader?chapterNum=4': reader4,
};
module.exports = function(url) {
    if (/\/api\/search\?/.test(url)) {
        var obj = url.split('?')[1];
        var val = decodeURIComponent(obj.split('=')[1]);
        var reg = new RegExp(val, 'g');
        var str = {
            mes: '暂无数据',
            cont: []
        }
        var newArr = searchResult.items.filter(function(v, i) {
            v.authors = v.role[0][1];
            v.summary = v.intro;
            return reg.test(v.title) || reg.test(v.intro) || reg.test(v.role[0][1]);
        });
        if (newArr.length) {
            str.mes = 'success';
            str.cont = newArr;
        }
        return str;
    }
    return data[url];
}