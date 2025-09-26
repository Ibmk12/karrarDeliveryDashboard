module.exports = {
  devServer: {
    port: 3000, // You can change this to any port number you prefer
    proxy: {
      '/api': {
        target: 'https://karrardelivery.onrender.com',
        changeOrigin: true,
        secure: false
      }
    }
  }
}
