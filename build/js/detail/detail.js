define([
    'zepto',
    'getUrl',
    'compile',
    'text!template/detail.html'
], function($, getUrl, compile, detailtext) {
    var $id = getUrl('id');
    $.ajax({
        url: '/api/detail?id=' + $id,
        dataType: 'json',
        success: function(data) {
            $('.header-title').html(data.item.title);
            console.log(data);
            compile(detailtext, data, '.scroll');
        }
    })
});