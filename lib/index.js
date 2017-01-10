/*
(1)在app.use这个阶段注册的插件https://github.com/dora-js/dora/blob/master/docs/Understand-Dora-Plugin.md
   这个时间点的插件可以处理 http 的网络请求。
(2)需要注意下的是，在插件模块里，middleware 这个字段对应的函数，一定要返回一个 koa 的中间件（比如上面的代码里，返回了 koa-webpack-dev-middleware 中间件，
   也可以返回自己写的中间件，更多细节请查阅 koa 中间件相关资料），dora 会帮你调用 app.use 来注册这个返回的中间件；除此外的 middleware.before, middleware.after, 
   server.before, server.after 这 4 个时间点的函数，都是普通的任意函数。
*/

module.exports = {
  'middleware': function() {
    var query = this.query;
    var middleware = require('connect-history-api-fallback')({
      index: query.index || '/index.html',
      //把请求导向一个页面，当满足下面任意一个条件的
      //get请求;接受text/html;非直接请求，如请求的path不包含'.';【不满足】我们在rewrite里面配置的格式，这几种情况我们都会导向到
      //index.html文件（满足了rewrite那么我们不需要重定向）
      rewrites: query.rewrites,
    });

    var noop = function() {};

    return function* (next) {
      middleware(this, null, noop);
      yield next;
    };
  },
};
