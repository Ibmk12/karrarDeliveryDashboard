module.exports = {
  devServer: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_API_URL || 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
};
