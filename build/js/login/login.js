define([
    'zepto'
], function($) {
    $('button').on('click', function() {
        var user = $('.user').val().trim(); // 手机号
        var pwd = $('.pwd').val().trim(); // 密码
        var errorMes = ''; // 错误信息
        var storge = window.localStorage; // 本地存储
        if (user == '' || pwd == '') {
            errorMes = '用户名或密码不能为空';
        } else {
            // 检测手机号
            var phone = /^1[134578]\d{9}$/; // 手机号的正则检测
            var email = /^\w+@\w+\.[com|con|net]$/; // 邮件的正则检测
            // 判断手机号或输入的邮箱错误则发出错误信息
            if (!(phone.test(user) || email.test(user))) {
                errorMes = '用户名格式错误';
            }
            // 检测密码
            var pwdreg = /[^a-z0-9]/i;
            // 检测密码是否为真 长度小于5大于10则错
            if (pwdreg.test(pwd) || pwd.length < 5 && pwd.length > 10) {
                errorMes = '密码格式有误';
            } else {
                var numreg = /^\d{5,10}$/; // 只是纯数字
                var codereg = /^[a-z]{5,10}$/i; // 只是纯字母
                // 如果检测格式为纯数字或纯字母则发出错误信息
                if (numreg.test(pwd) || codereg.test(pwd)) {
                    errorMes = '密码格式有误';
                }
            }
        }

        if (errorMes) {
            $('.cot').html(errorMes);
        } else {
            // 检测是否是登录或注册
            if ($(this).hasClass('login')) {
                // 登录发送密码
                $.ajax({
                    url: '/api/login',
                    dataType: 'json',
                    type: 'post',
                    data: {
                        user: user,
                        pwd: pwd
                    },
                    success: function(data) {
                        if (data.code) {
                            history.go(-1);
                            storge.setItem('logincode', 1);
                        } else {
                            alert(data.mes);
                        }
                    }
                })
            } else {
                // 注册
                $.ajax({
                    url: '/api/reglogin',
                    dataType: 'json',
                    type: 'post',
                    data: {
                        user: user,
                        pwd: pwd
                    },
                    success: function() {
                        if (data.code) {
                            alert('注册成功!')
                        }
                    }
                })
            }
        }
    });
    $('.eye').on('click', function() {
        $(this).toggleClass('active');
        if ($(this).hasClass('active')) {
            $('.pwd').attr('type', 'text');
        } else {
            $('.pwd').attr('type', 'password');
        }
    })
});