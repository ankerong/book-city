var gulp = require('gulp');
var server = require('gulp-webserver');
var path = require('path');
var fs = require('fs');
var url = require('url');
var css = require('gulp-clean-css'); // 压缩css
var sass = require('gulp-sass'); // 编译sass
var autoprefixer = require('gulp-autoprefixer');
var mock = require('./mock/home');
var loginData = require('./mock/login/user').loginInfo;
var es5 = require('gulp-babel'); // 转es5
var uglify = require('gulp-uglify'); // 压缩js
var minhtml = require('gulp-htmlmin'); // 压缩html
// console.log(mock);
// 编译scss压缩scss
gulp.task('mincss', function() {
    gulp.src('src/scss/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(css())
        .pipe(gulp.dest('build/css'));
});
// 转义到dest下的js里
gulp.task('minjs', function() {
    gulp.src('src/js/**/*.js')
        .pipe(gulp.dest('build/js'));
});

// 转义到dest下的html里
gulp.task('minhtml', function() {
    gulp.src('src/**/*.html')
        .pipe(minhtml({
            removeComments: false,
            collapseWhitespace: false,
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('server', function() {
    gulp.src('src')
        .pipe(server({
            port: 3030,
            host: 'localhost',
            open: true,
            middleware: function(req, res, next) {
                if (req.url === '/favicon.ico') {
                    return false;
                }
                var pathname = url.parse(req.url).pathname;
                pathname = pathname === '/' ? '/index.html' : pathname;
                if (/\/api\//.test(pathname)) {
                    // post登录的接口
                    if (pathname === '/api/login' || pathname === '/api/reglogin') {
                        var arr = [];
                        req.on('data', function(chunk) {
                            arr.push(chunk);
                        });
                        req.on('end', function() {
                            var data = Buffer.concat(arr).toString();
                            data = require('querystring').parse(data);
                            if (pathname === '/api/login') {
                                // 进行查找登录
                                var finish = loginData.some(function(v) {
                                    return v.user == data.user && v.pwd == data.pwd;
                                })
                                if (finish) {
                                    res.end('{"code":1,"mes":"登录成功"}');
                                } else {
                                    res.end('{"code":0,"mes":"用户名或密码错误"}');
                                }
                            } else {
                                // 进行添加注册
                                loginData.push(data);
                                var regData = {
                                    loginInfo: loginData
                                };
                                fs.writeFileSync('./mock/login/user.json');
                                JSON.stringify(regData);
                                res.end('{"code":1,"mes":"注册成功}');
                            }
                        });
                        return false;
                    }
                    res.end(JSON.stringify(mock(req.url)));
                } else {
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)));
                }
            }
        }))
})
gulp.task('watch', function() {
    gulp.watch(['src/scss/*.scss'], ['mincss']);
})
gulp.task('dev', ['watch', 'server']);

gulp.task('devserver', function() {
    gulp.src('build')
        .pipe(server({
            port: 3030,
            host: 'localhost',
            open: true,
            middleware: function(req, res, next) {
                if (req.url === '/favicon.ico') {
                    return false;
                }
                var pathname = url.parse(req.url).pathname;
                pathname = pathname === '/' ? '/index.html' : pathname;
                if (/\/api\//.test(pathname)) {
                    // post登录的接口
                    if (pathname === '/api/login' || pathname === '/api/reglogin') {
                        var arr = [];
                        req.on('data', function(chunk) {
                            arr.push(chunk);
                        });
                        req.on('end', function() {
                            var data = Buffer.concat(arr).toString();
                            data = require('querystring').parse(data);
                            if (pathname === '/api/login') {
                                // 进行查找登录
                                var finish = loginData.some(function(v) {
                                    return v.user == data.user && v.pwd == data.pwd;
                                })
                                if (finish) {
                                    res.end('{"code":1,"mes":"登录成功"}');
                                } else {
                                    res.end('{"code":0,"mes":"用户名或密码错误"}');
                                }
                            } else {
                                // 进行添加注册
                                loginData.push(data);
                                var regData = {
                                    loginInfo: loginData
                                };
                                fs.writeFileSync('./mock/login/user.json');
                                JSON.stringify(regData);
                                res.end('{"code":1,"mes":"注册成功}');
                            }
                        });
                        return false;
                    }
                    res.end(JSON.stringify(mock(req.url)));
                } else {
                    res.end(fs.readFileSync(path.join(__dirname, 'build', pathname)));
                }
            }
        }))
})
gulp.task('build', ['mincss', 'minjs', 'minhtml', 'devserver'])