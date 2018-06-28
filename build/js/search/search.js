define([
    'zepto',
    'compile',
    'text!template/dl_love.html'
], function($, compile, dllove) {
    // 本地存储
    var storage = window.localStorage;
    // 空数组存input的val
    var searchdata = JSON.parse(storage.getItem('searchinfo')) || [];
    serchinfo();
    // 初始显示页面
    $.ajax({
            url: '/api/searchKey',
            dataType: 'json',
            success: function(data) {
                // console.log(data);
                compile($('.text').html(), data, '.search-count-list');
            }
        })
        // 点击搜索
    $('.search-input__btn').on('click', function() {
        var inp = $(this).prev();
        var val = inp.val();
        if (val != '') {
            searchdata.unshift(val);
            storage.setItem('searchinfo', JSON.stringify(searchdata));
            serchinfo();
            $.getJSON('/api/search', { value: val }, function(data) {
                // console.log(data);
                // 渲染搜索结果
                if (data.mes == 'success') {
                    compile(dllove, data.cont, '.search-cont');
                    // 懒加载
                    // $('img.lazy').lazyload({
                    //     effect: 'fadeIn',
                    //     container: $('.search-cont')
                    // })
                } else {
                    $('.search-cont').html(data.mes);
                }
            })
        }
    });

    function serchinfo() {
        compile($('.historylist').html(), searchdata, '.history-list')
    }
    // 删除历史记录
    $('.history-list').on('click', 'em', function() {
        var ix = $(this).data('ind');
        searchdata.splice(ix, 1);
        storage.setItem('searchinfo', JSON.stringify(searchdata));
        serchinfo();
    })
});