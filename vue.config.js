module.exports = {
  devServer: {
    port: 3000, // You can change this to any port number you prefer
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  }
}
