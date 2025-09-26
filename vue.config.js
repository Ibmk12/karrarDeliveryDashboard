const apiUrl = process.env.VUE_APP_API_URL || 'https://karrardelivery.onrender.com';

module.exports = {
  devServer: {
    port: 3000, // You can change this to any port number you prefer
    proxy: {
      '/api': {
        target: apiUrl,
        changeOrigin: true,
        secure: false
      }
    }
  },
  // Disable linting during build
  lintOnSave: false
}
