riot.compile(function() {
    riot.mount('app');

    router.routes([
        new Router.DefaultRoute({tag: 'manage-dashboard'}),
        new Router.NotFoundRoute({tag: 'common-notfound'}),

        new Router.Route({tag: 'manage-dashboard', path: '/manage/dashboard'}),
        new Router.Route({tag: 'plugin-dynmap', path: '/plugin/dynmap'}),
        new Router.Route({tag: 'common-footer'}),
    ]);

    router.start();
});