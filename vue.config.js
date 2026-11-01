// shown in the login footer so it's easy to see which build is live
process.env.VUE_APP_VERSION = require('./package.json').version;
process.env.VUE_APP_BUILD_DATE = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

const apiUrl = process.env.VUE_APP_API_URL || 'https://karrardelivery.onrender.com';

// "share" mode (npm run share): the app is opened through a public tunnel URL.
// The browser then calls the API on the same origin (/api/...) and this dev
// server forwards those calls to the local Spring Boot backend.
const isShare = process.env.SHARE_MODE === 'true';
const proxyTarget = isShare ? (process.env.API_PROXY_TARGET || 'http://localhost:8080') : apiUrl;

module.exports = {
  devServer: {
    port: 3000, // You can change this to any port number you prefer
    // allow the tunnel's hostname (e.g. *.trycloudflare.com) only in share mode
    allowedHosts: isShare ? 'all' : 'auto',
    client: isShare ? { webSocketURL: 'auto://0.0.0.0:0/ws' } : undefined,
    proxy: {
      '/api': {
        target: proxyTarget,
        changeOrigin: true,
        secure: false,
        // the backend's CORS list allows http://localhost:3000, so present
        // tunnelled requests as coming from there
        onProxyReq: isShare
          ? (proxyReq) => proxyReq.setHeader('origin', 'http://localhost:3000')
          : undefined
      }
    }
  },
  // Disable linting during build
  lintOnSave: false
}
