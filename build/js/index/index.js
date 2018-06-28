define([
    'zepto',
    'Swiper',
    'compile',
    'text!template/index.html',
    'text!template/block_list.html',
    'text!template/import.html',
    'text!template/dl_love.html',
    'text!template/book-self.html'
], function($, Swiper, compile, str, block, recommend, dllove, bookself) {
    // console.log(text);
    var index = 0;
    // 书城和书架的切换
    $('.nav_middle span').on('click', function() {
            index = $(this).index();
            $(this).addClass('active').siblings().removeClass('active');
            $('.box').css({
                transform: 'translate(-' + index * 100 + '%,0)'
            })
        })
        // 渲染书城内容
    $.ajax({
            url: '/api/index',
            dataType: 'json',
            success: function(data) {
                // 轮播图
                compile(str, data.items[0].data, '.scroll_banner');
                var mySwiper = new Swiper('.pic', {
                    autoplay: true,
                    loop: true
                });
                // 本周最火
                compile(block, data.items[1], '.week-hot');
                // console.log(data);
                data.items[5].data.data.map(function(v) {
                    v.title = v.data.title;
                    v.cover = v.data.cover;
                    v.fiction_id = v.data.fiction_id;
                });
                // 限时免费
                compile(block, data.items[5], '.time-free');
                // 重磅推荐
                var index = 0;
                compile(recommend, change(index, data.items[2].data.data), '.recommend_cont');
                // 女生最爱
                compile(dllove, change(index, data.items[3].data.data), '.gril-cont')
                    //男生最爱
                compile(dllove, change(index, data.items[4].data.data), '.boy-cont')
                    // 换一换
                $('.import_ol').on('tap', '.change_btn', function() {
                    var index = $(this).data('id') * 1;
                    var ind = $(this).attr('data'); // 2 重磅 3、4男女生最爱
                    var obj = data.items[ind];
                    index++;
                    index = index % (obj.data.count / 5);
                    var str = ind == 2 ? recommend : dllove;
                    $(this).data('id', index);
                    compile(str, change(index, obj.data.data), '.' + $(this).parent().prev().attr('class'));
                });
                // 精选专题
                compile($('.text').html(), data.items[6], '.shif-cont')
                    // 上拉加载
                loadlast('main');
            }
        })
        // 渲染书架内容
    $.ajax({
            url: '/api/bookself',
            dataType: 'json',
            success: init
        })
        // 书架
    function init(data) {
        //console.log(data);
        compile(bookself, data.items[1], '.book-self-cont');
        // 切换的
        compile(bookself, data.items[2], '.book-show');
        $('.toggle').on('click', function() {
            $('.book-cont').hide();
            $('.book-show').show();
        })
    }

    // 01 02... 
    function change(ind, arr) {
        var limit = 5; // 长度为5
        var startind = ind * limit; //0起始下标
        var endind = ind * limit + limit; //4结束下标
        var newArr = arr.slice(startind, endind);
        newArr.map(function(v, i) {
            v.count = i + 1;
        })
        return newArr;
    }


    // 页码
    var loadnum = 0;

    function loadlast(parent) {
        if (loadnum >= 3) {
            $('.loading').html('暂无更多数据');
            return false;
        } else {

        }
        // 可视区域的接口
        var clientH = $(this).height();
        $(parent).on('scroll', function() {
            // 最大的滚动距离
            var maxH = $(this).children().height() - clientH;
            // 当前的滚动距离+40大于等于最大的滚动距离是loadnum++
            if ($(this).scrollTop() + 40 >= maxH) {
                $(this).off('scroll');
                loadnum++;
                loadmore(loadnum);
            }
        });
    }
    // 加载更多的回调函数接口
    function loadmore(n) {
        $.ajax({
            url: '/api/loadlast',
            data: {
                loadnum: n,
                limit: 10
            },
            dataType: 'json',
            success: function(data) {
                console.log(data)
                compile(dllove, data.items, '.load-list');
                loadlast('main');
            }
        })
    }
});