const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://mirimlab2nd.myds.me:5555',
            changeOrigin: true,
        })
    );
};