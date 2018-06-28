define([
    'jquery',
    'compile',
    'getUrl',
    'base64'
], function($, compile, getUrl) {
    // 本地存储
    var storge = window.localStorage;
    // 默认显示第一张
    var chapterId = getUrl('curchapter') || 1;
    var fontSize = storge.getItem('fontsize') || 16;
    var background = storge.getItem('background');
    $('.content').css('background', background);
    $('.content').css('fontSize', fontSize + 'px');
    getText();
    // 获取总章节
    var chaptersum = getUrl('chaptersum');
    $('.num').html(chaptersum);

    // 点击下一张
    $('.next').on('click', function() {
        chapterId++;
        chapterId = chapterId >= chaptersum ? chaptersum : chapterId;
        getText();
    });
    // 点击上一张
    $('.prev').on('click', function() {
        chapterId--;
        chapterId = chapterId <= 1 ? 1 : chapterId;
        getText();
    });
    // 点击目录页
    $('.menu_btn').on('click', function() {
        window.location.href = "menu.html?id=" + getUrl('id') + '&active=' + chapterId;
    });
    // 阅读内容点击时头部和尾部进行显示隐藏
    $('.content').on('click', function() {
        $('.menu').toggle();
    });
    // 点击字体显示隐藏
    $('.menu_size').on('click', function() {
        $('.menumost').toggle();
    });
    // 点击字体大小时
    $('.menumost_one').on('click', 'span', function() {
        fontSize = parseInt($('.content').css('fontSize'));
        console.log(fontSize);
        if ($(this).html() === '大') {
            $('.content').css('fontSize', ++fontSize);
        } else {
            $('.content').css('fontSize', --fontSize);
        }
        storge.setItem('fontsize', fontSize);
        return false;
    });
    // 点击背景时
    $('.menumost_two').on('click', 'b', function() {
        background = $(this).css('background');
        $('.content').css('background', background);
        storge.setItem('background', background);
    });

    // 获取章节文本
    function getText() {
        $.ajax({
            url: '/api/reader',
            data: {
                chapterNum: chapterId
            },
            dataType: 'json',
            success: function(data) {
                jsonp(data.jsonp, function(data) {
                    var data = JSON.parse($.base64().decode(data));
                    compile($('.text').html(), data, '.content');
                    $('.sum').html(chapterId);
                });
            }
        });
    }


    function jsonp(url, success) {
        var script = document.createElement('script'); // 创建script标签
        window['duokan_fiction_chapter'] = function(data) {
            success(data);
            document.head.removeChild(script);
        }
        script.src = url;
        document.head.appendChild(script);
    }
});