const apiUrl = process.env.VUE_APP_API_URL || 
  (process.env.NODE_ENV === 'development' 
    ? 'http://localhost:8080'
    : 'https://karrardelivery.onrender.com');

module.exports = {
  lintOnSave: false,
  devServer: {
    port: 3000,
    proxy: {
      '/api': {
        target: apiUrl,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
};
