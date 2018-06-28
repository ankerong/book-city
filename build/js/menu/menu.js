define([
    'zepto',
    'compile',
    'getUrl'
], function($, compile, getUrl) {
    var bookid = getUrl('id');
    var activeid = getUrl('active');
    var storge = window.localStorage;
    console.log(bookid, activeid);
    $.ajax({
        url: '/api/readbook',
        data: {
            id: bookid
        },
        dataType: 'json',
        success: function(data) {
            data.item.toc.map(function(v) {
                v.chapter_id == activeid ? v.active = true : v.active = false;
            });
            console.log(data.item.toc);
            compile($('.text').html(), data.item.toc, '.content');
            scroll(data.item.toc.length);
        }
    });

    function scroll(n) {
        $('.main').scrollTop($('li.active').position().top);
        // 目录下的章节点击时
        $('.content').on('click', 'li', function() {
            // 判断本地存储是否已经登录无则登录有则无需登录
            if (storge.getItem('logincode')) {
                // 已经登录
                window.location.href = "text.html?id=" + bookid + '&chaptersum=' + n + '&curchapter=' + $(this).index();
            } else {
                // 没有登录
                alert('请先登录');
                window.location.href = 'login.html';
            }
        });
    }
});