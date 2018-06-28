require.config({
    baseUrl: '/js/',
    paths: {
        jquery: 'lib/jquery',
        index: 'index/index',
        zepto: 'lib/zepto',
        Swiper: 'lib/swiper-4.1.6.min',
        text: 'lib/require.text',
        template: '../template/',
        handlebars: 'lib/handlebars-v4.0.11',
        compile: 'compile/compile',
        search: 'search/search',
        detail: 'detail/detail',
        getUrl: 'compile/getUrl',
        menu: 'menu/menu',
        content: 'text/text',
        base64: 'lib/jquery.base64',
        login: 'login/login'
    },
    shim: {
        base64: {
            exports: 'base64',
            deps: ['jquery']
        }
    }
})