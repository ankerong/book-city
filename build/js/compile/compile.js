define([
    'zepto',
    'handlebars'
], function($, Handlebars) {
    return function(text, data, perent, flag) {
        var compile = Handlebars.compile(text);
        Handlebars.registerHelper('finish', function(items) {
            if (items) {
                return '完结'
            } else {
                return '连接中...'
            }
        });
        Handlebars.registerHelper('wordcount', function(items) {
            return Math.round(items / 10000);
        })
        Handlebars.registerHelper('updatedTime', function(items) {
            // 2017-1-16 16:14
            var data = new Date(items);
            return data.getFullYear() + '-' + (data.getMonth() + 1) + '-' + data.getDate() + ' ' + data.getHours() + ':' + data.getMinutes();
        })
        if (flag) {
            $(perent).append(compile(data));
        } else {
            $(perent).html(compile(data));
        }
    }
});